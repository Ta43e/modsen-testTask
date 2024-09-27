import { IsString, IsOptional, IsArray, IsNotEmpty, IsUrl, IsMongoId } from '@nestjs/class-validator';
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
    default: ['test1, teest2'],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
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
    default: 'https://sun23-1.userapi.com/s/v1/ig2/VwkVNBMJZxsT7R6aMbOEiVNkIPik2WNweY1NTZV2GjuLGmc_mFqi0ckKlUR5zeD_4kNLYOc2viCmMA3evq5X0pFz.jpg?quality=96&crop=349,97,1168,1168&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&ava=1&cs=50x50',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  imgUrl?: string;
}
