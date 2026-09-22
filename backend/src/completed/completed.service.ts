import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class CompletedService {
    constructor(private prismaService: PrismaService) {}

    async getCompleted(userId: string) {
        return this.prismaService.completedProblem.findMany({
            where: { userId, },
            include: { problem: true, },
            orderBy: { createdAt: 'desc', },
        });
    }

    async getProgress(userId: string) {
        const completed = await this.prismaService.completedProblem.findMany({
            where: { userId, },
            include: { problem: true, },
        });

        const total = completed.length;

        const difficulty = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0,
        };

        const tags: Record<string, number> = {};
        completed.forEach((item) => {
            const d = item.problem.difficulty;
            difficulty[d]++;
            item.problem.tags.forEach((tag) => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });

        return { total, difficulty, tags };
    }

    async toggleCompleted(userId: string, problemId: string) {
        const exist = await this.prismaService.completedProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        });

        if (exist) {
            await this.prismaService.completedProblem.delete({
                where: {
                    userId_problemId: {
                        userId,
                        problemId,
                    },
                },
            });
            return { completed: false };
        }

        await this.prismaService.completedProblem.create({
            data: {
                userId,
                problemId,
            },
        });
        return { completed: true };
    }

    async isCompleted(userId: string, problemId: string) {
        const comp = await this.prismaService.completedProblem.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        });

        return !!comp;
    }
}
