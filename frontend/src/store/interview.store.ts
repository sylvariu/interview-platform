import {create} from "zustand";
import type {Interview, Message, Report} from "../types/types.ts";
import {finishInterview, getInterviews, sendAudio, sendMessage, startInterview} from "../shared/api/interview.api.ts";

type InterviewStore = {
    interviews: Interview[];
    interviewId: string | null;
    messages: Message[];
    loading: boolean;

    loadInterviews: () => Promise<void>;
    start: (category: string) => Promise<{ interviewId: string; question: string }>;
    send: (text: string) => Promise<void>;
    finish: () => Promise<any>;
    setInterviewId: (id: string) => void;
    sendVoice: (blob: Blob) => Promise<void>;

    report: Report | null;
    setReport: (report: Report | null) => void;

    isAiSpeaking: boolean;
    setIsAiSpeaking: (value: boolean) => void;
};

export const useInterviewStore = create<InterviewStore>((set, get) => ({
    interviews: [],
    interviewId: null,
    messages: [],
    loading: false,

    setInterviewId: (id: string) => set({ interviewId: id }),

    isAiSpeaking: false,
    setIsAiSpeaking: (value: boolean) => set({ isAiSpeaking: value }),


    loadInterviews: async () => {
        const data = await getInterviews();
        set({ interviews: data });
    },

    start: async (category: string) => {
        try {
            set({ report: null, });
            const res = await startInterview(category);
            set({
                interviewId: res.interviewId,
                messages: [{ role: 'AI', text: res.question }],
            });
            if (res.audio) {
                const audio = new Audio(`data:audio/ogg;base64,${res.audio}`);
                set({ isAiSpeaking: true });
                audio.onended = () => {
                    set({ isAiSpeaking: false });
                };
                try {
                    await audio.play();
                } catch (e) {
                    set({ isAiSpeaking: false });
                }
            }
            return res;
        }
        catch (error) {
            throw new Error('Прохождение тренировочных собеседований временно недоступно. Попробуйте позже.');
        }
    },

    send: async (text: string) => {
        const { interviewId, messages } = get();
        if (!interviewId) return;
        try {
            const userMessage: Message = { role: 'USER', text };
            set({
                messages: [...messages, userMessage],
                loading: true,
            });

            const res = await sendMessage(interviewId, text);
            console.log('RES int.store send:', res);

            const aiMessage: Message = { role: 'AI', text: res.aiText };

            if (res.audio) {
                const audio = new Audio(`data:audio/ogg;base64,${res.audio}`);

                set({ isAiSpeaking: true });

                audio.onended = async () => {
                    set({ isAiSpeaking: false });

                    if (res.isFinished) {
                        console.log('должно закончиться1');
                        await get().finish();
                    }
                };

                try {
                    await audio.play();
                } catch (e) {
                    set({ isAiSpeaking: false });
                    //если звук последнего сообщения не проигрался, всё равно завершаем
                    if (res.isFinished) {
                        console.log('должно закончиться2');
                        await get().finish();
                    }
                }
            }

            set({
                messages: [...get().messages, aiMessage],
                loading: false,
            });
        }
        catch (error) {
            finishInterview(interviewId!);
            throw new Error('GigaChat временно недоступен. Попробуйте позже.');
        }
    },

    finish: async () => {
        const { interviewId } = get();
        if (!interviewId) return;

        const report = await finishInterview(interviewId);

        set({ report });
        return report;
    },

    sendVoice: async (blob: Blob) => {
        const { interviewId, messages } = get();
        if (!interviewId) return;
        try {
            set({ loading: true });
            try {
                const res = await sendAudio(interviewId, blob);
                // добавляем распознанный текст пользователя
                if (res.userText) {
                    set({
                        messages: [
                            ...messages,
                            { role: 'USER', text: res.userText },
                        ],
                    });
                }
                // добавляем ответ ии
                if (res.aiText) {
                    set((state) => ({
                        messages: [
                            ...state.messages,
                            { role: 'AI', text: res.aiText },
                        ],
                    }));
                }
                if (res.audio) {
                    const audio = new Audio(`data:audio/ogg;base64,${res.audio}`);

                    set({ isAiSpeaking: true });

                    audio.onended = async () => {
                        set({ isAiSpeaking: false });

                        if (res.isFinished) {
                            await get().finish();
                        }
                    };

                    try {
                        await audio.play();
                    } catch (e) {
                        set({ isAiSpeaking: false });

                        if (res.isFinished) {
                            await get().finish();
                        }
                    }
                } else {
                    //если аудио нет, просто проверяем, завершено ли интервью
                    if (res.isFinished) {
                        await get().finish();
                    }
                }

            } finally {
                set({ loading: false });
            }
        }
        catch (error) {
            throw new Error("Обработка речи невозможна в данный момент. Пожалуйста, напечатайте ответ в текстовом поле.");
        }

    },
    report: null,
    setReport: (report) => set({ report }),
}));
