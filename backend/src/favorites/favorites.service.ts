import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class FavoritesService {
    constructor(private prismaService: PrismaService) {}

    async getUserFavorites(userId: string) {
        return this.prismaService.favorite.findMany({
            where: { userId },
            include: {
                problem: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //проверить, избранное ли
    async isFavorite(userId: string, problemId: string) {
        const fav = await this.prismaService.favorite.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        });
        return !!fav; //приведение в boolean: объект(запись) есть->true, нет записи(null)->false
    }

    async toggleFavorite(userId: string, problemId: string) {
        const exist = await this.checkFavorite(userId, problemId);
        if (exist) {
            await this.prismaService.favorite.delete({
                where: {
                    userId_problemId: {
                        userId, problemId,
                    },
                },
            });
            return { isFavorite: false };
        }

        await this.prismaService.favorite.create({
            data: {
                userId,
                problemId,
            },
        });

        return { isFavorite: true };
    }

    private async checkFavorite(userId: string, problemId: string) {
        return this.prismaService.favorite.findUnique({
            where: {
                userId_problemId: {
                    userId,
                    problemId,
                },
            },
        });
    }

}
