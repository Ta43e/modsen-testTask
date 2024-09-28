import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  
  @Controller('api/auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @ApiTags('Auth')
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async auth() {}

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req) {
        return this.authService.loginOAuth(req.user);
    }

    @ApiTags('Auth')
    @Post('login')
    async singIn(@Body() dto: CreateUserDto, @Res() res: Response){
        if(!dto.login) throw new BadRequestException('Login or password is missing');
        console.log("Controller's OK")
        const tokens: {accessToken: string, refreshToken: string} = await this.authService.signIn(dto);
        res.cookie('jwt', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        res.send(tokens);
    }
    @ApiTags('Auth')
    @ApiOperation({summary: 'Регистрация пользователя'})
    @Post('registration')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.registerUser(createUserDto);
    }
  }