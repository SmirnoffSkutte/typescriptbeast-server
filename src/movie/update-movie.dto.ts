import { IsArray, IsNumber, IsObject, IsString } from "class-validator";

export class Parameters{
    
    @IsNumber()
    year?:string

    @IsNumber()
    duration:number

    @IsString()
    country?:string
}

export class UpdateMovieDto {
    @IsString()
    poster?:string

    // @IsString()
    bigposter?:string

    @IsString()
    title:string
    
    @IsString()
    slug:string

    @IsString()
    description?:string

    @IsObject()
    parameters: Parameters
    
    @IsString()
    videoUrl:string
    
    @IsArray()
    @IsString({each:true})
    genres:string[]

    @IsArray()
    @IsString({each:true})
    actors:string[]

    @IsArray()
    @IsString({each:true})
    tags:string[]

    isSendTelegram?:boolean
}