import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsUUID, Validate } from 'class-validator';
import { StartLessThanEndValidator } from '@app/common/validators/start-less-than-end.validator';

export class CreateReadingIntervalDto {
  @ApiProperty({
    description: 'The starting page number of the reading interval',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  @Validate(StartLessThanEndValidator)
  startPage: number;

  @ApiProperty({
    description: 'The ending page number of the reading interval',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsPositive()
  endPage: number;

  @ApiProperty({
    description:
      'The unique identifier for the book associated with the reading interval',
    type: String,
    format: 'uuid',
    example: 'cfc3a899-3f5d-4c7b-a788-e1d87f029a3f',
  })
  @IsNotEmpty()
  @IsUUID()
  bookId: string;
}
