import {useEffect, useMemo, useState} from 'react';
import { useNotesStore } from '../../store/notes.store.ts';
import { debounce } from 'lodash';

export const NoteEditor = () => {
    const { currentNote, updateNote } = useNotesStore();

    const [value, setValue] = useState('');

    // синхронизация при смене заметки
    useEffect(() => {
        setValue(currentNote?.content || '');
    }, [currentNote?.id]);

    // debounce update
    const debouncedUpdate = useMemo(
        () => debounce((id: string, content: string) => {
            updateNote(id, { content });
        }, 500),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        setValue(newValue);

        if (currentNote) {
            debouncedUpdate(currentNote.id, newValue);
        }
    };

    if (!currentNote) {
        return <div className="text-gray-400">Выбери заметку</div>;
    }

    return (
        <>
            <input
            value={currentNote.title}
            onChange={(e) =>
                updateNote(currentNote.id, { title: e.target.value })
            }
            className="text-xl font-semibold outline-none mb-4"
        />
            <textarea
                value={value}
                onChange={handleChange}
                placeholder="Начни писать..."
                className="w-full h-full outline-none resize-none text-lg"
            />
        </>
    );
};