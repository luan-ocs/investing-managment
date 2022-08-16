import { Request, Response } from 'express';
import { UpdateUser } from '../../../../useCases/User/UpdateUser';
import { NotFoundError } from '../../../errors';
import { MissingParamError } from '../../../errors/MissingParamError';
import { badRequest, notFound, ok } from '../../../helpers';

type readUserProps = {
  id: string;
};

export class UpdateUserController {
  constructor(private updateUser: UpdateUser) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params as readUserProps;
    const body = req.body;

    if (!id) {
      return res.status(400).json(badRequest(new MissingParamError('id')));
    }

    try {
      const user = await this.updateUser.execute(id, body);
      return res.status(200).json(ok(user));
    } catch (error) {
      return res.status(404).json(notFound(new NotFoundError('user')));
    }
  }
}
