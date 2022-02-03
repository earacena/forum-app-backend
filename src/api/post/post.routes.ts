
import express, { Request, Response} from 'express';

const postsRouter = express.Router();

postsRouter.get('/', async (_req: Request, res: Response) => {
  res.send('Getting all posts...');
});

export default postsRouter;