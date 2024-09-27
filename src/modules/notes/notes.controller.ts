import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Request, Res } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { SerchNoteDto } from './dto/serch-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}

    @ApiTags('Notes')
    @Get()
    async getNotes(@Query() SerchNoteDto: SerchNoteDto) {
        return this.notesService.getNotes(SerchNoteDto);
    }

    @ApiTags('Notes')
    @Get(':id')
    async getNote(@Param('id') id: string ) {
        return this.notesService.getNote(id);
    }

    @ApiTags('Notes')
    @Post('create')
    async createNotes(@Body() createNoteDto: CreateNoteDto) {
        return this.notesService.createNotes(createNoteDto);
    }

    @ApiTags('Notes')
    @Put('update/:id')
    async updateNotes(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, ) {
        return this.notesService.updateNotes(id, updateNoteDto);
    }

    @ApiTags('Notes')
    @Delete('delete/:id')
    async deleteNotes(@Param('id') id: string) {
        return this.notesService.deteleNotes(id);
    }
}
