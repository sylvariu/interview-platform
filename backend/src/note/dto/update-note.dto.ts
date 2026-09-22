import {IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

export class UpdateNoteDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;
}