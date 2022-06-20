import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagModel } from './tag.model';
import { ICollection } from 'src/genre/genre.interface';
import { MovieService } from 'src/movie/movie.service';
@Injectable()
export class TagService {
    constructor(@InjectModel(TagModel) private readonly TagModel:ModelType<TagModel>,
    private readonly movieService:MovieService)
    {}

    async bySlug(slug:string){
        const doc = await this.TagModel.findOne({slug}).exec()
        if(!doc) throw new NotFoundException('Тэг не найден')
        return doc 
        // Вместо doc может быть актер/фильм и т.д
    }

    async getAll(searchTerm?:string){
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
        return this.TagModel.find(options)
        .select('-updatedAt -__v')
        .sort({
            createdAt:'desc'
        }).exec()
    }

    // async getCollections(): Promise<ICollection[]> {
	// 	const tags = await this.getAll()

	// 	const collections = await Promise.all(
	// 		tags.map(async (tag) => {
	// 			const moviesByTag = await this.movieService.byTags([tag._id])
	// 			const result: ICollection = {
	// 				_id: String(tag._id),
	// 				title: tag.name,
	// 				slug: tag.slug,
	// 				image: moviesByTag[0].poster,
	// 			}

	// 			return result
	// 		})
	// 	)

	// 	return collections
	// }
    // Admin 

    async create(){
        const defaultValue:CreateTagDto={
            name:'',
            slug:''
        }
        const tag = await this.TagModel.create(defaultValue)
        return tag._id
    }

    async update(_id:string,dto:CreateTagDto){
        return this.TagModel.findByIdAndUpdate(_id,dto,{
            new:true
        }).exec()
    }

    async getCount(){
        return this.TagModel.find().count().exec()
    }

    async delete(id:string){
        const tag = await this.TagModel.findById(id)
        if (!tag) throw new NotFoundException('Тэга с таким id нет')
        await tag.delete()
        return tag
    }

    async byId(_id:string){
        const tag = await this.TagModel.findById(_id)
        if(!tag) throw new NotFoundException('Тэг не найден')

        return tag
    }

}
