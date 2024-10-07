import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Google OAuth login redirection' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page.' })
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description:
      'Successfully authenticated with Google and received user data.',
  })
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.loginOAuth(req.user);
  }

  @ApiOperation({ summary: 'Login using credentials' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in and tokens are returned.',
  })
  @ApiResponse({ status: 400, description: 'Login or password is missing.' })
  @ApiBody({ type: CreateUserDto, description: 'Login credentials.' })
  @Post('login')
  async signIn(@Body() dto: CreateUserDto, @Res() res: Response) {
    if (!dto.login)
      throw new BadRequestException('Login or password is missing');
    const tokens: { accessToken: string; refreshToken: string } =
      await this.authService.signIn(dto);
    res.cookie('jwt', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    res.send(tokens);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request or invalid data.' })
  @ApiBody({ type: CreateUserDto, description: 'New user registration data.' })
  @Post('registration')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @ApiOperation({ summary: 'Logout the user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out.' })
  @Get('logout')
  async logout(@Res() res) {
    return this.authService.logout(res);
  }
}
