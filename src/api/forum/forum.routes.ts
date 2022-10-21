import express from 'express';
import forumControllers from './forum.controllers';
import auth from '../../middleware/authenticate';

const {
  createForumController,
  getTopicsOfForumController,
} = forumControllers;

const forumRouter = express.Router();

forumRouter.get('/:id/topics', getTopicsOfForumController);
forumRouter.post('/', auth, createForumController);

export default forumRouter;
