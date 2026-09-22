export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    tags: string[];
    solution: string;
    createdAt: string;
}

export interface Progress {
    total: number;
    difficulty: {
        EASY: number;
        MEDIUM: number;
        HARD: number;
    };
    tags: Record<string, number>;
}

export interface Collection {
    id: string;
    name: string;
    hasProblem?: boolean;
    problems?: any[];
}

export type Category =
    | 'FRONTEND'
    | 'BACKEND'
    | 'DEVOPS'
    | 'DATABASES'
    | 'SYSTEM_DESIGN'
    | 'ALGORITHMS';

export interface Interview {
    id: string;
    startedAt: string;
    report?: {
        category: Category;
        score: number;
        feedback: string;
        strengths: string[];
        weaknesses: string[];
    };
}

export type Role = 'USER' | 'AI';

export interface Message {
    role: Role;
    text: string;
    audio?: string;
}

export interface Report {
    category: Category;
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
}

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export type QuestionLearningStatus =
    | 'LEARNED'
    | 'REVIEW'
    | 'HARD';

export interface Question {
    id: string;
    question: string;
    answer?: string;
    category: Category;
    topicId: string;
    topic?: {
        id: string;
        name: string;
        parentId: string;
    }; //кажется topic не используется нигде, но оставлю
    order: number;
    progress?: { status: QuestionLearningStatus; } | null;
}

export interface SectionTopic {
    id: string;
    name: string;
    questions: Question[];
}

export interface Topic {
    id: string;
    name: string;
    parentId?: string;
    icon: string,
}

export interface RootTopic {
    id: string;
    name: string;
    children: Topic[];
}

export const CATEGORY_LIST: Category[] = [
    'FRONTEND',
    'BACKEND',
    'DEVOPS',
    'DATABASES',
    'SYSTEM_DESIGN',
    'ALGORITHMS',
];

export const CATEGORY_LABELS: Record<Category | string, string> = {
    FRONTEND: 'Фронтенд',
    BACKEND: 'Бэкенд',
    DEVOPS: 'DevOps',
    DATABASES: 'Базы данных',
    SYSTEM_DESIGN: 'Проектирование систем',
    ALGORITHMS: 'Алгоритмы',
};

export interface SectionProgress {
    sectionId: string;
    sectionName: string;

    total: number;

    learned: number;
    review: number;
    hard: number;

    completed: number;

    completedPercent: number;

    learnedPercent: number;
    reviewPercent: number;
    hardPercent: number;
}

export interface CategoryProgress {
    categoryId: string;
    categoryName: string;

    sections: SectionProgress[];
}