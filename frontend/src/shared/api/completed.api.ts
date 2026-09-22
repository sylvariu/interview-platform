import { api } from "./axios";

export const completedApi = {
    toggle: (problemId: string) =>
        api.post(`/completed/${problemId}`),

    getAll: () =>
        api.get("/completed"),

    check: (problemId: string) =>
        api.get(`/completed/${problemId}`),

    getProgress: () =>
        api.get("/completed/progress"),
};