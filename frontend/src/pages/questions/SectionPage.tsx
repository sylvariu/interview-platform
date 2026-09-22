import { useEffect, useState } from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import { useQuestionsStore } from "../../store/questions.store.ts";
import {useTopicsStore} from "../../store/topics.store.ts";
import {iconsMap} from "../../shared/constants/icons.ts";
import {getQuestionsProgress} from "../../components/questions/getQuestionsProgress.ts";
import {QuestionsProgress} from "../../components/questions/QuestionsProgressBar.tsx";
import type {QuestionLearningStatus} from "../../types/types.ts";

export const SectionPage = () => {
    const { sectionId } = useParams();
    const navigate = useNavigate();

    const { sectionData, fetchSection, loading } = useQuestionsStore();
    const { currentSection, fetchSectionById } = useTopicsStore();

    const [openTopics, setOpenTopics] = useState<string[]>([]);

    useEffect(() => {
        if (sectionId) {
            fetchSection(sectionId); //раздел и его вопросы
            fetchSectionById(sectionId); //название
        }
    }, [sectionId]);

    const toggleTopic = (topicId: string) => {
        setOpenTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );};

    const allQuestions = sectionData.flatMap(
        (topic) => topic.questions
    );

    const progress = getQuestionsProgress(allQuestions);

    const statusColor:Record<QuestionLearningStatus,string> = {
        LEARNED: "bg-green-500",
        REVIEW: "bg-yellow-400",
        HARD: "bg-red-400",
    }

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    return (
        <div className="p-6 max-w-[75%] mx-auto space-y-6">
            {/* 🔙 Назад */}
            <button
                onClick={() => navigate(`/questions`)}
                className="flex items-center gap-1 text-sm font-medium text-[var(--pink-lavender)] hover:text-[var(--van-dyke)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="12" width="12">
                    <path
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                </svg>
                Назад к категориям
            </button>
            {/* Заголовок */}
            <div className='flex gap-5'>
                {currentSection &&
                    <img
                        src={iconsMap[currentSection.icon]}
                        alt={currentSection.name}
                        className="w-30 h-30 bg-[var(--isabelline)] border-10 border-[var(--isabelline)] rounded-lg"
                    />}
                <h1 className="text-2xl font-bold text-[var(--van-dyke)]">{currentSection?.name || "Раздел"}</h1>
            </div>

            <div className="bg-[var(--isabelline)] border border-[#e5e7eb] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                        <h2 className="font-bold text-[var(--van-dyke)]">
                            Прогресс раздела
                        </h2>

                        <div className="flex gap-1.5 text-sm items-center">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500 translate-y-1/12" />
                                <span className="font-bold text-green-500">{progress.learned}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="relative w-3 h-3 rounded-full bg-yellow-400 translate-y-1/12" />
                                <span className="font-bold text-yellow-400">{progress.review}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-400 translate-y-1/12" />
                                <span className="font-bold text-red-400">{progress.hard}</span>
                            </div>

                            <p className="text-sm text-[var(--accent-color)]">
                                из {progress.total} вопросов
                            </p>
                        </div>
                </div>

                <QuestionsProgress
                    learnedPercent={progress.learnedPercent}
                    reviewPercent={progress.reviewPercent}
                    hardPercent={progress.hardPercent}
                />
            </div>

            {/* Темы */}
            <div className="space-y-4">
                {sectionData.map((topic) => (
                    <div
                        key={topic.id}
                        className="border border-[#e5e7eb] rounded-xl overflow-hidden bg-[var(--isabelline)]">
                        {/* Заголовок темы */}
                        <div
                            className="p-4 cursor-pointer flex justify-between items-center  "
                            onClick={() => toggleTopic(topic.id)}>
                            <span className="font-medium text-[var(--van-dyke)]">{topic.name}</span>
                            <span className="text-sm text-gray-500">
                                {openTopics.includes(topic.id) ? "▲" : "▼"}
                            </span>
                        </div>

                        {/* Вопросы */}
                        {openTopics.includes(topic.id) && (
                            <div className="px-4 pb-4 space-y-2">
                                {topic.questions.length === 0 ? (
                                    <div className="text-gray-400 text-sm">
                                        Нет вопросов
                                    </div>
                                ) : (
                                    topic.questions.map((q) => (
                                        <Link
                                            key={q.id}
                                            to={`/questions/section/${sectionId}/question/${q.id}`}>
                                            <div className="flex gap-1 items-center text-md text-[var(--accent-color)] hover:text-[var(--van-dyke)] cursor-pointer">
                                                <strong>{q.order}. </strong>
                                                <div
                                                    className={`w-3 h-3 rounded-full 
                                                        ${q.progress?.status
                                                        ? statusColor[q.progress.status]
                                                        : 'bg-[var(--isabelline)] border border-[var(--isa-darker)]'}`}
                                                    title={
                                                        q.progress?.status === 'LEARNED'
                                                            ? 'Изучено'
                                                            : q.progress?.status === 'REVIEW'
                                                                ? 'Нужно повторить'
                                                                : q.progress?.status === 'HARD'
                                                                    ? 'Плохо знаю'
                                                                    : 'Нет отметки'
                                                    }/>
                                                {q.question}
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};