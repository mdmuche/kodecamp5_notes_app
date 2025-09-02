import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/users/users.module';
import { NotesController } from './notes.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
