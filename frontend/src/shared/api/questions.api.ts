import {api} from "./axios.ts";
import type {QuestionLearningStatus} from "../../types/types.ts";

export const questionsApi = {
    getAll: async () => {
        const { data } = await api.get('/questions');
        return data;
    },

    getByTopic: async (topicId: string) => {
        const { data } = await api.get(`/questions/topic/${topicId}`);
        return data;
    },

    getByCategory: async (category: string) => {
        const { data } = await api.get(`/questions/category/${category}`);
        return data;
    },

    create: async (payload: {
        question: string;
        answer?: string;
        category: string;
        topicId: string;
    }) => {
        const { data } = await api.post('/questions', payload);
        return data;
    },

    getBySection: async (id: string) => {
        const { data } = await api.get(`/questions/section/${id}`);
        return data;
    },

    getOne: async (id: string) => {
        const { data } = await api.get(`/questions/${id}`);
        return data;
    },

    setProgress: async (questionId: string, status: QuestionLearningStatus) => {
        const { data } = await api.put(`/questions/${questionId}/progress`, { status });
        return data;
    },

    getSectionsProgress: async () => {
        const { data } = await api.get(
            '/questions/sections/progress'
        );

        return data;
    },

};