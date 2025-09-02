import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NoteResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<NoteResponseDto>) {
    Object.assign(this, partial);
  }
}
