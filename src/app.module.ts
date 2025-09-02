import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/users.module';
import { UserService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // optional: global makes it available everywhere
    AuthModule,
    NotesModule,
    PrismaModule,
    UserModule,
  ],
  providers: [UserService],
})
export class AppModule {}
