import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestionsStore } from "../../store/questions.store.ts";
import { MarkdownRenderer } from "../../components/MarkdownRenderer.tsx";
import { motion, AnimatePresence } from 'framer-motion';

export const QuestionItemPage = () => {
    const { sectionId, questionId } = useParams();
    const navigate = useNavigate();

    const {
        currentQuestion,
        fetchOne,
        sectionData,
        loading,
        fetchSection,
        setProgress
    } = useQuestionsStore();

    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        if (questionId) {
            fetchOne(questionId);
        }
    }, [questionId]);

    useEffect(() => {
        if (sectionId) {
            fetchSection(sectionId);
        }
    }, [sectionId]);

    // собираем ВСЕ вопросы из sectionData
    const flatQuestions = useMemo(() => {
        return sectionData.flatMap((t) => t.questions);
    }, [sectionData]);

    // текущий индекс
    const currentIndex = flatQuestions.findIndex((q) => q.id === questionId);//id);

    const prevQuestion = flatQuestions[currentIndex - 1];
    const nextQuestion = flatQuestions[currentIndex + 1];

    // сброс ответа при смене вопроса
    useEffect(() => {
        setShowAnswer(false);
    }, [questionId]); //id

    if (loading || !currentQuestion) {
        return <div className="p-4">Загрузка...</div>;
    }

    return (
        <div className="p-10 max-w-[75%] mx-auto space-y-6">
            {/* назад */}
            <button
                onClick={() => navigate(`/questions/section/${sectionId}`)}
                className="flex items-center gap-1 text-sm font-medium text-[var(--pink-lavender)] hover:text-[var(--van-dyke)] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="12" width="12">
                    <path
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                </svg>
                Назад к разделу
            </button>

            {/*номер вопроса */}
            {currentIndex !== -1 && (
                <div className="inline-block px-3 py-1 text-xs text-[var(--van-dyke)] bg-[var(--isabelline)] rounded-full">
                    Вопрос {currentIndex + 1} из {flatQuestions.length}
                </div>
            )}
            <div className="p-6 border border-[#e5e7eb] rounded-lg bg-[var(--isa-darker)]">
                <div className="flex justify-between items-center pb-4 px-2 border-b-1 border-[var(--accent-color)]">
                    <h1 className="text-xl font-bold text-[var(--van-dyke)]">
                        {currentQuestion.question}
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setProgress(currentQuestion.id, 'LEARNED')}
                            className={`p-2 cursor-pointer rounded-lg
                                ${currentQuestion.progress?.status == 'LEARNED'
                                ? `bg-[var(--van-dyke)] text-[var(--pink-lavender)] `
                                : `bg-[var(--isabelline)] text-[var(--accent-color)]`}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="12" width="12">
                                <path
                                    fill="currentColor"
                                    d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>

                        </button>
                        <button
                            onClick={() => setProgress(currentQuestion.id, 'REVIEW')}
                            className={`p-2 cursor-pointer rounded-lg items-center
                                ${currentQuestion.progress?.status == 'REVIEW'
                                ? `bg-[var(--van-dyke)] text-[var(--pink-lavender)] `
                                : `bg-[var(--isabelline)] text-[var(--accent-color)]`}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="12" width="12">
                                <path
                                    fill="currentColor"
                                    d="M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z"/></svg>
                        </button>
                        <button
                            onClick={() => setProgress(currentQuestion.id, 'HARD')}
                            className={`p-2 cursor-pointer rounded-lg
                                ${currentQuestion.progress?.status == 'HARD'
                                ? `bg-[var(--van-dyke)] text-[var(--pink-lavender)] `
                                : `bg-[var(--isabelline)] text-[var(--accent-color)]`}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="12" width="12">
                                <path
                                    fill="currentColor"
                                    d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>

                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center py-1 px-2 border-b-1 border-[var(--accent-color)] cursor-pointer"
                     onClick={() => setShowAnswer((prev) => !prev)}>
                    <p className="text-[var(--accent-color)] font-bold">Объяснение</p>
                    <button
                        className="px-4 py-2 text-[var(--accent-color)] hover:text-[var(--van-dyke)]">
                        {showAnswer ? '▲ Свернуть' : '▼ Показать'}
                    </button>
                    </div>
                    <AnimatePresence>
                        {showAnswer && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden">
                            <MarkdownRenderer
                                content={currentQuestion.answer || "Ответ не добавлен"} />
                            </motion.div>
                            )}
                            </AnimatePresence>
            </div>
            {/* Навигация */}
            <div className="flex justify-between pt-4">
                <button
                    disabled={!prevQuestion}
                    onClick={() =>
                        prevQuestion &&
                        navigate(`/questions/section/${sectionId}/question/${prevQuestion.id}`)
                    }
                    className="flex items-center justify-between gap-2 px-4 py-2 border border-[#e5e7eb] rounded-3xl disabled:opacity-30 text-[var(--accent-color)] bg-[var(--isabelline)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height="20" width="12">
                        <path
                            fill="currentColor"
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                    <div className="text-lg">Предыдущий</div>
                </button>

                <button
                    disabled={!nextQuestion}
                    onClick={() =>
                        nextQuestion &&
                        navigate(`/questions/section/${sectionId}/question/${nextQuestion.id}`)
                    }
                    className="flex items-center justify-between gap-2 px-4 py-2 border border-[#e5e7eb] rounded-3xl disabled:opacity-30 text-[var(--accent-color)] bg-[var(--isabelline)]"
                >
                    <div className="text-lg">Следующий</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height="20" width="12">
                        <path
                            fill="currentColor"
                            d="M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                </button>
            </div>
        </div>
    );
};