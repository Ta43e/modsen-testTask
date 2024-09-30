
import { IsString, IsOptional, IsArray, IsNotEmpty, IsUrl, IsMongoId } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty({
    example: 'My Note Topic',
    description: 'Topic of the note',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    example: 'This is a description of the note.',
    description: 'Description of the note',
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
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];  

  @ApiProperty({
    example: 'Беларусь',
    description: 'Location information',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;
}
