import { IsNumberString, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;
}

export class TransactionPaginationDto extends PartialType(PaginationDto) {
  @Type(() => String)
  @IsNumberString()
  accountNumber: string;
}
