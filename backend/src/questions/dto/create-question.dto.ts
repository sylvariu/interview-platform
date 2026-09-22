import {Category} from "@prisma/client";

export class CreateQuestionDto {
    question: string;
    answer?: string;
    
    category: Category;
    topicId: string;
}