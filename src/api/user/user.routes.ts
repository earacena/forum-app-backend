import express, { Request, Response} from 'express';

const usersRouter = express.Router();

usersRouter.get('/', async (_req: Request, res: Response) => {
  res.send('Getting all users...');
});

export default usersRouter;