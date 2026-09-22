import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import { Problems } from "@prisma/client";
import {CreateProblemDto} from "./dto/create-problem.dto";

@Injectable()
export class ProblemsService {
    constructor( private readonly prismaService: PrismaService) {}

    async findAll() {
        return this.prismaService.problems.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id: string) {
        const problem = await this.prismaService.problems.findUnique({
            where: { id },
        });

        if (!problem)
            throw new NotFoundException(`Задача с id ${id} не найдена`);

        return problem;
    }

    async create(dto: CreateProblemDto): Promise<Problems> {
        const { title, description, category, difficulty, tags, solution } = dto;

        const problem = await this.prismaService.problems.create({
            data: {
                title,
                description,
                category,
                difficulty,
                tags: tags ?? [],
                solution,
            },
        });
        return problem;
    }

    async update(id: string, dto:CreateProblemDto){
        await this.findById(id); //если задачи нет, вывод ошибки
        await this.prismaService.problems.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                category: dto.category,
                difficulty: dto.difficulty,
                tags: dto.tags, // ?? []
                solution: dto.solution,
            },
        });

        return true;
    }

    async delete(id: string) {
        await this.findById(id);
        await this.prismaService.problems.delete({
            where: { id },
        })
    }
}
