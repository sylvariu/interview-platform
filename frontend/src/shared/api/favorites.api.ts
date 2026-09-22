import { api } from "./axios";

export const favoritesApi = {
    toggle: (problemId: string) =>
        api.post(`/favorites/${problemId}`),

    getAll: () =>
        api.get("/favorites"),

    check: (problemId: string) =>
        api.get(`/favorites/${problemId}`),
};