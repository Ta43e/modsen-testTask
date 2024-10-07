import { IsNotEmpty, IsString, Validate } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsUniqueLogin } from '../validator/IsUniqueLogin';

export class CreateUserDto {
  @ApiProperty({
    example: 'Oleg',
    description: 'Unique login of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Validate(IsUniqueLogin)
  login: string;

  @ApiProperty({
    default: '123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
