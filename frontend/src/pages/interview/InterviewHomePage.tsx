import {useEffect, useState} from "react";
import {type Category, CATEGORY_LABELS, type Interview} from "../../types/types.ts";
import {useNavigate} from "react-router-dom";
import {ReportModal} from "../../components/interview/ReportModal.tsx";
import {useInterviewStore} from "../../store/interview.store.ts";
import {InterviewChoiceModal} from "../../components/interview/InterviewChoiceModal.tsx";
import {categoryReportColors} from "../../shared/constants/colors.ts";

export const InterviewHomePage = () => {
    const {
        interviews,
        loadInterviews,
        start,
    } = useInterviewStore();

    const [showModal, setShowModal] = useState(false);

    const [selected, setSelected] = useState<Interview | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadInterviews();
    }, []);

    const handleStart = async () => {
        setShowModal(true);
    };
    const handleSelectCategory = async (category: Category) => {
        const res = await start(category);

        navigate(`/interview/${res.interviewId}`, {
            state: {
                firstQuestion: res.question,
            },
        });

        setShowModal(false);
    };

    return (
        <div className="p-6 max-w-[70%] mx-auto">

            <section className="w-[100%] bg-gradient-to-r from-[var(--accent-color)] to-80% to-[var(--pink-lavender)] rounded-2xl p-5
            flex justify-between items-center min-h-[200px] overflow-hidden mb-11 mt-6">
                <div className='max-w-[290px]'>
                    <p className="pb-3 text-[var(--isabelline)]">
                        Изучайте материал и повторяйте его в условиях технического собеседования с ИИ-интервьюером
                    </p>

                    <button
                        onClick={handleStart}
                        className="bg-[var(--isabelline)] text-[var(--accent-color)] px-4 py-1.5 rounded-lg font-semibold cursor-pointer"
                    >
                        Начать собеседование
                    </button>
                </div>

                <div className='bg-amber-200'>
                </div>
            </section>

            <div className='text-2xl font-bold mb-1 text-[var(--van-dyke)]'>Отчёты по прошлым интервью</div>

            <div className='mb-4 text-[var(--accent-color)]'>
                <span className=''>Здесь вы можете просмотреть фидбек по пройденными Вами интервью</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {interviews.map((i) => (
                    <div key={i.id}
                        onClick={() => i.report && setSelected(i)}
                        className="border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex flex-col w-full">
                            <h1 className={`h-1/2 flex items-center p-3 justify-start font-bold pt-10 rounded-t-lg
                            ${i.report?.category ? categoryReportColors[i.report?.category] : `bg-[var(--pink-lavender)] text-[var(--isabelline)]`}`}
                            >
                                {i.report?.category ? CATEGORY_LABELS[i.report.category] : 'Нет данных'}</h1>
                            <div className="h-1/2 p-3 flex flex-col gap-2 bg-[var(--isabelline)] rounded-b-lg">
                            <div className="flex gap-2 items-center text-[var(--van-dyke)] ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20">
                                    <path
                                        fill="currentColor"
                                        d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-32c0-17.7 14.3-32 32-32zm0 256c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l-64 0z"/></svg>
                                {new Date(i.startedAt).toLocaleString()}
                            </div>

                            <div className="flex gap-2 items-center text-[var(--van-dyke)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height="19">
                                    <path
                                        fill="currentColor"
                                        d="M48 195.8l209.2 86.1c9.8 4 20.2 6.1 30.8 6.1s21-2.1 30.8-6.1l242.4-99.8c9-3.7 14.8-12.4 14.8-22.1s-5.8-18.4-14.8-22.1L318.8 38.1C309 34.1 298.6 32 288 32s-21 2.1-30.8 6.1L14.8 137.9C5.8 141.6 0 150.3 0 160L0 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-260.2zm48 71.7L96 384c0 53 86 96 192 96s192-43 192-96l0-116.6-142.9 58.9c-15.6 6.4-32.2 9.7-49.1 9.7s-33.5-3.3-49.1-9.7L96 267.4z"/></svg>
                                {i.report ? i.report.score : 'Нет данных'}/10
                            </div>
                            </div>
                        </div>

                    </div>
                )).slice(0,10)}
            </div>

            {showModal && (
                <InterviewChoiceModal
                    onSelect={handleSelectCategory}
                    onClose={() => setShowModal(false)}
                />
            )}

            {selected && (
                <ReportModal
                    report={selected.report!}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
};