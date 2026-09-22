import { useNotesStore } from "../../store/notes.store.ts";

export const NotesFloatingButton = () => {
    const { openNotes } = useNotesStore();

    return (
        <button
            onClick={openNotes}
            className="
                fixed
                bottom-10
                right-10
                w-14
                h-14
                rounded-full
                bg-[var(--pink-lavender)]
                text-[var(--reseda-green)]
                flex
                items-center
                justify-center
                shadow-lg
                hover:text-[var(--van-dyke)]
                transition
                z-50
                cursor-pointer
            "
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="24" width="24">
                <path
                    fill="currentColor"
                    d="M160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 373.5C544 390.5 537.3 406.8 525.3 418.8L418.7 525.3C406.7 537.3 390.4 544 373.4 544L160 544zM485.5 368L392 368C378.7 368 368 378.7 368 392L368 485.5L485.5 368z"/>
            </svg>
        </button>
    );
};