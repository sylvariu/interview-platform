import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {GigachatService} from "../gigachat/gigachat.service";
import {SpeechService} from "../speech/speech.service";

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import {Readable} from 'stream';
import {Category} from "@prisma/client";

ffmpeg.setFfmpegPath(ffmpegPath!);


@Injectable()
export class InterviewService {
    constructor(private prismaService: PrismaService,
                private gigachatService: GigachatService,
                private readonly speechService: SpeechService) {}

    async startInterview(userId: string, category: Category) {
        /*const questionsFromDb = await this.prismaService.question.findMany({
            where: {
                category: category,
            },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                question: true,
                order: true,
            },
        });*/

        const questionsFromDb = await this.prismaService.$queryRaw<
            { id: string; question: string; order: number } []
        >`
            SELECT id, question, "order" 
            FROM "Question" 
            WHERE category = ${category}::"Category"
            ORDER BY RANDOM()
            LIMIT 8
        `;
        //console.log(questionsFromDb);

        const interview = await this.prismaService.interview.create({
            data: {
                userId,
                topic: category,
                questions: questionsFromDb,
                currentIndex: 0,
            },
        });

        const firstQuestion = "Здравствуйте! Давайте начнем наше собеседование. Расскажите о себе и вашем опыте в разработке.";

        await this.prismaService.message.create({
            data: {
                interviewId: interview.id,
                role: "AI",
                text: firstQuestion,
            },
        });

        try {
            const audioBuffer = await this.speechService.textToSpeech(firstQuestion);
            return {
                interviewId: interview.id,
                question: firstQuestion,
                audio: audioBuffer.toString('base64'),
            };
        }
        catch (error) {
            throw new Error(error);
        }

    }

    async processAnswer(interviewId: string, userText: string) {
        await this.prismaService.message.create({
            data: {
                interviewId,
                role: "USER",
                text: userText,
            },
        });

        const interview = await this.prismaService.interview.findUnique({
            where: { id: interviewId },
        });

        if (!interview) { throw new Error(`Интервью ${interviewId} не найдено!`); }

        const category = interview.topic;
        const categoryLabelMap = {
            FRONTEND: 'Frontend',
            BACKEND: 'Backend',
            ALGORITHMS: 'Алгоритмы',
            DATABASES: 'Базы данных',
            DEVOPS: 'DevOps инженер',
            SYSTEM_DESIGN: 'System Design',
        };

        let categoryLabel = '';
        if (category) {categoryLabel = categoryLabelMap[category];}
        else {categoryLabel = 'разработчик'}

        const questions = (interview?.questions as any[]) || [];
        const currentIndex = interview?.currentIndex || 0;
        const currentQuestion = questions[currentIndex];

        const messages = await this.prismaService.message.findMany({
            where: { interviewId, },
            orderBy: { createdAt: 'asc', },
        });

        const prompt = [
            {
                role: 'system',
                content: `
Ты-технический интервьюер. Направление интервью: ${categoryLabel} 
Вот список вопросов, которые можно спрашивать у кандидата (используй как основу):
${questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}
Также для контекста ты получаешь историю предыдущих сообщений диалога между кандидатом (user) и интервьюером(assistant).

СТРОГИЕ ПРАВИЛА:
- НЕ пиши рассуждения
- НЕ объясняй ход своих мыслей
- НЕ используй заголовки (например: "Оценка", "Ответ кандидата")
- НЕ используй markdown (##, **, --- и т.д.)
- НЕ пиши свои рассуждения никаким образом
- НЕ разбивай ответ на блоки
- НЕ пиши лишний текст
- НЕ будь многословным

ТВОЯ ЗАДАЧА:
- сначала кратко оценить ответ кандидата (1-2 предложения)
- задать следующий вопрос ИЛИ уточнение

Если ответ неверный:
- кратко исправь (1 предложение)
- задай следующий вопрос

ТЫ должен задать следующий вопрос.
НЕ пиши фразы вроде:
- "задайте следующий вопрос"

ФОРМАТ ОТВЕТА:
1-2 коротких предложения с оценкой + 1 вопрос

- старайся идти по порядку
- можно перефразировать
- не уходи от тем списка

Если кандидат ответил на 5 и более вопросов или ты считаешь, что его уровень достаточно оценён, заверши интервью:
- задай обобщающий комментарий 
- добавь в конце строки маркер: [FINISH]
Пример завершения:
"Ответы в целом удовлетворительные, базовые знания есть. Спасибо за уделённое время. [FINISH]"
`,
            },
            ...messages.map((m) => ({
                role: m.role === 'USER' ? 'user' : 'assistant',
                content: m.text,
            })),
        ];

        const aiResponse = await this.gigachatService.sendMessage(prompt);
        const isFinished = /\[FINISH\]/.test(aiResponse);


        /*const cleanAiResponse = aiResponse.replace(/\[FINISH\]/g, '').trim();*/
        const cleanAiResponse = aiResponse.replace(/\[[A-ZА-ЯЁ_]+\]/gi, '').replace(/\[[^\]]*\]/g, '').trim();

