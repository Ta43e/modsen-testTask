import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from 'src/schemas/note.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Note.name, schema: NoteSchema}]),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
