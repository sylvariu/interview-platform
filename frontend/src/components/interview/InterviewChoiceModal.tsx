import {type Category, CATEGORY_LABELS, CATEGORY_LIST} from "../../types/types.ts";

interface Props {
    onSelect: (category: Category) => void;
    onClose: () => void;
}

export const InterviewChoiceModal = ({ onSelect, onClose }: Props) => {
    return (
        <div className="fixed inset-0 z-50 bg-[var(--van-dyke)]/50 flex items-center justify-center"
            onClick={onClose}>
            <div className="bg-[var(--bg-color)] p-6 rounded-xl w-80 space-y-4 relative"
                 onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-[var(--accent-color)]">
                    Выберите направление
                </h2>

                <div className="space-y-2 text-[var(--van-dyke)]">
                    {CATEGORY_LIST.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelect(cat)}
                            className=" flex items-center justify-between w-full p-3 border border-[#e5e7eb] bg-[var(--isabelline)]
                            rounded-lg hover:translate-y-[-2px] text-left cursor-pointer"
                        >
                            {CATEGORY_LABELS[cat]}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height="20" width="12">
                                <path
                                    fill="currentColor"
                                    d="M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--accent-color)] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="20">
                        <path
                            fill="currentColor"
                            d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>

                </button>
            </div>
        </div>
    );
};