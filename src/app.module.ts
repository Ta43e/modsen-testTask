import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotesModule } from './modules/notes/notes.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env`
  }),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
    NotesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
