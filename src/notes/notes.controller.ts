import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NoteResponseDto } from './dto/note-response.dto';
import { CurrentUserId } from 'src/auth/decorators/current-user.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesQueryDto } from './dto/notes-query.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'Note has been successfully created',
    type: NoteResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    if (!userId) {
      throw new ForbiddenException(
        'you do not have permission to create a note',
      );
    }
    return await this.notesService.create(userId, createNoteDto);
  }

  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved',
    type: NoteResponseDto,
  })
  @Get()
  async findAll(@Query() notesQueryDto: NotesQueryDto) {
    return await this.notesService.findAll(notesQueryDto);
  }

  @ApiOperation({ summary: 'Get a single note' })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved by id',
    type: NoteResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.notesService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({
    status: 200,
    description: 'Note updated by id',
    type: NoteResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put(':id')
  async updateNote(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() updateNoTeDto: UpdateNoteDto,
  ) {
    if (!userId) {
      throw new ForbiddenException(
        'you do not have permission to update a note',
      );
    }
    return await this.notesService.updateNote(userId, id, updateNoTeDto);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({
    status: 200,
    description: 'Note deleted by id',
    type: NoteResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':id')
  async DeleteNote(@CurrentUserId() userId: string, @Param('id') id: string) {
    if (!userId) {
      throw new ForbiddenException(
        'you do not have permission to delete a note',
      );
    }
    return await this.notesService.remove(userId, id);
  }
}
