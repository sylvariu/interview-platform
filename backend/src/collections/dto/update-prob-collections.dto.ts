import {IsArray, IsString} from "class-validator";

export class UpdateProblemCollectionDto {
    @IsString()
    problemId: string;

    @IsArray()
    @IsString({ each: true })
    collectionIds: string[];
}