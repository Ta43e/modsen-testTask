import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SerchNoteDto {

    @ApiProperty({default: '', required: false})
    @IsString()
    @IsOptional()
    @MaxLength(50)
    readonly searchQuery: string;

    @ApiProperty({default: '', required: false})
    @IsString()
    @IsOptional()
    @MaxLength(50)
    readonly filter: string;
    
    @ApiProperty({default: 'asc', required: false})
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    readonly sortOrder: 'asc' | 'desc';

    @ApiProperty({default: 0})
    @IsNotEmpty()
    @Min(0)
    readonly offset: number = 0;

    @ApiProperty({default: 2})
    @IsNotEmpty()
    @Min(1)
    readonly limit: number = 100;
}