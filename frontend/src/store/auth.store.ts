import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../shared/api/auth.api.ts'
import type { User, LoginRequest, RegisterRequest } from '../types/types.ts'

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    accessToken: string | null;

    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user) =>
                set({ user, isAuthenticated: !!user }),

            setLoading: (loading) =>
                set({ isLoading: loading }),

            checkAuth: async () => {
                try {
                    const { accessToken } = await authApi.refresh()
                    const user = await authApi.getMe()
                    set({
                        user,
                        accessToken,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch {
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false
                    })
                }
            },

            login: async (data) => {
                set({ isLoading: true })
                const { accessToken } = await authApi.login(data)
                const user = await authApi.getMe()
                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    isLoading: false
                })
            },

            register: async (data) => {
                set({ isLoading: true })
                const { accessToken } = await authApi.register(data)
                const user = await authApi.getMe()
                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                    isLoading: false
                })
            },

            logout: async () => {
                await authApi.logout()
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false
                })
            }

        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                accessToken: state.accessToken
            })
        }
    )
)