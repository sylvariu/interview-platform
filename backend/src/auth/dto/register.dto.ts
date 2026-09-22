import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
    @MaxLength(50, { message: 'Длина имени не должна превышать 50 символов' })
    name: string;

    @IsString({ message: 'Адрес почты должен быть строкой' })
    @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
    @IsEmail({}, { message: 'Некорректный формат электронной почты' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
    @MinLength(6, { message: 'Пароль должен содержать не менее 6 символов' })
    @MaxLength(128, { message: 'Пароль должен содержать не более 128 символов' })
    password: string;
}