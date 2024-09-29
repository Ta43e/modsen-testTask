import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Note } from 'src/schemas/note.schema';
import { User } from 'src/schemas/user.schema';
import { SerchNoteDto } from './dto/serch-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FirebaseService } from '../firebase/firebase-service';

@Injectable()
export class NotesService {
    constructor(
        @InjectModel(Note.name) private noteModel: Model<Note>,
        @InjectModel(User.name) private userModel: Model<User>,
        private firebaseService: FirebaseService
    ) {}
    async getNotes(searchNoteDto: SerchNoteDto, owner: ObjectId): Promise<Note[]> {
        const { searchQuery, filter, sortOrder, offset, limit } = searchNoteDto;
        const query: Record<string, any> = {};
        if (searchQuery) {
            query.$or = [   
            { topic: { $regex: new RegExp(searchQuery, 'i') } },
            { description: { $regex: new RegExp(searchQuery, 'i') } },
            ];
        }
    
        if (filter) {
            query.tags = { $regex: new RegExp(filter, 'i') };
        }

        const sort: { [key: string]: 1 | -1 } = {};

        if (sortOrder) {
            sort['topic'] = sortOrder === 'asc' ? 1 : -1;
        }

        query.owner = owner;
        return this.noteModel 
        .find(query)
        .sort(sort)  
        .skip(offset)
        .limit(limit)
        .exec();                
    }

    async getNote(id: string, owner: ObjectId) {
        const query: Record<string, any> = {};
        query.owner = owner;
        query._id = id;
        return this.noteModel.find(query).exec();
    }
    
    async createNotes(createNoteDto: CreateNoteDto, owner: ObjectId) {
        const createNoteObj = {
          ...createNoteDto,
          owner,
        };
        delete createNoteObj.file;
        return await this.noteModel.create(createNoteObj);
    }

    async deteleNotes(_id: string, owner: ObjectId) {
        const note = await this.noteModel.findOne({_id: _id, owner: owner});
        if (note) {
            this.firebaseService.deleteFile(note.imgUrl);
            return this.noteModel.deleteOne({ _id: _id, owner: owner }).exec();
        } 
        throw new NotFoundException(`Note with id ${_id} not found`);
    }

    async updateNotes(id: string, updateNoteDto: UpdateNoteDto, owner: ObjectId) {
        return this.noteModel.updateOne({_id: id, owner: owner}, updateNoteDto).exec();
    }
}
