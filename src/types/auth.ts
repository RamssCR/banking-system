import { JwtPayload } from '#auth/interfaces/jwt-payload.interface';
import { Request } from 'express';

export interface AuthRequest extends Request {
  cookies: Record<string, string>;
  user?: JwtPayload;
}
