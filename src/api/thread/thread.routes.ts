
import express, { Request, Response} from 'express';

const threadsRouter = express.Router();

threadsRouter.get('/', async (_req: Request, res: Response) => {
  res.send('Getting all threads...');
});

export default threadsRouter;