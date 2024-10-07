import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from 'src/schemas/note.schema';
import { Tag, TagSchema } from 'src/schemas/tag.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

import { FirebaseService } from '../firebase/firebase-service';
import { TagService } from '../tag/tag.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    JwtModule,
  ],
  controllers: [NotesController],
  providers: [NotesService, FirebaseService, TagService],
  exports: [NotesService, FirebaseService, TagService],
})
export class NotesModule {}
