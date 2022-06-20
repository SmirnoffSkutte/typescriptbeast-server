import { IsString } from "class-validator";

export class RefreshTokenDto {
    @IsString({
        message:'Ошибка в refreshToken.dto'
    })
    refreshToken: string
}