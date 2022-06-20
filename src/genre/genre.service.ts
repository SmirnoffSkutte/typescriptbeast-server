import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieService } from 'src/movie/movie.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { ICollection } from './genre.interface';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
    constructor(@InjectModel(GenreModel) private readonly GenreModel:ModelType<GenreModel>,
    private readonly movieService:MovieService)
    {}

    async bySlug(slug:string){
        const doc = await this.GenreModel.findOne({slug}).exec()
        if(!doc) throw new NotFoundException('Жанр не найден')
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
                    {
                        description:new RegExp(searchTerm,'i')
                    },
                ]
            }
        return this.GenreModel.find(options)
        .select('-updatedAt -__v')
        .sort({
            createdAt:'desc'
        }).exec()
    }
	// async getCollections(): Promise<ICollection[]> {
	// 	const genres = await this.getAll()

	// 	const collections = await Promise.all(
	// 		genres.map(async (genre) => {
	// 			const moviesByGenre = await this.movieService.byGenres([genre._id])
	// 			const result: ICollection = {
	// 				_id: String(genre._id),
	// 				title: genre.name,
	// 				slug: genre.slug,
	// 				image: moviesByGenre[0].poster,
	// 			}

	// 			return result
	// 		})
	// 	)

	// 	return collections
	// }


    // Admin 

    async create(){
        const defaultValue:CreateGenreDto={
            name:'',
            slug:'',
            description:'',
            icon:''
        }
        const genre = await this.GenreModel.create(defaultValue)
        return genre._id
    }

    async update(_id:string,dto:CreateGenreDto){
        return this.GenreModel.findByIdAndUpdate(_id,dto,{
            new:true
        }).exec()
    }

    async getCount(){
        return this.GenreModel.find().count().exec()
    }

    async delete(id:string){
        const genre = await this.GenreModel.findById(id)
        if (!genre) throw new NotFoundException('Жанра с таким id нет')
        await genre.delete()
        return genre
    }

    async byId(_id:string){
        const genre = await this.GenreModel.findById(_id)
        if(!genre) throw new NotFoundException('Жанр не найден')

        return genre
    }

}
