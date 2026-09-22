import { useState } from "react";
import { useCollectionsStore } from "../../store/collections.store";

export const CreateCollection = () => {

    const [name, setName] = useState("");
    const { createCollection } = useCollectionsStore();

    const handleCreate = async () => {
        if (!name.trim()) return;

        await createCollection(name);
        setName("");
    };

    return (
        <div className="flex gap-2 mb-4">

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Новая коллекция"
                className="border text-[var(--accent-color)] border-[#e5e7eb] px-2 py-1 rounded transition cursor-pointer
                                focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
    );
};