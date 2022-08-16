import { Router } from 'express';
import { knexuserDTO } from '../infra/database/DTO/knexUserDTO';
import { CreateUserController } from '../presentation/controllers/User/CreateUser';
import { ReadUserController } from '../presentation/controllers/User/ReadUser';
import { Passport } from '../presentation/middlewares/auth';
import { userRepository } from '../repositories/implementations/sql/userRepository';
import { CreateUser } from '../useCases/User/CreateUser';
import { ReadUser } from '../useCases/User/ReadUser';

const userRoutes = Router();

const userRepo = new userRepository(new knexuserDTO());
const passport = new Passport(userRepo, process.env.secret || '123abc');
const createUserUseCase = new CreateUser(userRepo);
const createUserController = new CreateUserController(createUserUseCase);

userRoutes.all('/user', passport.handle());
userRoutes.post('/user', (req, res) => createUserController.handle(req, res));

const readUser = new ReadUser(userRepo);
const readUserControl = new ReadUserController(readUser);

userRoutes.get('/user/:id', (req, res) => readUserControl.handle(req, res));

export { userRoutes };
