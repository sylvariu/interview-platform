import React, { useEffect, useState } from "react";
import { problemsApi } from "../../shared/api/problems.api.ts";
import type { Problem } from "../../types/types.ts";
import {ProblemCard} from "../../components/problems/ProblemCard.tsx";
import {difficulties, difficultyLabels} from "../../shared/constants/problemFilters.ts";
import {useFavoritesStore} from "../../store/favorites.store.ts";
import {useCompletedStore} from "../../store/completed.store.ts";

export const ProblemsPage: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [category, setCategory] = useState("");

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showAllTags, setShowAllTags] = useState(false);

    const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
    useEffect(() => {
        loadFavorites();
    },[]);

    const loadCompleted = useCompletedStore((s) => s.loadCompleted);
    useEffect(() => {
        loadCompleted();
    }, []);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    const tagCounts = problems.reduce<Record<string, number>>(
        (acc, problem) => {
            problem.tags.forEach((tag) => {
                acc[tag] = (acc[tag] || 0) + 1;
            });

            return acc;
        },
        {}
    );
    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => {
            const aSelected = selectedTags.includes(a[0]);
            const bSelected = selectedTags.includes(b[0]);

            if (aSelected !== bSelected) {
                return aSelected ? -1 : 1;
            }

            return b[1] - a[1];
        })
        .map(([tag]) => tag);
    const visibleTags = showAllTags
        ? sortedTags
        : sortedTags.slice(0, 6);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch =
            problem.title.toLowerCase().includes(search.toLowerCase());

        const matchesDifficulty =
            !difficulty || problem.difficulty === difficulty;

        const matchesCategory =
            !category || problem.category === category;

        const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => problem.tags.includes(tag));

        return (matchesSearch && matchesDifficulty && matchesCategory && matchesTags);
    });

    const hasFilters =
        search || difficulty || category || selectedTags.length > 0;

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const data = await problemsApi.getAll();
                setProblems(data);
            } catch (err) {
                setError("Не удалось загрузить задачи");
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    if (loading) return <div>Загрузка задач...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="max-w-[75%] mx-auto space-y-4">
            <h2 className="p-6 text-2xl font-bold text-[var(--van-dyke)]">Задачи для тренировки</h2>
            <div className="grid grid-cols-[260px_1fr] gap-8">
                <div className="sticky top-6 space-y-6">
                    {/* поиск */}
                    <div>
                        <p className="font-semibold mb-2 text-[var(--accent-color)]">Поиск</p>
                        <input
                            type="text"
                            placeholder="Название задачи..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300
                                rounded-md px-3 py-2 pr-10 appearance-none
                                hover:border-gray-300 transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>
                    {/* сложность */}
                    <div>
                        <p className="font-semibold mb-2 text-[var(--accent-color)]">Сложность</p>
                        <div className="relative">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full border border-gray-300
                                rounded-md px-3 py-2 pr-10 appearance-none
                                 hover:border-gray-300 transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                <option value="">Все</option>
                                {difficulties.map((d) => (
                                    <option key={d} value={d}>
                                        {difficultyLabels[d]}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-sm">▼</span>
                        </div>
                    </div>

                    {/*теги*/}
                    <div>
                        <p className="font-semibold mb-2 text-[var(--accent-color)]">Теги</p>
                        <div className="flex flex-wrap gap-2">
                            {visibleTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`text-xs px-2 py-1 rounded transition
                                            ${selectedTags.includes(tag)
                                        ? "bg-[var(--pink-lavender)] text-[var(--van-dyke)]"
                                        : "bg-[var(--isabelline)] hover:bg-gray-300"}`}>
                                    {tag}
                                    <span className="opacity-90"> ({tagCounts[tag]})</span>
                                </button>
                            ))}
                        </div>
                        {sortedTags.length > 6 && (
                            <button
                                onClick={() => setShowAllTags(!showAllTags)}
                                className="text-xs text-[var(--accent-color)] hover:underline mt-2"
                            >
                                {showAllTags ? "Свернуть" : "Показать ещё"}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setSearch("");
                            setDifficulty("");
                            setCategory("");
                            setSelectedTags([]);
                        }}
                        className={`text-sm cursor-pointer px-2 py-1 rounded-md bg-transparent
                ${hasFilters ? " text-[var(--van-dyke)] border-[var(--van-dyke)] border-solid border-1" : " text-gray-400 border-gray-300 border-solid border-1"}`}
                    >
                        Сбросить фильтры
                    </button>
                </div>

                <div className="space-y-4">
                    {filteredProblems.length === 0 && (
                        <p>Ничего не найдено</p>
                    )}

                    {filteredProblems.length !== 0 && (
                        <p className="text-sm text-gray-500">
                            Найдено задач: {filteredProblems.length}
                        </p>)}
                    {filteredProblems.map((problem) => (
                        <ProblemCard key={problem.id} problem={problem} />
                    ))}
                </div>
            </div>

        </div>

    );
};