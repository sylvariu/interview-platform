import { create } from 'zustand';
import { collectionsApi } from '../shared/api/collections.api.ts';
import type {Collection} from "../types/types.ts";

interface State {
    collections: Collection[];
    loading: boolean;

    fetchCollections: (problemId: string) => Promise<void>;
    updateCollections: (problemId: string, ids: string[]) => Promise<void>;
    createCollection: (name: string) => Promise<void>;

    currentCollection: any | null;

    fetchAll: () => Promise<void>;
    fetchOne: (id: string) => Promise<void>;
    deleteCollection: (id: string) => Promise<void>;
    updateCollectionName: (id: string, name: string) => Promise<void>;
}

export const useCollectionsStore = create<State>((set) => ({
    collections: [],
    loading: false,

    fetchCollections: async (problemId) => {
        set({ loading: true });
        const data = await collectionsApi.getWithProblem(problemId);
        set({ collections: Array.isArray(data) ? data : [], loading: false });
    },

    updateCollections: async (problemId, ids) => {
        await collectionsApi.updateProblemCollections(problemId, ids);

        // обновим локально
        set((state) => ({
            collections: state.collections.map((c) => ({
                ...c,
                hasProblem: ids.includes(c.id),
            })),
        }));
    },

    createCollection: async (name) => {
        const newCollection = await collectionsApi.create(name);

        set((state) => ({
            collections: [...state.collections, { ...newCollection, hasProblem: false }],
        }));
    },

    currentCollection: null,
    fetchAll: async () => {
        const data = await collectionsApi.getAll();
        set({
            collections: Array.isArray(data) ? data : [],
        });
    },

    fetchOne: async (id) => {
        const data = await collectionsApi.getById(id);
        set({ currentCollection: data });
    },

    deleteCollection: async (id: string) => {
        await collectionsApi.delete(id);

        set((state) => ({
            collections: state.collections.filter((c) => c.id !== id),
            currentCollection: null,
        }));
    },

    updateCollectionName: async (id: string, name: string) => {
        const updated = await collectionsApi.update(id, name);

        set((state) => ({
            collections: state.collections.map((c) =>
                c.id === id ? { ...c, name: updated.name } : c
            ),
            currentCollection: state.currentCollection
                ? { ...state.currentCollection, name: updated.name }
                : null,
        }));
    },
}));