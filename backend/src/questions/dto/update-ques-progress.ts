import {IsEnum} from "class-validator";
import {QuestionLearningStatus} from "@prisma/client";

export class UpdateQuestionProgressDto {
    @IsEnum(QuestionLearningStatus)
    status: QuestionLearningStatus;
}