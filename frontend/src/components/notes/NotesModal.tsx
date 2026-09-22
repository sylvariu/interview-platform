import { Rnd } from 'react-rnd';
import { useNotesStore } from '../../store/notes.store.ts'
import {NoteEditor} from "./NoteEditor.tsx";
import {useState} from "react";
import {ConfirmModal} from "../ConfirmModal.tsx";

export const NotesModal = () => {
    const { notes, createNote, selectNote, closeNotes, deleteNote } = useNotesStore();

    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    return (
        <Rnd
            default={{
                x: 100,
                y: 100,
                width: 800,
                height: 500,
            }}
            minWidth={500}
            minHeight={300}
            bounds="window"
            dragHandleClassName="drag-handle"
            className="z-50"
        >
            <div className="w-full h-full bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-[var(--van-dyke)]">
                <div className="drag-handle flex items-center justify-between px-4 py-2 border-b border-[var(--van-dyke)] cursor-move bg-[var(--reseda-green)]">
                    <span className="text-sm text-[var(--isabelline)]">
                        Заметки
                    </span>
                    <button onClick={closeNotes} className="text-[var(--isabelline)] cursor-pointer">✕</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-64 border-r border-[var(--van-dyke)] p-3 bg-[var(--isa-darker)] overflow-y-auto">
                        {notes.length === 0 && (
                            <div className="text-sm text-gray-400">
                                Пока заметок нет
                            </div>
                        )}

                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="relative group p-2 rounded-lg hover:bg-[var(--isabelline)]"
                            >
                                <div
                                    onClick={() => selectNote(note)}
                                    className="cursor-pointer"
                                >
                                    <div className="text-sm font-medium">{note.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* троеточие */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpenId(menuOpenId === note.id ? null : note.id);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-500 cursor-pointer"
                                >
                                    ⋯
                                </button>

                                {/* меню */}
                                {menuOpenId === note.id && (
                                    <div className="absolute right-2 top-8 bg-white border rounded shadow text-sm z-10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpenId(null);
                                                setConfirmId(note.id);
                                            }}
                                            className="block px-6 py-2 hover:bg-[var(--isabelline)] hover:rounded text-[var(--van-dyke)] cursor-pointer"
                                        >
                                            Удалить заметку
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                        onClick={createNote}
                        className="my-2 w-full bg-[var(--van-dyke)] text-[var(--isabelline)]
                                    rounded-lg p-2 text-sm border border-[var(--van-dyke)] cursor-pointer"
                    >
                        + Новая заметка
                    </button>
                    </div>

                    <div className="flex-1 p-6 bg-[var(--isabelline)]">
                        <NoteEditor />
                    </div>
                </div>
            </div>

            {confirmId && (
                <ConfirmModal
                    title="Удалить заметку?"
                    description="Это действие нельзя отменить"
                    onCancel={() => setConfirmId(null)}
                    onConfirm={async () => {
                        await deleteNote(confirmId);
                        setConfirmId(null);
                    }}
                    actionText="Удалить"
                />
            )}
        </Rnd>
    );
};