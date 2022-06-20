import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { ActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller('actors')
export class ActorController {
    constructor(private readonly actorService: ActorService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.actorService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('page') page?:string,@Query('searchTerm') searchTerm?: string) {
		return this.actorService.getAll(page,searchTerm)
	}

	@Get('no-pages')
	async getAllNoPages(@Query('searchTerm') searchTerm?: string) {
		return this.actorService.getAllNoPages(searchTerm)
	}

	// @Get('/popular')
	// async getPopular() {
	// 	return this.genreService.getPopular()
	// }

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.actorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ActorDto
	) {
		const updateGenre = await this.actorService.update(id, dto)
		if (!updateGenre) throw new NotFoundException('Актер не найден')
		return updateGenre
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.actorService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Актер не найден')
		
	}
}
