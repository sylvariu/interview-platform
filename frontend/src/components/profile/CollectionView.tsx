import {useEffect, useState} from "react";
import { useCollectionsStore } from "../../store/collections.store";
import { ProblemCard } from "../problems/ProblemCard.tsx";
import {ConfirmModal} from "../ConfirmModal.tsx";

interface Props {
    collectionId: string;
    onBack: () => void;
}

export const CollectionView: React.FC<Props> = ({
                                                    collectionId,
                                                    onBack,
                                                }) => {
    const { currentCollection, fetchOne, deleteCollection, updateCollectionName } = useCollectionsStore();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchOne(collectionId);
    }, [collectionId]);

    useEffect(() => {
        if (currentCollection) {
            setName(currentCollection.name);
        }
    }, [currentCollection]);

    if (!currentCollection) return <p>Загрузка...</p>;

    const handleDelete = async () => {
        await deleteCollection(collectionId);
        setShowConfirm(false);
        onBack(); // возвращаемся к списку
    };

    const handleSaveName = async () => {
        if (!name.trim()) return;

        await updateCollectionName(collectionId, name);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setName(currentCollection.name);
        setIsEditing(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-md font-medium text-[var(--pink-lavender)] hover:text-[var(--van-dyke)] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="12" width="12">
                        <path
                            fill="currentColor"
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                    Назад
                </button>

                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center justify-between gap-3 text-[var(--accent-color)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="20">
                        <path
                            fill="currentColor"
                            d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"/></svg>
                </button>
            </div>

            <div className="flex items-center gap-4">
                {isEditing ? (
                    <>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border text-[var(--accent-color)] border-[#e5e7eb] px-2 py-1 rounded transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        <button
                            onClick={handleSaveName}
                            className="text-[var(--accent-color)] cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="24">
                                <path
                                    fill="currentColor"
                                    d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>
                        </button>

                        <button
                            onClick={handleCancelEdit}
                            className="text-[var(--pink-lavender)] cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="24">
                                <path
                                    fill="currentColor"
                                    d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl text-[var(--van-dyke)] font-semibold">
                            {currentCollection.name}
                        </h2>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[var(--accent-color)] hover:text-[var(--van-dyke)]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="20">
                                <path
                                    fill="currentColor"
                                    d="M36.4 353.2c4.1-14.6 11.8-27.9 22.6-38.7l181.2-181.2 33.9-33.9c16.6 16.6 51.3 51.3 104 104l33.9 33.9-33.9 33.9-181.2 181.2c-10.7 10.7-24.1 18.5-38.7 22.6L30.4 510.6c-8.3 2.3-17.3 0-23.4-6.2S-1.4 489.3 .9 481L36.4 353.2zm55.6-3.7c-4.4 4.7-7.6 10.4-9.3 16.6l-24.1 86.9 86.9-24.1c6.4-1.8 12.2-5.1 17-9.7L91.9 349.5zm354-146.1c-16.6-16.6-51.3-51.3-104-104L308 65.5C334.5 39 349.4 24.1 352.9 20.6 366.4 7 384.8-.6 404-.6S441.6 7 455.1 20.6l35.7 35.7C504.4 69.9 512 88.3 512 107.4s-7.6 37.6-21.2 51.1c-3.5 3.5-18.4 18.4-44.9 44.9z"/></svg>
                        </button>
                    </>
                )}
            </div>

            <div className="space-y-3">
                {currentCollection.problems?.length ? (
                    currentCollection.problems.map((p: any) => (
                        <ProblemCard key={p.problem.id} problem={p.problem} />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">
                        В коллекции пока нет задач
                    </p>
                )}
            </div>

            {showConfirm && (
                <ConfirmModal
                    title="Удалить коллекцию?"
                    description="Это действие нельзя отменить"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                    actionText="Удалить"
                />
            )}
        </div>
    );
};