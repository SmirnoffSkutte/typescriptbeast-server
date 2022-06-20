import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { UpdateMovieDto } from './update-movie.dto'
import { MovieService } from './movie.service'
import { Types } from 'mongoose'
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.movieService.bySlug(slug)
	}

	// @Get()
	// async getAll(@Query('searchTerm') searchTerm?: string) {
	// 	return this.movieService.getAll(searchTerm)
	// }

	@Get()
 	  async getAll(@Query('page') page?:string,@Query('searchTerm') searchTerm?: string) {
     	return this.movieService.findAll(page,searchTerm);
  	 }
	@Get('/no-pages')
 	  async getAllNoPages(@Query('searchTerm') searchTerm?: string) {
     	return this.movieService.findAllNoPages(searchTerm);
  	 }

	@Get('most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId',IdValidationPipe) actorId: Types.ObjectId,@Query('page') page?:string) {
		return this.movieService.byActor(actorId,page)
	}

    @UsePipes(new ValidationPipe())
    @Post('by-genres')
    @HttpCode(200)
	async byGenres(@Body('genreIds') genreIds: Types.ObjectId[],@Body('page') page:number) {
		return this.movieService.byGenres(genreIds,page)
	}

	@UsePipes(new ValidationPipe())
    @Post('by-tags')
    @HttpCode(200)
	async byTags(@Body('tagIds') tagIds: Types.ObjectId[],@Body('page') page:number) {
		return this.movieService.byTags(tagIds,page)
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(
		@Body('slug') slug: string
	) {
		return this.movieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateMovieDto
	) {
		const updateGenre = await this.movieService.update(id, dto)
		if (!updateGenre) throw new NotFoundException('Фильм не найден')
		return updateGenre
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.movieService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Фильм не найден')
        return deletedDoc
		
	}
}
