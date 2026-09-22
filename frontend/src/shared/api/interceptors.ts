import { api } from "./axios.ts";
import { authApi } from "./auth.api";
import { useAuthStore } from "../../store/auth.store";

let isRefreshing = false;

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token as string);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = () => {
    api.interceptors.request.use(
        (config) => {
            const token = useAuthStore.getState().accessToken;

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );


    api.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config;
            if (!error.response) {
                return Promise.reject(error);
            }

            if (error.response.status === 401 && !originalRequest._retry) {
                if (originalRequest.url === "/auth/refresh") {
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            resolve,
                            reject
                        });
                    })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    const { accessToken } = await authApi.refresh();
                    useAuthStore.setState({
                        accessToken
                    });
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    processQueue(null, accessToken);
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    useAuthStore.setState({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false
                    });
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return Promise.reject(error);
        }
    );
};