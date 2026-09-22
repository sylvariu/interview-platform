import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateNoteDto {
    title?: string;
    content?: string;
}