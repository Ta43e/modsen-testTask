import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { retry } from 'rxjs';
import { Note } from 'src/schemas/note.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class NotesService {
    constructor(@InjectModel(Note.name) private noteModel: Model<Note>,
                @InjectModel(User.name) private userModel: Model<User>) {}
    getNotes() {
        return this.noteModel.find();
    }

}
