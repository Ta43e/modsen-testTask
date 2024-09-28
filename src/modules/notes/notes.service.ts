import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { retry } from 'rxjs';
import { Note } from 'src/schemas/note.schema';
import { User } from 'src/schemas/user.schema';
import { SerchNoteDto } from './dto/serch-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectModel(Note.name) private noteModel: Model<Note>,
        @InjectModel(User.name) private userModel: Model<User>
    ) {}
    async getNotes(searchNoteDto: SerchNoteDto): Promise<Note[]> {
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

        console.log(query);
        //query.owner = owner;
        return this.noteModel
        .find(query)
        .sort(sort)  
        .skip(offset)
        .limit(limit)
        .exec();                
    }

    async getNote(id: string) {
        return this.noteModel.findById(id).exec();
    }
    
    async createNotes(createNoteDto: CreateNoteDto) {
        const owner = '615c5eb8e13e4b2f8c32bdf3';
        const createNoteObj = {
          ...createNoteDto,
          owner,
        };
        return await this.noteModel.create(createNoteObj);
    }

    async deteleNotes(_id: string) {
        return await this.noteModel.deleteOne({_id: _id}).exec();
    }

    async updateNotes(id: string, updateNoteDto: UpdateNoteDto) {
        return this.noteModel.updateOne({_id: id}, updateNoteDto).exec();

    }
}
