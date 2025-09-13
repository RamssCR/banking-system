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

export { MAX_AGE_ONE_DAY, MAX_AGE_SEVEN_DAYS, REFRESH_TOKEN_SALT_ROUNDS };
