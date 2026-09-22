import { create } from "zustand";
import { favoritesApi } from "../shared/api/favorites.api";

interface FavoritesState {
    favorites: string[];
    toggleFavorite: (problemId: string) => Promise<void>;
    loadFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
    favorites: [],

    async loadFavorites() {
        const { data } = await favoritesApi.getAll();
        const ids = data.map((f: any) => f.problemId);
        set({ favorites: ids });
    },

    async toggleFavorite(problemId) {
        const { data } = await favoritesApi.toggle(problemId);
        set((state) => {
            if (data.isFavorite) {
                return {
                    favorites: [...state.favorites, problemId],
                };
            }
            return {
                favorites: state.favorites.filter((id) => id !== problemId),
            };
        });
    },
}));