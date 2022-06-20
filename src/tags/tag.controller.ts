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
import { CreateTagDto } from './dto/create-tag.dto'
import { TagService } from './tag.service'

@Controller('tags')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.tagService.bySlug(slug)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.tagService.getAll(searchTerm)
	}

	// @Get('/collections')
	// async getCollections() {
	// 	return this.tagService.getCollections()
	// }

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.tagService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.tagService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateTagDto
	) {
		const updateGenre = await this.tagService.update(id, dto)
		if (!updateGenre) throw new NotFoundException('Тэг не найден')
		return updateGenre
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.tagService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Тэг не найден')
		
	}
}
