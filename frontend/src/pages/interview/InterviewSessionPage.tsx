import {useEffect, useRef, useState} from "react";
import {MessageBubble} from "../../components/interview/MessageBubble.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useInterviewStore} from "../../store/interview.store.ts";
import {ReportModal} from "../../components/interview/ReportModal.tsx";
import {ConfirmModal} from "../../components/ConfirmModal.tsx";

export const InterviewSessionPage = () => {
    const { id } = useParams();
    const { interviewId, setInterviewId } = useInterviewStore();

    const [isRecording, setIsRecording] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { isAiSpeaking } = useInterviewStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (id && id !== interviewId) {
            setInterviewId(id);
        }
    }, [id]);

    const {
        messages,
        send,
        finish,
        loading,
        sendVoice,
        report
    } = useInterviewStore();

    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input) return;

        try {
            await send(input);
        }
        catch (error) {
            alert(error);
            navigate('/interview-home');
        }

        setInput('');

        if (textareaRef.current) {
            textareaRef.current.style.height = '44px';
            textareaRef.current.focus();
        }
    };

    const handleFinish = async () => {
        await finish();
    };


    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

            chunksRef.current = [];
            // защита от пустых записей
            if (blob.size < 5000) {
                console.log('слишком короткая запись');
                return;
            }

            try {
                await sendVoice(blob);
            }
            catch (error) {
                alert(error);
            }

        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;

        if (recorder) {
            recorder.stop();

            recorder.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    };

    const handleVoiceToggle = async () => {
        if (isAiSpeaking) return;

        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto flex flex-col h-[90vh] pt-8">
            <div className="flex-1 space-y-3 mb-4 overflow-x-hidden overflow-y-auto
            [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[var(--accent-color)] [&::-webkit-scrollbar-track]:rounded
            [&::-webkit-scrollbar-thumb]:bg-[var(--pink-lavender)] [&::-webkit-scrollbar-thumb]:rounded">
                {messages.map((m, i) => (
                    <MessageBubble key={i} role={m.role} text={m.text} />
                ))}

                {loading && <div>ИИ думает...</div>}
            </div>

            <div className="flex gap-2 items-end">
                <textarea
                    ref={textareaRef}
                    className="flex-1 border border-[var(--isa-darker)] p-2 rounded-xl resize-none overflow-y-auto [&::-webkit-scrollbar]:w-1
                     min-h-[43px] max-h-[200px] transition-all duration-100 focus:outline-none focus:border-[var(--van-dyke)]"
                    value={input}
                    rows={1}
                    placeholder="Введите ответ..."
                    onChange={(e) => {
                        setInput(e.target.value);

                        // авто-рост
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                        // Enter = отправка
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();

                            if (input.trim()) {
                                handleSend();
                            }
                        }
                    }}
                />

                <button
                    onClick={handleSend}
                    className="h-[43px] w-[43px] bg-[var(--isa-darker)] text-[var(--van-dyke)] px-2.5 py-2 rounded-xl cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width='22' height="22">
                        <path
                            fill='currentColor'
                            d="M536.4-26.3c9.8-3.5 20.6-1 28 6.3s9.8 18.2 6.3 28l-178 496.9c-5 13.9-18.1 23.1-32.8 23.1-14.2 0-27-8.6-32.3-21.7l-64.2-158c-4.5-11-2.5-23.6 5.2-32.6l94.5-112.4c5.1-6.1 4.7-15-.9-20.6s-14.6-6-20.6-.9L229.2 276.1c-9.1 7.6-21.6 9.6-32.6 5.2L38.1 216.8c-13.1-5.3-21.7-18.1-21.7-32.3 0-14.7 9.2-27.8 23.1-32.8l496.9-178z"/></svg>
                </button>

                <button
                    onClick={handleVoiceToggle}
                    disabled={isAiSpeaking}
                    className={`h-[43px] px-4 py-2 rounded-xl text-[var(--isabelline)]
                    ${isRecording ? 'bg-[var(--pink-lavender)] text-[var(--van-dyke)] cursor-pointer' : 
                        isAiSpeaking ? 'bg-[var(--isa-darker)] text-[var(--van-dyke)] cursor-not-allowed' : 'bg-[var(--accent-color)] cursor-pointer'}`}>
                    {isRecording ? 'Остановить' :
                        isAiSpeaking ? '🔊 ИИ говорит...' : 'Говорить'}
                </button>
            </div>

            <button
                onClick={() => setShowConfirm(true)}
                className="mt-3 bg-[var(--accent-color)] text-[var(--isabelline)] p-2 rounded-xl cursor-pointer">
                Завершить интервью
            </button>

            {showConfirm && (
                <ConfirmModal
                    title="Завершить собеседование?"
                    description="К нему нельзя будет вернуться"
                    onConfirm={handleFinish}
                    onCancel={() => setShowConfirm(false)}
                    actionText="Завершить"
                />
            )}

            {report && (
                <ReportModal
                    report={report}
                    onClose={() => {
                        useInterviewStore.getState().setReport(null);
                        navigate('/interview-home');
                    }}
                />
            )}
        </div>
    );
};