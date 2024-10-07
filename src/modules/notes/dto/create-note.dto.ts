import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    default: 'MODSON',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    default: 'MODSON TEST TASK',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags for categorizing the note',
    isArray: true,
    required: false,
    default: ['tag1', 'tag2'],
  })
  @IsArray()
  @IsOptional()
  tags?: string[] = [];

  @ApiProperty({
    default: 'MODSON TEST TASK',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    default: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({
    description: 'Image file to upload',
    type: 'string',
    format: 'binary',
  })
  file: string;
}
