/*import React from "react";
import {categories, categoryLabels, difficulties, difficultyLabels} from "../../shared/constants/problemFilters";

interface Props {
    search: string;
    setSearch: (v: string) => void;

    difficulty: string;
    setDifficulty: (v: string) => void;

    category: string;
    setCategory: (v: string) => void;

    selectedTags: string[];
    toggleTag: (tag: string) => void;

    visibleTags: string[];
    tagCounts: Record<string, number>;

    sortedTags: string[];
    showAllTags: boolean;
    setShowAllTags: (v: boolean) => void;

    hasFilters: boolean;

    resetFilters: () => void;
}

export const ProblemsFilters: React.FC<Props> = ({
                                                     search,
                                                     setSearch,
                                                     difficulty,
                                                     setDifficulty,
                                                     category,
                                                     setCategory,
                                                     selectedTags,
                                                     toggleTag,
                                                     visibleTags,
                                                     tagCounts,
                                                     sortedTags,
                                                     showAllTags,
                                                     setShowAllTags,
                                                     hasFilters,
                                                     resetFilters
                                                 }) => {
    return (
        <div className="sticky top-6 space-y-6">

            <div>
                <p className="font-semibold mb-2">Поиск</p>
                <input
                    type="text"
                    placeholder="Название задачи..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300
                                rounded-md px-3 py-2 pr-10 appearance-none
                                bg-white hover:border-gray-300 transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
            </div>

            <div>
                <p className="font-semibold mb-2">Сложность</p>
                <div className="relative">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full border border-gray-300
                                rounded-md px-3 py-2 pr-10 appearance-none
                                bg-white hover:border-gray-300 transition cursor-pointer
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

            <div>
                <p className="font-semibold mb-2">Категория</p>
                <div className="relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300
                                rounded-md px-3 py-2 pr-10 appearance-none
                                bg-white hover:border-gray-300 transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
                        <option value="">Все</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {categoryLabels[c]}
                            </option>
                        ))}
                    </select>

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-sm">▼</span>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Теги</p>
                <div className="flex flex-wrap gap-2">
                    {visibleTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`text-xs px-2 py-1 rounded transition
                                            ${selectedTags.includes(tag)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300"}`}>
                            {tag}
                            <span className="opacity-70"> ({tagCounts[tag]})</span>
                        </button>
                    ))}
                </div>
                {sortedTags.length > 6 && (
                    <button
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-xs text-blue-500 hover:underline mt-2"
                    >
                        {showAllTags ? "Свернуть" : "Показать ещё"}
                    </button>
                )}
            </div>

            <button
                onClick={() => {
                    resetFilters
                }}
                className={`text-sm cursor-pointer px-2 py-1 rounded-md bg-transparent
                ${hasFilters ? " text-gray-700 border-gray-600 border-solid border-1" : " text-gray-500 border-gray-400 border-solid border-1"}`}
            >
                Сбросить фильтры
            </button>
        </div>
    );
};*/