import { JwtPayload } from '#auth/interfaces/jwt-payload.interface.js';
import { Request } from 'express';

export interface AuthRequest extends Request {
  cookies: Record<string, string>;
  user?: JwtPayload;
}
