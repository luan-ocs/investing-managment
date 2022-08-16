import { Request, Response } from 'express';
import { CreateUser } from '../../../../useCases/User/CreateUser';
import { SignIn } from '../../../../useCases/User/SignIn';
import { MissingParamError } from '../../../errors/MissingParamError';
import { UserAlreadyCreatedError } from '../../../errors/UserAlreadyCreatedError';
import { badRequest, ok } from '../../../helpers';
import { conflict } from '../../../helpers/conflict';
import { CreateUserProps } from '../../User/CreateUser';

export class SignUpController {
  constructor(private createUser: CreateUser, private signIn: SignIn) {}

  async handle(req: Request<unknown, unknown, CreateUserProps>, res: Response) {
    const { email, name, password } = req.body;

    if (!email) {
      return res.status(400).json(badRequest(new MissingParamError('email')));
    }

    if (!name) {
      return res.status(400).json(badRequest(new MissingParamError('name')));
    }

    if (!password) {
      return res
        .status(400)
        .json(badRequest(new MissingParamError('password')));
    }

    try {
      await this.createUser.execute({ name, email, password });
      const token = await this.signIn.execute({ email, password });
      return res.status(200).json(ok({ token }));
    } catch (error) {
      return res.status(409).json(conflict(new UserAlreadyCreatedError()));
    }
  }
}
