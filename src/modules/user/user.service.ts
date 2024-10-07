import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from 'src/schemas/note.schema';
import { User } from 'src/schemas/user.schema';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async getUser(login: string) {
    if (!login) {
      throw new BadRequestException('Login must be provided.');
    }
    const user = await this.userModel.findOne({ login }).exec();

    if (!user) {
      throw new NotFoundException(`User with login "${login}" not found.`);
    }

    return user;
  }
}
