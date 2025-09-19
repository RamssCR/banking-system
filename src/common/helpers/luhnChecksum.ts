import { ACCOUNT_NUMBER_BASE_VALUE, ACCOUNT_NUMBER_PREFIX } from './constants';

/**
 * Calculates the Luhn checksum digit for a given numeric string.
 * The input string should not include the checksum digit itself.
 * @param base - The numeric string to calculate the checksum for.
 * @returns The Luhn checksum digit.
 * @throws Will throw an error if the input string contains non-digit characters.
 * @example
 * const checksum = luhnChecksum("7992739871"); // returns 3
 */
export const luhnChecksum = (base: string): number => {
  let sum = 0;
  let shouldDouble = true;

  for (let i = base.length - 1; i > 0; i--) {
    let digit = parseInt(base[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checksum = (10 - (sum % 10)) % 10;
  return checksum;
};

/**
 * Generates a valid account number using the defined prefix and base value.
 * @returns A valid account number.
 * @example
 * const accountNumber = generateAccountNumber(); // returns something like "01012345673"
 */
export const generateAccountNumber = (): string => {
  const sequence = Math.floor(Math.random() * ACCOUNT_NUMBER_BASE_VALUE);
  const base = `${ACCOUNT_NUMBER_PREFIX}${sequence}`;
  const checksum = luhnChecksum(base);
  return `${base}${checksum}`;
};
