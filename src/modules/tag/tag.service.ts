import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag } from 'src/schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {}

  async findOrCreateTags(tags: string[]): Promise<Types.ObjectId[]> {
    const tagIds: Types.ObjectId[] = [];
    for (const keyword of tags) {
      let tag = await this.tagModel.findOne({ keyword });
      if (!tag) {
        tag = await this.tagModel.create({ keyword });
      }
      tagIds.push(tag._id);
    }

    return tagIds;
  }

  async findAndUpdateTags(tags: string[]): Promise<Types.ObjectId[]> {
    const tagIds: Types.ObjectId[] = [];
    for (const keyword of tags) {
      let tag = await this.tagModel.findOne({ keyword });
      if (!tag) {
        tag = await this.tagModel.create({ keyword });
      }
      tagIds.push(tag._id);
    }

    return tagIds;
  }
}
