import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/users.module';
import { UsersModule } from './userss/users.module';
import { UserService } from './users/users.service';

@Module({
  imports: [AuthModule, UsersModule, NotesModule, PrismaModule, UserModule],
  providers: [UserService],
})
export class AppModule {}
