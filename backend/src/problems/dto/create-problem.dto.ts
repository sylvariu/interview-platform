import {IsArray, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Category, Difficulty} from "@prisma/client";


export class CreateProblemDto{
    @IsNotEmpty() // пустая строка не может являться названием
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString({ message: 'Описание должно быть строкой' })
    description: string;

    @IsEnum(Category)
    category: Category;

    @IsEnum(Difficulty)
    difficulty: Difficulty;

    @IsOptional()
    @IsArray({ message: 'Теги должны быть массивом' })
    @IsString({ each: true, message: 'Каждый тег должен быть строкой' })
    tags: string[];

    @IsOptional()
    @IsString()
    solution?: string;
}

