import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 })
  @IsNotEmpty()
  balance: number;
}
