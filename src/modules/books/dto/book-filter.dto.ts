import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common/dto/pagination.dto';

export class BookFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter books by name',
    type: String,
    required: false,
    example: 'The Great Gatsby',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter books by number of pages',
    type: Number,
    required: false,
    example: 180,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  numberOfPages?: number;
}
