import express from 'express';
import { knexuserDTO } from '../infra/database/DTO/knexUserDTO';
import { SignInController } from '../presentation/controllers/Auth/SignIn';
import { SignUpController } from '../presentation/controllers/Auth/SignUp';
import { userRepository } from '../repositories/implementations/sql/userRepository';
import { CreateUser } from '../useCases/User/CreateUser';
import { SignIn } from '../useCases/User/SignIn';

const authRouter = express.Router();

const repository = new userRepository(new knexuserDTO());
const signUpController = new SignUpController(
  new CreateUser(repository),
  new SignIn(repository),
);

authRouter.post('/signUp', (req, res) => signUpController.handle(req, res));

const signInController = new SignInController(new SignIn(repository));
authRouter.post('/signIn', (req, res) => signInController.handle(req, res));

export { authRouter };
