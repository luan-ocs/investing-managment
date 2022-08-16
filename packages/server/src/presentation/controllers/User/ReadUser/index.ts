import { Request, Response } from 'express';
import { ReadUser } from '../../../../useCases/User/ReadUser';
import { NotFoundError } from '../../../errors';
import { MissingParamError } from '../../../errors/MissingParamError';
import { badRequest, notFound, ok } from '../../../helpers';

type readUserProps = {
  id: string;
};

export class ReadUserController {
  constructor(private readUser: ReadUser) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params as readUserProps;

    if (!id) {
      return res.status(400).json(badRequest(new MissingParamError('id')));
    }

    try {
      const user = await this.readUser.execute({ id });
      return res
        .status(200)
        .json(ok({ name: user?.name, id: user?.id, email: user?.email }));
    } catch (error) {
      return res.status(404).json(notFound(new NotFoundError('user')));
    }
  }
}
