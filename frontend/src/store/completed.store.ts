import { create } from "zustand";
import { completedApi } from "../shared/api/completed.api";

interface CompletedState {
    completed: string[];
    toggleCompleted: (problemId: string) => Promise<void>;
    loadCompleted: () => Promise<void>;
}

export const useCompletedStore = create<CompletedState>((set) => ({
    completed: [],

    async loadCompleted() {
        const { data } = await completedApi.getAll();
        const ids = data.map((item: any) => item.problemId);
        set({ completed: ids });
    },

    async toggleCompleted(problemId) {
        const { data } = await completedApi.toggle(problemId);
        set((state) => {
            if (data.completed) {
                return {
                    completed: [...state.completed, problemId],
                };
            }
            return {
                completed: state.completed.filter((id) => id !== problemId),
            };
        });
    },
}));