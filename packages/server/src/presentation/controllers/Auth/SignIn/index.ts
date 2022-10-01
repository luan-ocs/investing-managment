import { Request, Response } from 'express';
import { SignIn } from '../../../../useCases/User/SignIn';
import { UnauthorizedError } from '../../../errors';
import { MissingParamError } from '../../../errors/MissingParamError';
import { badRequest, ok } from '../../../helpers';
import { unauthorized } from '../../../helpers/unauthorized';

type SignInRequestProps = {
  email: string;
  password: string;
};

export class SignInController {
  constructor(private signIn: SignIn) {}

  async handle(
    req: Request<unknown, unknown, SignInRequestProps>,
    res: Response,
  ) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json(badRequest(new MissingParamError('email')));
    }

    if (!password) {
      return res
        .status(400)
        .json(badRequest(new MissingParamError('password')));
    }

    try {
      const token = await this.signIn.execute({ email, password });
      return res.status(200).json(ok({ ...token }));
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json(unauthorized(new UnauthorizedError(error)));
      } else res.status(500).json({ message: 'unknow error' });
    }
  }
}
