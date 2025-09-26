import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

abstract class BaseTransactionDto {
  @IsNumber()
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
