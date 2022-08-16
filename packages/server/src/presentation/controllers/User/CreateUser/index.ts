import { Request, Response } from 'express';
import { CreateUser } from '../../../../useCases/User/CreateUser';
import { MissingParamError } from '../../../errors/MissingParamError';
import { UserAlreadyCreatedError } from '../../../errors/UserAlreadyCreatedError';
import { badRequest, ok } from '../../../helpers';
import { conflict } from '../../../helpers/conflict';

export type CreateUserProps = {
  name: string;
  email: string;
  password: string;
  admin: boolean;
};

export class CreateUserController {
  constructor(private createUser: CreateUser) {}

  async handle(req: Request<unknown, unknown, CreateUserProps>, res: Response) {
    const { email, name, password, admin } = req.body;

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
      const id = await this.createUser.execute({
        name,
        email,
        password,
        admin,
      });
      return res.status(200).json(ok({ userId: id }));
    } catch (error) {
      return res.status(409).json(conflict(new UserAlreadyCreatedError()));
    }
  }
}
