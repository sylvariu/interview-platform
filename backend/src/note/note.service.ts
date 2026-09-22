import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UpdateNoteDto} from "./dto/update-note.dto";

@Injectable()
export class NoteService {
    constructor(private prismaService: PrismaService) {}

    create(userId: string) {
        const now = new Date();

        const defaultTitle = `Заметка от ${now
            .toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
            })}`;

        return this.prismaService.note.create({
            data: {
                title: defaultTitle,
                content: '',
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prismaService.note.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    findById(id: string, userId: string) {
        return this.prismaService.note.findFirst({
            where: { id, userId },
        });
    }

    update(id: string, userId: string, dto: UpdateNoteDto) {
        return this.prismaService.note.updateMany({
            where: { id, userId },
            data: dto,
        });
    }

    delete(id: string, userId: string) {
        return this.prismaService.note.deleteMany({
            where: { id, userId },
        });
    }
}
