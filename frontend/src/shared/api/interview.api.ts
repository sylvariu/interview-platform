import {api} from "./axios.ts";

export const startInterview = async (category: string) => {
    const { data } = await api.post('/interview/start', { category });
    return data;
};

export const sendMessage = async (id: string, text: string) => {
    const { data } = await api.post(`/interview/${id}/message`, { text });
    return data;
};

export const finishInterview = async (id: string) => {
    const { data } = await api.post(`/interview/${id}/finish`);
    return data;
};

export const getInterviews = async () => {
    const { data } = await api.get('/interview');
    return data;
};

export const sendAudio = async (id: string, blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob);

    const res = await api.post(`/interview/${id}/audio`, formData);

    return res.data;
}