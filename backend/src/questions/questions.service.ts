import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateQuestionDto} from "./dto/create-question.dto";
import {Category, QuestionLearningStatus} from "@prisma/client";

@Injectable()
export class QuestionsService {
    constructor(private prismaService: PrismaService) {}

    async create(dto: CreateQuestionDto) {
        return this.prismaService.question.create({
            data: dto,
        });
    }

    async findAll(userId: string){
        const questions = await this.prismaService.question.findMany({
            include: {
                topic: true,
                progresses: {
                    where:{ userId, },
                    select: { status: true },
                },
            },
        });
        /*console.log(questions);*/
        return questions.map((q) => this.mapQuestionProgress(q));
    }

    //вопросы из разделов
    async findByTopic(topicId: string, userId: string) {
        const questions = await this.prismaService.question.findMany({
            where: { topicId },
            include: {
                progresses: {
                    where: { userId, },
                    select: { status: true },
                },
            },
        });
        return questions.map((q) => this.mapQuestionProgress(q));
    }

    //вопросы по категориям (frontend, backend ...)
    async findByCategory(category: Category, userId: string) {
        const questions = await this.prismaService.question.findMany({
            where: { category },
            include: {
                progresses: {
                    where: { userId, },
                    select: { status: true },
                },
            },
        });

        return questions.map((q) => this.mapQuestionProgress(q));
    }

    //темы разделов (React, Node.js ...) + вопросы из этих тем
    async getBySection(sectionId: string, userId: string) {
        const topics = await this.prismaService.topic.findMany({
            where: { parentId: sectionId },
            orderBy: { order: 'asc' }, //сортировка тем
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                    include: {
                        progresses: {
                            where: { userId, },
                            select: { status: true },
                        },
                    },
                },
            },
        });

        return topics.map((topic) => ({
            ...topic,
            questions: topic.questions.map((q) => this.mapQuestionProgress(q)),
        }));
    }

    async findById(id: string, userId: string) {
        const question = await this.prismaService.question.findUnique({
            where: { id },
            include: {
                progresses: {
                    where: { userId, },
                    select: { status: true },
                },
            },
        });
        if (!question) { throw new NotFoundException(`Вопрос ${id} не найден:(`); }
        return this.mapQuestionProgress(question);
    }

    async setProgress(userId: string, questionId: string, status: QuestionLearningStatus) {
        return this.prismaService.questionProgress.upsert({
            where: {
                userId_questionId: { userId, questionId },
            },
            update: {
                status,
            },
            create: {
                userId,
                questionId,
                status,
            },
        });
    }

    async getSectionsProgress(userId: string) {
        const categories = await this.prismaService.topic.findMany({
            where: {
                parentId: null,
            },

            orderBy: {
                order: 'asc',
            },

            include: {
                children: {
                    orderBy: {
                        order: 'asc',
                    },

                    include: {
                        children: {
                            include: {
                                questions: {
                                    include: {
                                        progresses: {
                                            where: { userId },

                                            select: {
                                                status: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return categories.map((category) => ({
            categoryId: category.id,
            categoryName: category.name,

            sections: category.children
                .map((section) => {
                    const questions =
                        section.children.flatMap(
                            (topic) => topic.questions
                        );

                    const total = questions.length;

                    const learned = questions.filter(
                        (q) =>
                            q.progresses[0]?.status ===
                            'LEARNED'
                    ).length;

                    const review = questions.filter(
                        (q) =>
                            q.progresses[0]?.status ===
                            'REVIEW'
                    ).length;

                    const hard = questions.filter(
                        (q) =>
                            q.progresses[0]?.status ===
                            'HARD'
                    ).length;

                    const completed =
                        learned + review + hard;

                    return {
                        sectionId: section.id,
                        sectionName: section.name,

                        total,

                        learned,
                        review,
                        hard,

                        completed,

                        completedPercent: total
                            ? Math.round(
                                (completed / total) * 100
                            )
                            : 0,

                        learnedPercent: total
                            ? (learned / total) * 100
                            : 0,

                        reviewPercent: total
                            ? (review / total) * 100
                            : 0,

                        hardPercent: total
                            ? (hard / total) * 100
                            : 0,
                    };
                })
                .filter((section) => section.total > 0),
        }));
    }

    private mapQuestionProgress(question: any) {
        return {
            ...question,
            progress: question.progresses[0] || null,
            progresses: undefined,
        }
    }
}
