import { Controller, Get, Request, Res } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService) {}

    @ApiTags('Notes')
    @Get()
    async getNotes(@Request() req: Request) {
        return this.notesService.getNotes();
    }
}
