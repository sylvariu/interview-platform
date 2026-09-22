import {useEffect, useState} from 'react';
import { useCollectionsStore } from '../../store/collections.store.ts';

interface Props {
    problemId: string;
    onClose: () => void;
}

export const CollectionsModal: React.FC<Props> = ({
                                                      problemId,
                                                      onClose,
                                                  }) => {
    const {
        collections,
        fetchCollections,
        updateCollections,
        createCollection,
    } = useCollectionsStore();

    const [selected, setSelected] = useState<string[]>([]);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        fetchCollections(problemId);
    }, [problemId]);

    useEffect(() => {
        const selectedIds = collections
            .filter((c) => c.hasProblem)
            .map((c) => c.id);

        setSelected(selectedIds);
    }, [collections]);

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const handleSave = async () => {
        await updateCollections(problemId, selected);
        onClose();
    };

    const handleCreate = async () => {
        if (!newName.trim()) return;
        await createCollection(newName);
        setNewName("");
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-5 rounded-xl w-[400px] space-y-4">
                <h2 className="text-lg font-semibold">Коллекции</h2>

                {/* список */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                    {collections.map((c) => (
                        <label key={c.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selected.includes(c.id)}
                                onChange={() => toggle(c.id)}
                            />
                            {c.name}
                        </label>
                    ))}
                </div>

                {/* создание */}
                <div className="flex gap-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Новая коллекция"
                        className="border px-2 py-1 rounded w-full"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-[var(--isa-darker)] text-[var(--van-dyke)] px-3 rounded cursor-pointer hover:bg-[var(--pink-lavender)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="16">
                            <path
                                fill="currentColor"
                                d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/></svg>
                    </button>
                </div>

                {/* кнопки */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Отмена</button>
                    <button
                        onClick={handleSave}
                        className="bg-[var(--van-dyke)] text-white px-3 py-1 rounded-lg"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};