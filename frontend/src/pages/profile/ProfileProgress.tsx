import { useEffect, useState } from "react";
import { completedApi } from "../../shared/api/completed.api.ts";
import {CircularProgress} from "../../components/profile/CircularProgress.tsx";
import {QuestionsProgress} from "../../components/questions/QuestionsProgressBar.tsx";
import {useQuestionsStore} from "../../store/questions.store.ts";
import {useNavigate} from "react-router-dom";
import type {Problem, Progress} from "../../types/types.ts";
import {problemsApi} from "../../shared/api/problems.api.ts";

export const ProfileProgress = () => {
    const navigate = useNavigate();

    const [progress, setProgress] = useState<Progress | null>(null);
    const { sectionsProgress, fetchSectionsProgress } = useQuestionsStore();

    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const DifficultyBox = ({
                               label,
                               solved,
                               total,
                               color,
                           }: any) => (
        <div className="bg-gray-200 rounded-md p-4 text-center w-[80px] sm:w-[120px]">
            <div className="text-sm font-semibold" style={{ color }}>
                {label}
            </div>

            <div className="font-medium">
                {solved}/{total}
            </div>
        </div>
    );

    useEffect(() => {
        completedApi.getProgress().then(({ data }) => {
            setProgress(data);
        });
    }, []);

    useEffect(() => {
        fetchSectionsProgress();
    }, []);

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

    const ez = problems.filter((p) => p.difficulty === 'EASY').length;
    const mid = problems.filter((p) => p.difficulty === 'MEDIUM').length;
    const hard = problems.filter((p) => p.difficulty === 'HARD').length;

    if (!progress || loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const sortedTags = Object.entries(progress.tags)
        .sort((a, b) => b[1] - a[1]);

    const handleProgressClick = (sectionId: string) => {
        navigate(`/questions/section/${sectionId}`);
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row justify-between gap-8 pr-20">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <CircularProgress solved={progress.total} total={problems.length} />
                    <div className="flex flex-row sm:flex-col gap-3">
                        <DifficultyBox
                            label="Easy"
                            solved={progress.difficulty.EASY}
                            total={ez}
                            color="#22c55e"
                        />
                        <DifficultyBox
                            label="Medium"
                            solved={progress.difficulty.MEDIUM}
                            total={mid}
                            color="#f59e0b"
                        />
                        <DifficultyBox
                            label="Hard"
                            solved={progress.difficulty.HARD}
                            total={hard}
                            color="#ef4444"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="font-medium mb-2">
                        Популярные теги
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {sortedTags.map(([tag, count]) => (
                            <div
                                key={tag}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition"
                            >
                                <span>{tag}</span>
                                <span className="text-gray-500">x{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {sectionsProgress.map((category) => (
                    <div key={category.categoryId}
                    className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--accent-color)]">{category.categoryName}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.sections.map((section) => (
                                <div
                                    key={section.sectionId}
                                    className="bg-[var(--isabelline)] rounded-xl p-4 hover:shadow-sm border border-[#e5e7eb] space-y-3"
                                    onClick={()=> {handleProgressClick(section.sectionId)}}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-[var(--van-dyke)]">
                                                {section.sectionName}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                {section.completed} / {section.total} вопросов
                                            </p>
                                        </div>

                                        <div className="text-lg font-bold text-[var(--van-dyke)]">
                                            {section.completedPercent}%
                                        </div>
                                    </div>

                                    <QuestionsProgress
                                        learnedPercent={section.learnedPercent}
                                        reviewPercent={section.reviewPercent}
                                        hardPercent={section.hardPercent}
                                    />

                                    <div className="flex gap-4 text-xs text-[var(--van-dyke)]">
                                        <div className="flex items-center gap-1">
                                            <div className="relative w-3 h-3 rounded-full bg-green-500 translate-y-1/12" />
                                            <span>{section.learned}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                        <div className="relative w-3 h-3 rounded-full bg-yellow-400 translate-y-1/12" />
                                            <span>{section.review}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <div className="relative w-3 h-3 rounded-full bg-red-400 translate-y-1/12" />
                                            <span>{section.hard}</span>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};