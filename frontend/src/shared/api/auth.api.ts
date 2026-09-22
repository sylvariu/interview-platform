import { api } from "./axios";
import type {ApiError, AuthResponse, LoginRequest, RegisterRequest, User} from "../../types/types.ts";
import axios from "axios";

export const authApi = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/register', data);

            console.log('Register response:', response.data); // Проверьте структуру ответа
            return response.data;
        } catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                throw new Error(error.response?.data?.message || 'Ошибка регистрации');
            }
            throw new Error('Ошибка сети');
        }

    },

    async login (data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/login', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                throw new Error(error.response?.data?.message || 'Ошибка входа');
            }
            throw new Error('Ошибка сети');
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    },

    async refresh(): Promise<AuthResponse> {
        try {
            const response = await api.post('/auth/refresh');
            return response.data;
        } catch (error) {
            throw new Error('Не удалось обновить токен');
        }
    },

    async getMe (): Promise<User> {
        try {
            //const accessToken = localStorage.getItem('accessToken');
            const response = await api.get<User>('/auth/@me');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                throw new Error(error.response?.data?.message || 'Ошибка получения данных пользователя');
            }
            throw new Error('Ошибка сети');
        }
    }

};