import type {Question} from "../../types/types.ts";

export const getQuestionsProgress = (questions: Question[]) => {
    const total = questions.length;

    const learned = questions.filter((q) => q.progress?.status === 'LEARNED').length;

    const review = questions.filter((q) => q.progress?.status === 'REVIEW').length;

    const hard = questions.filter((q) => q.progress?.status === 'HARD').length;

    return {
        total,
        learned,
        review,
        hard,

        learnedPercent: total
            ? (learned / total) * 100
            : 0,

        reviewPercent: total
            ? (review / total) * 100
            : 0,

        hardPercent: total
            ? (hard / total) * 100
            : 0,

        completed:
            learned + review + hard,

        completedPercent: total
            ? ((learned + review + hard) / total) * 100
            : 0,
    };
};