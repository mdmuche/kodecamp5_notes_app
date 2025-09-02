import { IsNotEmpty, IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Note title',
    example: 'My important note',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title is too long' })
  title: string;

  @ApiProperty({
    description: 'Note content',
    example: 'My important note content',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;
}
