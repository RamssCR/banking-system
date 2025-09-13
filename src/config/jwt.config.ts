import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessToken: process.env.JWT_SECRET,
  refreshToken: process.env.JWT_REFRESH_SECRET,
}));
