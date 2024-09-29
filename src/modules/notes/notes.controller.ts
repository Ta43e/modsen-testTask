import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { SerchNoteDto } from './dto/serch-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase-service';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
    constructor(private notesService: NotesService, private firebaseService: FirebaseService) {}

    @ApiOperation({ summary: 'Get list of notes' })
    @ApiResponse({ status: 200, description: 'List of notes successfully retrieved.' })
    @ApiQuery({ name: 'search', required: false, description: 'Filter notes by keyword or other parameters' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getNotes(@Req() req, @Query() searchNoteDto: SerchNoteDto) {
        return this.notesService.getNotes(searchNoteDto, req.user._id);
    }

    @ApiOperation({ summary: 'Get a single note by ID' })
    @ApiResponse({ status: 200, description: 'Note successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    @ApiParam({ name: 'id', description: 'The ID of the note' })
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getNote(@Req() req, @Param('id') id: string ) {
        return this.notesService.getNote(id, req.user._id);
    }

    @ApiOperation({ summary: 'Create a new note' })
    @ApiResponse({ status: 201, description: 'Note successfully created.' })
    @ApiBody({ type: CreateNoteDto, description: 'Details for the new note, including an optional image file.' })
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @Post('create')
    @UseInterceptors(FileInterceptor('file')) 
    async createNotes(
        @Req() req, 
        @Body() createNoteDto: CreateNoteDto, 
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
          createNoteDto.imgUrl = await this.firebaseService.uploudFile(file);
        }
        return this.notesService.createNotes(createNoteDto, req.user._id);
    }

    @ApiOperation({ summary: 'Update an existing note' })
    @ApiResponse({ status: 200, description: 'Note successfully updated.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    @ApiParam({ name: 'id', description: 'The ID of the note to update' })
    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updateNotes(
        @Req() req, 
        @Param('id') id: string, 
        @Body() updateNoteDto: UpdateNoteDto
    ) {
        return this.notesService.updateNotes(id, updateNoteDto, req.user._id);
    }

    @ApiOperation({ summary: 'Delete a note by ID' })
    @ApiResponse({ status: 200, description: 'Note successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    @ApiParam({ name: 'id', description: 'The ID of the note to delete' })
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async deleteNotes(@Req() req, @Param('id') id: string) {
        return this.notesService.deteleNotes(id, req.user._id);
    }
}
