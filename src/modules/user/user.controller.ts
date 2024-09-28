import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiTags('User')
    @Get()
    async getUser(@Req() req: Request) {
        //req.user.login
        return this.userService.getUser("test");
    }

    @ApiTags('User')
    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}
