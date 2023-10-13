import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    IsEmpty,
} from 'class-validator'

export class RegisterDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    password: string

    @IsEmpty()
    role: string
}

export default RegisterDto
