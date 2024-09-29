import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        PassportModule.register({session: false}),
        UserModule,
        MailModule,
        JwtModule.register({
            secret: 'SECRET',
            signOptions: {
            expiresIn: '24h'
            }
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
