import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req.cookies.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'qwer',
    });
  }

  async validate(payload) {
    const user = await this.userModel.findOne({ login: payload.login }).exec();
    return { login: user.login, _id: user._id };
  }
}
