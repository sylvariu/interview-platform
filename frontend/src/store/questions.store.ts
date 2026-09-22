import {create} from "zustand";
import {questionsApi} from "../shared/api/questions.api.ts";
import type {
    CategoryProgress,
    Question,
    QuestionLearningStatus,
    SectionTopic
} from "../types/types.ts";

type State = {
    questions: Question[];
    sectionData: SectionTopic[];
    currentQuestion: Question | null;
    loading: boolean;

    fetchAll: () => Promise<void>;
    fetchByTopic: (topicId: string) => Promise<void>;
    fetchByCategory: (category: string) => Promise<void>;
    fetchSection: (sectionId: string) => Promise<void>;
    fetchOne: (id: string) => Promise<void>;

    createQuestion: (data: {
        question: string;
        answer?: string;
        category: string;
        topicId: string;
    }) => Promise<void>;

    setProgress: (questionId: string, status: QuestionLearningStatus) => Promise<void>;
    sectionsProgress: CategoryProgress[]; //
    fetchSectionsProgress: () => Promise<void>;

    clearCurrent: () => void;
};

export const useQuestionsStore = create<State>((set) => ({
    questions: [],
    sectionData: [],
    currentQuestion: null,
    loading: false,
    sectionsProgress: [],

    fetchAll: async () => {
        set({ loading: true });
        const data = await questionsApi.getAll();
        set({ questions: data, loading: false });
    },

    fetchByTopic: async (topicId) => {
        set({ loading: true });
        const data = await questionsApi.getByTopic(topicId);
        set({ questions: data, loading: false });
    },

    fetchByCategory: async (category) => {
        set({ loading: true });
        const data = await questionsApi.getByCategory(category);
        set({ questions: data, loading: false });
    },

    fetchSection: async (id: string) => {
        set({ loading: true });
        const data = await questionsApi.getBySection(id);
        set({ sectionData: data, loading: false });
    },

    fetchOne: async (id) => {
        set({ loading: true });
        const data = await questionsApi.getOne(id);
        set({ currentQuestion: data, loading: false });
    },

    createQuestion: async (payload) => {
        const newQuestion = await questionsApi.create(payload);

        set((state) => ({
            questions: [newQuestion, ...state.questions],
        }));
    },

    setProgress: async (questionId, status) => {
        await questionsApi.setProgress(questionId, status);

        set((state) => ({
            questions: state.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        progress: { status },
                    }
                    : q
            ),

            currentQuestion:
                state.currentQuestion?.id === questionId
                    ? {
                        ...state.currentQuestion,
                        progress: { status },
                    }
                    : state.currentQuestion,
        }));
    },

    fetchSectionsProgress: async () => {
        const data = await questionsApi.getSectionsProgress();
        set({ sectionsProgress: data, });
    },

    clearCurrent: () => {
        set({ currentQuestion: null})
    }
}));