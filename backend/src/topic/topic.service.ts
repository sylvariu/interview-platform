import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Category} from "@prisma/client";

@Injectable()
export class TopicService {
    constructor(private prismaService: PrismaService) {}

    //поменяла на Category вместо string
    create(name: string, category: Category, parentId?: string) {
        return this.prismaService.topic.create({
            data: {
                name,
                category,
                parentId,
            },
        });
    }

    async getSectionsGrouped() {
        const roots = await this.prismaService.topic.findMany({
            where: { parentId: null },
            include: {
                children: true, // React, Vue и т.д.
            },
        });

        return roots;
    }

    async getChildren(parentId: string) {
        return this.prismaService.topic.findMany({
            where: { parentId },
        });
    }

    async getById(id: string) {
        return this.prismaService.topic.findUnique({
            where: { id },
        });
    }
}
