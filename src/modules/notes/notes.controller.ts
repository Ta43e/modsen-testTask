import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { SerchNoteDto } from './dto/serch-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}

    @ApiTags('Notes')

    @Get()
    @UseGuards(JwtAuthGuard)
    async getNotes(@Req() req, @Query() SerchNoteDto: SerchNoteDto) {
        console.log(req.user);
        return this.notesService.getNotes(SerchNoteDto, req.user._id);
    }

    @ApiTags('Notes')
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getNote(@Req() req, @Param('id') id: string ) {
        return this.notesService.getNote(id, req.user._id);
    }

    @ApiTags('Notes')
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createNotes(@Req() req, @Body() createNoteDto: CreateNoteDto) {
        console.log(req.user._id);
        return this.notesService.createNotes(createNoteDto, req.user._id);
    }

    @ApiTags('Notes')
    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updateNotes(@Req() req, @Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, ) {
        return this.notesService.updateNotes(id, updateNoteDto, req.user._id);
    }

    @ApiTags('Notes')
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async deleteNotes(@Req() req, @Param('id') id: string) {
        return this.notesService.deteleNotes(id, req.user._id);
    }
}
