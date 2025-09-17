/**
 * Maximum age constants for caching durations of one day.
 */
const MAX_AGE_ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * Maximum age constants for caching durations of seven days.
 */
const MAX_AGE_SEVEN_DAYS = MAX_AGE_ONE_DAY * 7;

/**
 * Number of salt rounds for hashing refresh tokens.
 */
const REFRESH_TOKEN_SALT_ROUNDS = 12;

/**
 * Prefix for account numbers.
 * This is used to identify account numbers in the system.
 */
const ACCOUNT_NUMBER_PREFIX = '01';

/**
 * Base value for generating account numbers.
 * This is used as a starting point for account number generation.
 */
const ACCOUNT_NUMBER_BASE_VALUE = 10000000;

export {
  MAX_AGE_ONE_DAY,
  MAX_AGE_SEVEN_DAYS,
  REFRESH_TOKEN_SALT_ROUNDS,
  ACCOUNT_NUMBER_PREFIX,
  ACCOUNT_NUMBER_BASE_VALUE,
};
