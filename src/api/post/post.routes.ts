
import express from 'express';
import { getPostsController } from './post.controller';

const postsRouter = express.Router();

postsRouter.get('/', getPostsController);

export default postsRouter;