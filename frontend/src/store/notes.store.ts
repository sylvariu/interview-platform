import { create } from 'zustand';
import { notesApi } from '../shared/api/notes.api';
import type {Note} from '../types/types.ts';

interface NotesState {
    notes: Note[];
    currentNote: Note | null;
    isLoading: boolean;

    fetchNotes: () => Promise<void>;
    createNote: () => Promise<Note>;
    selectNote: (note: Note) => void; //id:string
    updateNote: (id: string, data: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;

    isOpenNotes: boolean;
    openNotes: () => void;
    closeNotes: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
    notes: [],
    currentNote: null,
    isLoading: false,

    isOpenNotes: false,
    openNotes: async () => {
        await get().fetchNotes(); // 👈 сразу грузим
        set({ isOpenNotes: true });
    },

    closeNotes: () => set({ isOpenNotes: false }),

    fetchNotes: async () => {
        set({ isLoading: true });
        const notes = await notesApi.getAll();
        set({ notes, isLoading: false });
    },

    createNote: async () => {
        const note = await notesApi.create();

        set((state) => ({
            notes: [note, ...state.notes],
            currentNote: note,
        }));

        return note;
    },

    selectNote: async (note) => {
        set({ currentNote: note });
    },

    updateNote: async (id, data) => {
        await notesApi.update(id, data);

        set((state) => ({
            notes: state.notes.map((n) =>
                n.id === id ? { ...n, ...data } : n
            ),
            currentNote:
                state.currentNote?.id === id
                    ? { ...state.currentNote, ...data }
                    : state.currentNote,
        }));
        await notesApi.update(id, data);
    },

    deleteNote: async (id) => {
        await notesApi.delete(id);

        set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
            currentNote:
                state.currentNote?.id === id ? null : state.currentNote,
        }));
    },
}));