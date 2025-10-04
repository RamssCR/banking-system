import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
} from 'class-validator';

abstract class BaseTransactionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;
}

export class SingleAccountOperationDto extends BaseTransactionDto {
  @IsNumberString()
  @IsNotEmpty()
  accountNumber: string;
}

export class TransferenceDto extends BaseTransactionDto {
  @IsNumberString()
  @IsNotEmpty()
  sourceAccountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  destinationAccountNumber: string;
}