        // двигаем индекс текущего вопроса
        let nextIndex = currentIndex;
        if (currentIndex < questions.length - 1) {
            nextIndex = currentIndex + 1;
        }
        await this.prismaService.interview.update({
            where: { id: interviewId },
            data: {
                currentIndex: nextIndex,
            },
        });

        await this.prismaService.message.create({
            data: {
                interviewId,
                role: "AI",
                text: cleanAiResponse,
            },
        });

        const audioBuffer = await this.speechService.textToSpeech(cleanAiResponse);
        console.log('AI RES:', aiResponse)
        console.log('isFinished:', isFinished);

        return {
            aiText: cleanAiResponse,
            isFinished,
            audio: audioBuffer.toString('base64'),
        };
    }

    async getUserInterviews(userId: string) {
        return this.prismaService.interview.findMany({
            where:{
                userId,
            },
            include: {
                report: true,
            },
            orderBy: {
                startedAt: 'desc',
            },
        });
    }

    async finishInterview(interviewId: string) {
        const messages = await this.prismaService.message.findMany({
            where: { interviewId },
            orderBy: { createdAt: 'asc'}
        })

        const interview = await this.prismaService.interview.findUnique({
            where: { id: interviewId },
        });
        const category = interview?.topic as Category | undefined;

        const dialog = messages.map(
            m => m.role === 'USER'
                ? `Кандидат: ${m.text}`
                : `Интервьюер: ${m.text}`).join('\n');
        const totalDialogExchanges = messages.filter(m => m.role === 'USER').length;
        const prompt = [{
            role: 'system',
            content: `
Ты - опытный технический интервьюер.
Твоя задача: проанализировать диалог интервью и составить отчет СТРОГО в формате JSON.
Формат:
{
  "score": number (0-10),
  "feedback": string,
  "strengths": string[],
  "weaknesses": string[]
}
- JSON должен быть валидным
- ЗАПРЕЩЕНО использовать комментарии (// или /* */)
- НЕ добавляй пояснения внутри JSON

КОНТЕКСТ ИНТЕРВЬЮ:
1. Направление: ${category}
2. Количество обменов "вопрос-ответ": ${totalDialogExchanges}

ИСТОРИЯ ДИАЛОГА: ${dialog}

ТРЕБОВАНИЯ К ОЦЕНКЕ:
1. **Строгость оценивания**
    - ${totalDialogExchanges < 3 ? 'Интервью было очень коротким - оценка должна быть НИЗКОЙ (3-5/10)': ''}
    - ${totalDialogExchanges < 2 ? 'Недостаточно данных - оценка должна быть НИЗКОЙ (2-4/10)' : ''}
    - Если количество обменов МЕНЕЕ 3: score должно быть НЕ БОЛЕЕ 5
    - Если количество обменов МЕНЕЕ 2: score должно быть НЕ БОЛЕЕ 3
2. **КРИТИЧНОСТЬ к заявлениям кандидата:**
    - НЕ ДОБАВЛЯЙ в "strengths" (сильные стороны) технологии/навыки, которые НЕ БЫЛИ ПРОВЕРЕНЫ
    - Будь КРИТИЧНЫМ: упоминание ≠ знание. Нужны доказательства. Доказательства = ответы по теме.
    - Если кандидат только УПОМЯНУЛ технологию (например, "я делал на Python"), но не ответил на вопросы по ней - это НЕ сильная сторона
    - Если интервью короткое (<3 обменов) - НЕ добавляй технические навыки в сильные стороны, только общие качества (если они ЯВНО видны)
    - Если кандидат только заявил о навыке без проверки - упомяни об этом в "feedback", но НЕ в "strengths"
    - Перед добавлением каждого пункта в "strengths" спроси себя: "Было ли это проверено в диалоге?" Если НЕТ — не добавляй
3. **Качество оценки:**
    - Оценивай ТОЛЬКО на основе реальных ответов кандидата
    - Если данных мало - будь консервативным (низкая оценка, низкая уверенность)
    - Если данных достаточно (3+ обменов) - оценивай по содержанию
    - Если данных много (5+ обменов) - оценивай полно и справедливо
    - НЕ завышай оценку из-за упоминаний технологий без проверки
`,
        }];

        const aiRaw = await this.gigachatService.sendMessage(prompt);
        const cleaned = aiRaw.replace(/```json|```/g, '')
            .replace(/\/\/.*$/gm, '') // комментарии
            .replace(/\n/g, ' ') // переносы строк
            .replace(/\s+/g, ' ') // лишние пробелы
            .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1').trim();

        let report;
        try {
            report = {
                ...JSON.parse(cleaned),
                category,
            };
        } catch (e) {
            console.error('Ошибка парсинга отчёта:', aiRaw);

            report = {
                category: category,
                score: 5,
                feedback: "Не удалось корректно проанализировать интервью",
                strengths: [],
                weaknesses: [],
            };
        }

        await this.prismaService.interview.update({
            where: { id: interviewId, },
            data: {
                endedAt: new Date(),
            },
        });

        await this.prismaService.interviewReport.create({
            data: {
                interviewId,
                category: category,
                score: Number(report.score) || 0,
                feedback: report.feedback || '',
                strengths: Array.isArray(report.strengths) ? report.strengths : [],
                weaknesses: Array.isArray(report.weaknesses) ? report.weaknesses : [],
            },
        });

        return report;
    }

    async processAudio(interviewId: string, audioBuffer: Buffer) {
        //преобразовываем в нужный формат
        const pcmBuffer = await this.convertToPCM(audioBuffer);
        //отправляем в SaluteSpeech API на распознавание
        const userText = await this.speechService.speechToText(pcmBuffer);
        // обработка молчания
        if (!userText) {
            return {
                userText: '',
                aiText: 'Я не услышал ответ. Попробуйте ещё раз.',
            };
        }

        const result = await this.processAnswer(interviewId, userText);

        return {
            userText,
            aiText: result.aiText,
            audio: result.audio,
            isFinished: result.isFinished,
        };
    }

    async convertToPCM(buffer: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];

            const stream = new Readable();
            stream.push(buffer);
            stream.push(null);

            ffmpeg(stream)
                .audioCodec('pcm_s16le')
                .audioFrequency(16000)
                .audioChannels(1)
                .format('s16le')
                .on('error', reject)
                .on('end', () => {
                    resolve(Buffer.concat(chunks));
                })
                .pipe()
                .on('data', (chunk) => chunks.push(chunk));
        });
    }
}
