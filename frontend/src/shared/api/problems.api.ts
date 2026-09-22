import { api } from './axios'
import type {Problem} from "../../types/types.ts";

export const problemsApi = {
    async getAll(): Promise<Problem[]> {
        const response = await api.get<Problem[]>('/problems');
        return response.data;
    },

    async getById(id: string): Promise<Problem> {
        const response = await api.get<Problem>(`/problems/${id}`);
        return response.data;
    }
};