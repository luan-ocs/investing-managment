import { Request } from 'express';
import { DeleteUser } from '../../../../useCases/User/DeleteUser';

export class DeleteUserController {
  constructor(private useCase: DeleteUser) {}

  handle(req: Request, res: Response) {
    return 0;
  }
}
