import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTopicsStore } from "../../store/topics.store.ts";
import {iconsMap} from "../../shared/constants/icons.ts";
import {useQuestionsStore} from "../../store/questions.store.ts";
import {CATEGORY_LABELS} from "../../types/types.ts";

export const QuestionsPage = () => {
    const { sections, fetchSections, loading } = useTopicsStore();
    const { questions, fetchAll } = useQuestionsStore();

    const total = questions.length;
    const learned = questions.filter(
        (q) => q.progress?.status === 'LEARNED').length;
    const review = questions.filter(
        (q) => q.progress?.status === 'REVIEW').length;
    const hard = questions.filter(
        (q) => q.progress?.status === 'HARD').length;

    const learnedPercent = total ? ( learned / total ) * 100 : 0;
    const reviewPercent = total ? ( review / total ) * 100 : 0;
    const hardPercent = total ? ( hard / total ) * 100 : 0;


    useEffect(() => {
        fetchSections();
    }, []);

    useEffect(() => {
        fetchAll(); //для полосы прогресса
    }, []);

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    return (
        <div className="p-6 max-w-[75%] mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-[var(--van-dyke)]">Вопросы для подготовки</h1>

            <div className="bg-[var(--isabelline)] border border-[#e5e7eb] rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold text-[var(--van-dyke)]">
                            Общий прогресс
                        </h2>

                        <div className="flex gap-1.5 text-sm items-center">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500 translate-y-1/12" />
                                <span className="font-bold text-green-500">{learned}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="relative w-3 h-3 rounded-full bg-yellow-400 translate-y-1/12" />
                                <span className="font-bold text-yellow-400">{review}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-400 translate-y-1/12" />
                                <span className="font-bold text-red-400">{hard}</span>
                            </div>

                            <p className="text-sm text-[var(--accent-color)]">
                                из {total} вопросов
                            </p>
                        </div>

                    </div>

                    <div className="text-2xl font-bold text-[var(--van-dyke)]">
                        {total ? Math.round((learned / total) * 100) : 0} %
                    </div>
                </div>

                <div className="w-full h-4 bg-[#e5e7eb] rounded-full overflow-hidden flex">
                    <div
                        className="bg-green-500 transition-all duration-300"
                        style={{ width: `${learnedPercent}%` }}
                    />
                    <div
                        className="bg-yellow-400 transition-all duration-300"
                        style={{ width: `${reviewPercent}%` }}
                    />
                    <div
                        className="bg-red-400 transition-all duration-300"
                        style={{width: `${hardPercent}%` }}
                    />
                </div>
            </div>

            {sections.map((category) => (
                <div key={category.id}>
                    {/* Заголовок категории */}
                    <h2 className="text-2xl font-bold text-[var(--accent-color)] mb-4">
                        {CATEGORY_LABELS[category.name]}
                    </h2>

                    {/* Карточки разделов */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {category.children.map((section) => (
                            <Link
                                key={section.id}
                                to={`/questions/section/${section.id}`}
                            >
                                <div className="flex gap-5 items-center justify-start bg-[var(--isabelline)] p-4 border border-[#e5e7eb] rounded-xl hover:inset-shadow-lg transition cursor-pointer">
                                    <img
                                        src={iconsMap[section.icon]}
                                        alt={section.name}
                                        className="w-20 h-20 bg-[var(--bg-color)] border-7 border-[var(--bg-color)] rounded-lg"
                                    />
                                    <div className="text-lg font-medium text-[var(--van-dyke)]">
                                        {section.name}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};