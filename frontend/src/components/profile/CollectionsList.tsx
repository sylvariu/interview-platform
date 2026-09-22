import { useEffect } from "react";
import { useCollectionsStore } from "../../store/collections.store.ts";

interface Props {
    onOpen: (id: string) => void;
}

export const CollectionsList: React.FC<Props> = ({ onOpen }) => {
    const { collections, fetchAll } = useCollectionsStore();

    useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="space-y-3">
            {collections.map((c) => (
                <div
                    key={c.id}
                    onClick={() => onOpen(c.id)}
                    className="p-4 bg-[var(--isabelline)] border border-[#e5e7eb] rounded-lg cursor-pointer hover:bg-[var(--isa-darker)] transition"
                >
                    <div className="flex justify-between">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-sm text-[var(--accent-color)]">
              {c.problems?.length ?? 0} задач
            </span>
                    </div>
                </div>
            ))}
        </div>
    );
};