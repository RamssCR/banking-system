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

export class TranferenceDto extends BaseTransactionDto {
  @IsNumberString()
  @IsNotEmpty()
  originAccountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  destinationAccountNumber: string;
}
