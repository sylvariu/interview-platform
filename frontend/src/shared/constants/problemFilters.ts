export const difficulties = [
    "EASY",
    "MEDIUM",
    "HARD",
] as const;

export const categories = [
    "FRONTEND",
    "BACKEND",
    "ALGORITHMS",
    "DATABASES",
    "DEVOPS",
    "SYSTEM_DESIGN",
] as const;

export const categoryLabels: Record<string, string> = {
    FRONTEND: "Frontend",
    BACKEND: "Backend",
    ALGORITHMS: "Algorithms",
    DATABASES: "Databases",
    DEVOPS: "DevOps",
    SYSTEM_DESIGN: "System Design",
};

export const difficultyLabels: Record<string, string> = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
};