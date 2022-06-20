import {prop, Ref} from '@typegoose/typegoose'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { ActorModel } from 'src/actor/actor.model'
import { GenreModel } from 'src/genre/genre.model'
import { TagModel } from 'src/tags/tag.model'

export interface MovieModel extends Base {}

export class Parameters{
    
    @prop()
    year?:string

    @prop()
    duration:number

    @prop()
    country?:string
}

export class MovieModel extends TimeStamps{
    @prop()
    poster?:string

    @prop()
    bigposter?:string

    @prop()
    title:string
    
    @prop({unique:true})
    slug:string

    @prop()
    description:string

    @prop()
    parameters: Parameters
    
    @prop({default:4})
    rating?:number
    
    @prop()
    videoUrl:string

    @prop({default:0})
    countOpened?:number
    
    @prop({ref:()=>GenreModel})
    genres:Ref<GenreModel>[]

    @prop({ref:()=>ActorModel})
    actors:Ref<ActorModel>[]

    @prop({ref:()=>TagModel})
    tags?:Ref<TagModel>[]

    @prop({default:false})
    isSendTelegram?:boolean
}