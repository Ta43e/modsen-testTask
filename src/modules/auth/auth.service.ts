import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

import { MailService } from '../mail/mail-service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { comparePasswords } from './utils/comparePasswords';
import { generateToken } from './utils/generateoken';
import { generatePassword } from './utils/generator';
import { hashPassword } from './utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signIn(user: CreateUserDto) {
    if (!user) throw new BadRequestException('Unauthenticated');

    const userExists = await this.findUserByLogin(user.login);
    if (!userExists) return this.registerUser(user);

    if (!comparePasswords(user.password, userExists.password))
      throw new UnauthorizedException('Wrong password!');

    return generateToken(user);
  }

  async loginOAuth(user) {
    if (user) return generateToken(user);
    const password = await generatePassword();
    this.mailService.sendMail(password, user.login);
    return this.registerUser({ login: user.login, password: password });
  }

  async registerUser(user: CreateUserDto) {
    try {
      user.password = await hashPassword(user.password);
      const newUser = await this.userService.createUser(user);
      return generateToken(newUser);
    } catch {
      throw new InternalServerErrorException('Error during registration');
    }
  }

  async findUserByLogin(login) {
    const user = await this.userModel.findOne({ login }).exec();
    if (!user) {
      return null;
    }
    return user;
  }
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({
      message: 'Logged out successfully',
    });
  }
}
