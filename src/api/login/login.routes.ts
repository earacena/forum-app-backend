import { Router } from 'express';
import loginControllers from './login.controllers';

const { loginController } = loginControllers;

const loginRouter = Router();

loginRouter.post('/', loginController);

export default loginRouter;
