import React, { useState } from "react";
import type { Problem } from "../../types/types.ts"
import {useFavoritesStore} from "../../store/favorites.store.ts";
import {useCompletedStore} from "../../store/completed.store.ts";
import {CollectionsModal} from "./CollectionsModal.tsx";

import styles from './ProblemCard.module.css';

interface Props {
    problem: Problem;
}


export const ProblemCard: React.FC<Props> = ({ problem }) => {
    const [open, setOpen] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    const { favorites, toggleFavorite } = useFavoritesStore();
    const isFavorite = favorites.includes(problem.id);

    const { completed, toggleCompleted } = useCompletedStore();
    const isCompleted = completed.includes(problem.id);

    const [showCollections, setShowCollections] = useState(false);

    const difficultyColor:Record<string, string> = {
        EASY: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HARD: "bg-red-100 text-red-700",
    };

    return (
        <div className={styles.card}>
            <div className={styles.card_header}
                onClick={() => setOpen(!open)}>
                <h3 className={styles.card_title}>{problem.title}</h3>
                <div className={styles.card_title_info}>
                    <p className={`${styles.difficulty} ${difficultyColor[problem.difficulty]}`}>
                        {problem.difficulty}
                    </p>
                    <span className="text-[var(--accent-color)]"> {open ? "▲" : "▼"}</span>
                </div>
            </div>

            {open && (
                <div className="mt-4 border-t pt-4 space-y-3 text-[var(--van-dyke)]">
                    <p>{problem.description}</p>

                    {problem.tags.length > 0 && (
                        <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag) => (
                                    <span key={tag} className="text-xs bg-[var(--isa-darker)] px-2 py-1 rounded">{tag}</span>
                                ))}

                            </div>
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={() => toggleFavorite(problem.id)}
                                    className="text-xl">
                                    {isFavorite ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="20" width="20">
                                            <path
                                                fill="currentColor"
                                                d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/>
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="20" width="20">
                                            <path
                                                fill="currentColor"
                                                d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/>
                                        </svg>}
                                </button>

                                <button
                                    onClick={() => toggleCompleted(problem.id)}
                                    className="text-xl">
                                    {isCompleted ?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="20" width="20">
                                            <path
                                                fill="currentColor"
                                                d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18" width="18">
                                            <path
                                                fill="currentColor"
                                                d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/>
                                        </svg>}
                                </button>

                                <button
                                    onClick={() => setShowCollections(true)}
                                    className="text-xl"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20" width="20">
                                        <path
                                            fill="currentColor"
                                            d="M64 400l384 0c8.8 0 16-7.2 16-16l0-240c0-8.8-7.2-16-16-16l-149.3 0c-17.3 0-34.2-5.6-48-16L212.3 83.2c-2.8-2.1-6.1-3.2-9.6-3.2L64 80c-8.8 0-16 7.2-16 16l0 288c0 8.8 7.2 16 16 16zm384 48L64 448c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4L448 80c35.3 0 64 28.7 64 64l0 240c0 35.3-28.7 64-64 64z"/></svg>
                                </button>
                            </div>


                        </div>

                    )}

                    {problem.solution && (
                        <div className={styles.solution_box}>
                            <strong>Решение:</strong>
                            <p onClick={() => setShowSolution(!showSolution)}
                                className={`${styles.solution_text}
                                ${showSolution 
                                    ? styles.solution_visible
                                    : styles.solution_hidden} `}
                            >
                                {problem.solution}</p>
                        </div>
                    )}

                    {showCollections && (
                        <CollectionsModal
                            problemId={problem.id}
                            onClose={() => setShowCollections(false)}
                        />
                    )}

                </div>
            )}
        </div>
    );
};