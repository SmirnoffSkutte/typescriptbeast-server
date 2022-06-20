import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorDto } from './actor.dto';
import { ActorModel } from './actor.model';
import { MovieService } from 'src/movie/movie.service';
import { ICollection } from 'src/genre/genre.interface';
import { limitPerPage } from 'src/config/limitConst';
@Injectable()
export class ActorService {
    constructor(
        @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>,
        private readonly movieService:MovieService
    ) {}

    async bySlug(slug:string){
        const doc = await this.ActorModel.findOne({slug}).exec()
        if(!doc) throw new NotFoundException('Актер не найден')
        return doc 
        // Вместо doc может быть актер/фильм и т.д
    }

    async getAll(page:string,searchTerm?:string){
        let limit=undefined
        if (page) {
            limit=limitPerPage
        }
        const pageValue=Number(page)
        let skip=pageValue*limit-limit
        let options={}
        if(searchTerm)
            options={
                $or:[
                    {
                        name:new RegExp(searchTerm,'i')
                    },
                    {
                        slug:new RegExp(searchTerm,'i')
                    },
                ]
            }

            //  Aggregations
        return this.ActorModel.aggregate().match(options).lookup({
            from:'Movie',
            localField:'_id',
            foreignField:'actors',
            as:'movies'
        }).addFields({
            countMovies:{
                $size:'$movies'
            }
        })
        .project({__v:0,updatedAt:0,movies:0})
        .sort({
            createdAt:-1
        }).skip(skip).limit(limit)
        .exec()
    }

    async getAllNoPages(searchTerm?:string){
        let options={}
        if(searchTerm)
            options={
                $or:[
                    {
                        name:new RegExp(searchTerm,'i')
                    },
                    {
                        slug:new RegExp(searchTerm,'i')
                    },
                ]
            }

            //  Aggregations
        return this.ActorModel.aggregate().match(options).lookup({
            from:'Movie',
            localField:'_id',
            foreignField:'actors',
            as:'movies'
        }).addFields({
            countMovies:{
                $size:'$movies'
            }
        })
        .project({__v:0,updatedAt:0,movies:0})
        .sort({
            createdAt:-1
        })
        .exec()
    }

    // async getCollections(): Promise<ICollection[]> {
	// 	const actors = await this.getAll()

	// 	const collections = await Promise.all(
	// 		actors.map(async (actor) => {
	// 			const moviesByActor = await this.movieService.byActor(actor._id)
    //             // const actorImage = await this.bySlug(actor.slug)
	// 			const result: ICollection = {
	// 				_id: String(actor._id),
	// 				title: actor.name,
	// 				slug: actor.slug,
	// 				image: actor.image,
	// 			}

	// 			return result
	// 		})
	// 	)

	// 	return collections
	// }

    // Admin 

    async create(){
        const defaultValue:ActorDto={
            name:'',
            slug:'',
            photo:''
        }
        const actor = await this.ActorModel.create(defaultValue)
        return actor._id
    }

    async update(_id:string,dto:ActorDto){
        return this.ActorModel.findByIdAndUpdate(_id,dto,{
            new:true
        }).exec()
    }

    async getCount(){
        return this.ActorModel.find().count().exec()
    }

    async delete(id:string){
        const actor = await this.ActorModel.findById(id)
        if (!actor) throw new NotFoundException('Актера с таким id нет')
        await actor.delete()
        return actor      
    }

    async byId(_id:string){
        const actor = await this.ActorModel.findById(_id)
        if(!actor) throw new NotFoundException('Актер не найден')

        return actor
    }
}
