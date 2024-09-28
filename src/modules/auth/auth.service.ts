import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Res,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { generatePassword } from './utils/generator';
import { UserService } from '../user/user.service';
import { hashPassword } from './utils/hashPassword';
import { comparePasswords } from './utils/comparePasswords';
import { MailService } from '../mail/mail-service';

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
      
      if (!comparePasswords(user.password, userExists.password)) throw new UnauthorizedException('Неверный пароль!');
     
      return this.generateToken(user);
    }
    
    async loginOAuth(user) {
        if (user) return this.generateToken(user);
        const password = await generatePassword();
        this.mailService.sendMail(password, user.login);
        return this.registerUser({login: user.login, password: password})
    }

    async registerUser(user: CreateUserDto) {
      try {
        user.password = await hashPassword(user.password);
        const newUser = await this.userService.createUser(user);
       return this.generateToken(newUser);
      } catch {
        throw new InternalServerErrorException();
      }
    }

    async findUserByLogin(login) {
        const user = await this.userModel.findOne({ login }).exec();
        if (!user) {
          return null;
        }
        return user;
      }
      
    private async generateToken(user) {
        const payload = {login: user.login, _id: user._id};
        const accessToken = this.jwtService.sign(payload, { secret: process.env.ACCESS_SERCET, expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.REFRESH_SECRET, expiresIn: '1d' });
        return {
            accessToken, refreshToken
        };
    }

    async logout(@Res() res: Response) {
        res.clearCookie('jwt');
        return res.send({ 
            message: 'Logged out successfully',
        });
    }
  }

