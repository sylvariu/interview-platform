import {api} from "./axios.ts";

export const topicsApi = {
    getSections: async () => {
        const { data } = await api.get('/topics/sections');
        return data;
    },

    getChildren: async (id: string) => {
        const { data } = await api.get(`/topics/children/${id}`);
        return data;
    },

    getOne: async (id: string) => {
        const { data } = await api.get(`/topics/${id}`);
        return data;
    }
};