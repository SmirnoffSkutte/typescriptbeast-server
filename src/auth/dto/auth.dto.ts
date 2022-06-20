import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthDto{
    @IsEmail()
    email:string

    @MinLength(6,{
        message:'Хотя бы 6 символов сделай пароль :)'
    })
    @IsString()
    password:string
}