import { Injectable, NotFoundException} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateMovieDto } from './update-movie.dto';
import { MovieModel } from './movie.model';
import { ObjectId, Types } from 'mongoose';
import { truncate } from 'fs-extra';
import { limitPerPage } from 'src/config/limitConst';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
    ) {}

    async bySlug(slug:string){
        const doc = await this.MovieModel.findOne({slug}).populate('actors genres tags').exec()
        if(!doc) throw new NotFoundException('Фильм не найден')
        return doc 
        // Вместо doc может быть актер/фильм и т.д
    }

    async findAll(page:string,searchTerm:string) {
        let limit=undefined
        if (page) {
            limit=limitPerPage
        }
        const pageValue=Number(page)
        let skip=pageValue*limit-limit
        const query = this.MovieModel
          .find({
             $or:[
                 {
                    title:new RegExp(searchTerm,'i')
                 },
             ],
            })
          .sort({ createdAt:'desc' }).populate('actors genres tags')
          .skip(skip)
       
        if (limit) {
          query.limit(limit);
        }
        return query;
      }

      async findAllNoPages(searchTerm:string) {
        const query = this.MovieModel
          .find({
             $or:[
                 {
                    title:new RegExp(searchTerm,'i')
                 },
             ],
            })
          .sort({ createdAt:'desc' }).populate('actors genres tags').exec()
        return query;
      }


   

    async byActor(actorId:Types.ObjectId,page:string){
        let limit=undefined
        if (page) {
            limit=limitPerPage
        }
        const pageValue=Number(page)
        let skip=pageValue*limit-limit
        
        const docs = await this.MovieModel.find({actors:actorId}).skip(skip).limit(limit).exec()
        if(!docs) throw new NotFoundException('Фильмы не найдены')
        return docs
        // Вместо doc может быть актер/фильм и т.д
    }

    
    async byGenres(genreIds:Types.ObjectId[],page:number){
        let limit=limitPerPage
        const pageValue=page
        let skip=pageValue*limit-limit
        const docs = await this.MovieModel.find({genres:{
            $in:genreIds
        }}).skip(skip).limit(limit)
        .exec()
        if(!docs) throw new NotFoundException('Фильмы не найдены')
        return docs
        // Вместо doc может быть актер/фильм и т.д
    }

    async byTags(tagIds:Types.ObjectId[],page:number){
        let limit=limitPerPage
        const pageValue=page
        let skip=pageValue*limit-limit
        const docs = await this.MovieModel.find({tags:{
            $in:tagIds
        }}).skip(skip).limit(limit)
        .exec()
        if(!docs) throw new NotFoundException('Фильмы не найдены')
        return docs
        // Вместо doc может быть актер/фильм и т.д
    }

    async updateCountOpened(slug:string){
        const updateDoc = await this.MovieModel.findOneAndUpdate({slug},{
            $inc:{countOpened:1}
        },
        {
            new:true
        })
        .exec()
        if (!updateDoc) throw new NotFoundException('Фильм не найден')
        return updateDoc
    }

    async getMostPopular(){
        return this.MovieModel.find({countOpened : {$gt: 0}}).sort({countOpened:-1}).populate('actors genres tags').exec()
    }

    async updateRating(id:Types.ObjectId,newRating:number){
        return this.MovieModel.findByIdAndUpdate(id,
            {
                rating:newRating
            },
            {
                new:true
            }).exec()
    }

    // Admin 

    async create(){
        const defaultValue:UpdateMovieDto={
            actors:[],
            genres:[],
            tags:[],
            parameters:{
                duration:0
            },
            description:'',
            title:'',
            videoUrl:'',
            slug:''
        }
        const movie = await this.MovieModel.create(defaultValue)
        return movie._id
    }

    async update(_id:string,dto:UpdateMovieDto){
        // telegram notifs mb here?
        const updateDoc = await this.MovieModel.findByIdAndUpdate(_id,dto,{
            new:true
        }).exec()
        if (!updateDoc) throw new NotFoundException('Фильм не найден')

        return updateDoc
    }

    async getCount(){
        return this.MovieModel.find().count().exec()
    }

    async delete(id:string){
        const movie = await this.MovieModel.findById(id)
        if (!movie) throw new NotFoundException('Фильма с таким id нет')
        await movie.delete()
        return movie
    }

    async byId(_id:string){
        const movie = await this.MovieModel.findById(_id)
        if(!movie) throw new NotFoundException('Фильм не найден')

        return movie
    }
}
