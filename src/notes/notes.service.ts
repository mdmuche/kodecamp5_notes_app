import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { NotesQueryDto } from './dto/notes-query.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    const note = await this.prisma.note.create({
      data: {
        ...createNoteDto,
        user: { connect: { id: userId } },
      },
    });
    return new NoteResponseDto(note);
  }

  async findAll(notesQueryDto: NotesQueryDto) {
    const page = Number(notesQueryDto?.page ?? 1);
    const limit = Number(notesQueryDto?.limit ?? 10);
    function buildPaginationArgs() {
      const take = limit;
      const skip = (page - 1) * take;
      return { take, skip };
    }

    const where = {
      ...(notesQueryDto?.search && {
        OR: [
          { title: { contains: notesQueryDto.search } },
          { content: { contains: notesQueryDto.search } },
        ],
      }),
    };

    const [notes, total] = await Promise.all([
      this.prisma.note.findMany({
        ...buildPaginationArgs(),
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.note.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: notes.map((note) => new NoteResponseDto(note)),
      pagination: {
        total,
        totalPages,
        currentPage: Number(notesQueryDto.page ?? 1),
        pageSize: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });
    if (!note) {
      throw new NotFoundException('note not found');
    }
    return new NoteResponseDto(note);
  }

  async updateNote(
    @CurrentUser() userId: string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ) {
    const note = await this.prisma.note.findUnique({ where: { id, userId } });
    if (!note) {
      throw new NotFoundException();
    }

    const updatedNote = await this.prisma.note.update({
      where: { id, userId },
      data: updateNoteDto,
    });

    return new NoteResponseDto(updatedNote);
  }

  async remove(@CurrentUser() userId: string, id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException('note not found');
    }

    await this.prisma.note.delete({
      where: { id, userId },
    });

    return { message: 'note deleted successfully' };
  }
}
