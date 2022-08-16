import { User } from '../../../../entities/User';
import jwt from 'jwt-simple';

export type TokenPayload = {
  name: string;
  email: string;
  id: string;
  iat: number;
  exp: number;
  token: string;
};

export class TokenGenerator {
  constructor(private user: User) {}

  generate() {
    const secret = process.env.secret || '123abc';
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      name: this.user.name,
      email: this.user.email,
      id: this.user.id,
      iat: now,
      exp: now + 60 * 60 * 24 * 3,
    };
    const token = jwt.encode(payload, secret);

    return { ...payload, token };
  }
}
