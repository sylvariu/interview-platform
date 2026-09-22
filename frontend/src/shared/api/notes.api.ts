import { api } from './axios.ts'; // твой настроенный instance

export const notesApi = {
    async create() {
        const { data } = await api.post('/notes');
        return data;
    },

    async getAll() {
        const { data } = await api.get('/notes');
        return data;
    },

    async getById(id: string) {
        const { data } = await api.get(`/notes/${id}`);
        return data;
    },

    async update(id: string, payload: { title?: string; content?: string }) {
        const { data } = await api.patch(`/notes/${id}`, payload);
        return data;
    },

    async delete(id: string) {
        const { data } = await api.delete(`/notes/${id}`);
        return data;
    },
};