import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateCollectionDto} from "./dto/create-collection.dto";
import {UpdateCollectionDto} from "./dto/update-collection.dto";

@Injectable()
export class CollectionsService {
    constructor(private prismaService: PrismaService) {}

    async findAll(userId: string) {
        return this.prismaService.collection.findMany({
            where: {
                userId,
            },
            include: {
                problems: {
                    include: { problem: true}
                },
            },
        });
    }

    async findById(id: string, userId: string) {
        return this.prismaService.collection.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                problems: {
                    include: { problem: true },
                },
            },
        });
    }

    async create(userId: string, dto: CreateCollectionDto) {
        const { name } = dto;
        return this.prismaService.collection.create({
            data: {
                name,
                userId,
            },
        });
    }

    async update(id: string, userId: string, dto: UpdateCollectionDto) {
        const { name } = dto;
        const collection = await this.prismaService.collection.findFirst({
            where: { id, userId }
        });

        if (!collection) {
            throw new NotFoundException('Коллекция не найдена');
        }

        return this.prismaService.collection.update({
            where: { id, },
            data: {
                name,
            },
        });
    }

    async delete(id: string, userId: string) {
        const collection = await this.prismaService.collection.findFirst({
            where: { id, userId }
        });

        if (!collection) {
            throw new NotFoundException('Коллекция не найдена');
        }

        return this.prismaService.collection.delete({
            where: { id, }
        });
    }

    async updateProblemCollections(userId: string,
                          problemId: string,
                          collectionIds: string[]
    ) {

        // 1. Получаем ВСЕ коллекции пользователя
        const userCollections = await this.prismaService.collection.findMany({
            where: { userId },
            select: { id: true }
        });

        const userCollectionIds = userCollections.map(c => c.id);

        // 2. Удаляем задачу из всех коллекций пользователя
        await this.prismaService.collectionProblem.deleteMany({
            where: {
                problemId,
                collectionId: {
                    in: userCollectionIds
                }
            }
        });

        // 3. Добавляем только выбранные
        const data = collectionIds.map(collectionId => ({
            collectionId,
            problemId
        }));

        await this.prismaService.collectionProblem.createMany({
            data,
            skipDuplicates: true
        });

        return { success: true };
    }

    async getCollectionsWithProblem(userId: string, problemId: string) {
        const collections = await this.prismaService.collection.findMany({
            where: { userId },
            include: {
                problems: {
                    where: { problemId }
                }
            }
        });

        return collections.map(c => ({
            id: c.id,
            name: c.name,
            hasProblem: c.problems.length > 0
        }));
    }

}
