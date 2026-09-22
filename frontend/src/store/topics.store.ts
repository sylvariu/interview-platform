import {create} from "zustand";
import {topicsApi} from "../shared/api/topics.api.ts";
import type {RootTopic, Topic} from "../types/types.ts";

type State = {
    // категории + разделы
    sections: RootTopic[];

    // темы выбранного раздела
    topics: Topic[];

    // текущий раздел
    currentSectionId: string | null;

    loading: boolean;

    // методы
    fetchSections: () => Promise<void>;
    fetchTopics: (sectionId: string) => Promise<void>;

    setCurrentSection: (id: string) => void;

    currentSection: Topic | null;
    fetchSectionById: (id: string) => Promise<void>;
};

export const useTopicsStore = create<State>((set) => ({
    sections: [],
    topics: [],
    currentSectionId: null,
    loading: false,
    currentSection: null,

    fetchSections: async () => {
        set({ loading: true });
        const data = await topicsApi.getSections();
        set({
            sections: data,
            loading: false,
        });
    },
    fetchTopics: async (sectionId) => {
        set({ loading: true });
        const data = await topicsApi.getChildren(sectionId);
        set({
            topics: data,
            currentSectionId: sectionId,
            loading: false,
        });
    },
    setCurrentSection: (id) => {
        set({ currentSectionId: id });
    },
    fetchSectionById: async (id: string) => {
        const data = await topicsApi.getOne(id);
        set({ currentSection: data });
    },
}));