import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModule } from 'src/movie/movie.module';
import { TagController } from './tag.controller';
import { TagModel } from './tag.model';
import { TagService } from './tag.service';

@Module({
  imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TagModel,
				schemaOptions: {
					collection: 'Tag',
				},
			},
		]),
		MovieModule
	],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}
