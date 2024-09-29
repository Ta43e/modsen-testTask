import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Get user information' })
    @ApiResponse({ status: 200, description: 'User data retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get()
    async getUser(@Req() req) {
        return this.userService.getUser(req.user.login);
    }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request or invalid data.' })
    @ApiBody({ type: CreateUserDto, description: 'Data for the new user' })
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}
