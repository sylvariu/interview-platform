import {useEffect} from "react";
import {CATEGORY_LABELS, type Report} from "../../types/types.ts";

interface Props {
    report: Report;
    onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ report, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-[var(--van-dyke)]/50 flex items-center justify-center p-4"
             onClick={onClose}>
            <div className="bg-[var(--bg-color)] w-[70%] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative
                    [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:bg-[var(--accent-color)] [&::-webkit-scrollbar-track]:rounded
                    [&::-webkit-scrollbar-thumb]:bg-[var(--pink-lavender)] [&::-webkit-scrollbar-thumb]:rounded"
                 onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[var(--accent-color)] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="22" width="22">
                        <path
                            fill="currentColor"
                            d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>
                </button>

                <h2 className="text-xl font-bold mb-4 text-[var(--pink-lavender)]">Отчёт по собеседованию</h2>

                <div className="mb-3 text-[var(--van-dyke)] font-medium">
                    <p className="text-[var(--accent-color)]">Направление </p>{CATEGORY_LABELS[report.category]}
                </div>

                <div className="mb-3 text-[var(--van-dyke)] font-medium">
                    <p className="text-[var(--accent-color)]">Общая оценка </p>{report.score}/10
                </div>

                <div className="mb-3 text-[var(--van-dyke)] font-medium">
                    <p className="text-[var(--accent-color)]">Отзыв</p>
                    <p>{report.feedback}</p>
                </div>

                <div className="mb-3 text-[var(--van-dyke)] font-medium">
                    <p className="text-[var(--accent-color)]">Сильные стороны</p>
                    <ul className="list-disc ml-5">
                        {report.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </div>

                <div className="mb-3 text-[var(--van-dyke)] font-medium">
                    <p className="text-[var(--accent-color)]">Слабые стороны</p>
                    <ul className="list-disc ml-5">
                        {report.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};