import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The name of the book',
    type: String,
    example: 'The Great Gatsby',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The number of pages in the book',
    type: Number,
    example: 180,
  })
  @IsNotEmpty()
  @IsPositive()
  numberOfPages: number;
}
