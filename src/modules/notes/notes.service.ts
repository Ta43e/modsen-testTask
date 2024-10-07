import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Note } from 'src/schemas/note.schema';
import { Tag } from 'src/schemas/tag.schema';

import { FirebaseService } from '../firebase/firebase-service';
import { TagService } from '../tag/tag.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { SerchNoteDto } from './dto/serch-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    private firebaseService: FirebaseService,
    private tagService: TagService,
  ) {}
  async getNotes(
    searchNoteDto: SerchNoteDto,
    owner: ObjectId,
  ): Promise<Note[]> {
    const { searchQuery, tags, sortOrder, offset, limit } = searchNoteDto;

    const conditions: Record<string, any>[] = [];

    if (searchQuery) {
      conditions.push({
        $or: [
          { topic: new RegExp(searchQuery, 'i') },
          { description: new RegExp(searchQuery, 'i') },
        ],
      });
    }
    const tagIds =
      tags && tags.length
        ? await this.tagModel
            .find({
              keyword: { $in: tags.map((tag) => new RegExp(tag, 'i')) },
            })
            .select('keyword')
            .exec()
        : [];

    if (tagIds.length > 0) {
      conditions.push({ tags: { $in: tagIds } });
    }

    const query = {
      owner,
      ...(conditions.length > 0 ? { $and: conditions } : {}),
    };

    const sort: { [key: string]: 1 | -1 } = {};
    if (sortOrder) {
      sort['topic'] = sortOrder === 'asc' ? 1 : -1;
    }

    return await this.noteModel
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
    const { tags, ...noteData } = createNoteDto;
    const tagIds: Types.ObjectId[] =
      await this.tagService.findOrCreateTags(tags);
    const createNoteObj = {
      ...noteData,
      tags: tagIds,
      owner,
    };
    delete createNoteObj.file;
    return await this.noteModel.create(createNoteObj);
  }

  async deteleNotes(_id: string, owner: ObjectId) {
    const note = await this.noteModel.findOne({ _id: _id, owner: owner });
    if (note) {
      this.firebaseService.deleteFile(note.imgUrl);
      return this.noteModel.deleteOne({ _id: _id, owner: owner }).exec();
    }
    throw new NotFoundException(`Note with id ${_id} not found`);
  }

  async updateNotes(id: string, updateNoteDto: UpdateNoteDto, owner: ObjectId) {
    const { tags, ...updateNoteDate } = updateNoteDto;
    const tagIds: Types.ObjectId[] =
      await this.tagService.findAndUpdateTags(tags);
    return this.noteModel
      .updateOne({ _id: id, owner: owner }, updateNoteDate, tagIds)
      .exec();
  }
}
