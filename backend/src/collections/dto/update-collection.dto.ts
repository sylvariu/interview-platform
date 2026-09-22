import {IsString, Length} from "class-validator";

export class UpdateCollectionDto {
    @IsString()
    @Length(1, 50)
    name: string;
}