import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { IsString } from "class-validator";

export interface CommentsModel extends Base{}

export class CommentsModel extends TimeStamps{
    @IsString()
    username:string
    @IsString()
    commentBody:string
}