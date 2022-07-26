import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getMongoDbConfig } from './config/mongo.config';
import { UserModule } from './user/user.module';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { ActorModule } from './actor/actor.module';
import { MovieModule } from './movie/movie.module';
import { TagModule } from './tags/tag.module';
import { RatingModule } from './rating/rating.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: getMongoDbConfig
    }),
    AuthModule,
    UserModule,
    GenreModule,
    FileModule,
    ActorModule,
    MovieModule,
    TagModule,
    RatingModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
