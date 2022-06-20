import {ConfigService} from '@nestjs/config'
import { TypegooseModule, TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoDbConfig = async( configService : ConfigService):Promise<TypegooseModuleOptions> => ({
 uri: configService.get('MONGO_URI')
})