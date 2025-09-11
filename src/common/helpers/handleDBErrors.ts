import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Function that handles errors when managing database operations.
 * @param error - The error caused during database manipulation.
 * @param message - An error message if the error is unexpected or unknown.
 */
export const handleDBError = (error: unknown, message: string) => {
  if (error instanceof QueryFailedError) {
    return new BadRequestException(error.message);
  }

  if (error instanceof EntityNotFoundError) {
    return new NotFoundException(error.message);
  }

  if (error instanceof Error) {
    return new BadRequestException(error.message);
  }

  return new InternalServerErrorException(message);
};
