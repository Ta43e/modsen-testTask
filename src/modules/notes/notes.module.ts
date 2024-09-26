import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from 'src/schemas/note.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { NotesController } from './notes.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Note.name, schema: NoteSchema}]),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
