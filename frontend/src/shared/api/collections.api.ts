import { api } from './axios';
import type {Collection} from "../../types/types.ts";

export const collectionsApi = {
    getAll: async () => {
        const { data } = await api.get<Collection[]>("/collections");
        return data;
    },

    getWithProblem: async (problemId: string) => {
        const { data } = await api.get<Collection[]>(
            `/collections/collections-status?problemId=${problemId}`
        );
        return data;
    },

    updateProblemCollections: async (
        problemId: string,
        collectionIds: string[]
    ) => {
        const { data } = await api.post(
            "/collections/update-problem-collections",
            { problemId, collectionIds }
        );
        return data;
    },

    create: async (name: string) => {
        const { data } = await api.post("/collections", { name });
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/collections/${id}`);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/collections/${id}`);
        return data;
    },

    update: async (id: string, name: string) => {
        const { data } = await api.patch(`/collections/${id}`, { name });
        return data;
    },
};
