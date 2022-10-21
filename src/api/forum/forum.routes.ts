import express from 'express';
import forumControllers from './forum.controllers';
import auth from '../../middleware/authenticate';

const {
  getAllForumsController,
  getTopicsOfForumController,
  createForumController,
} = forumControllers;

const forumRouter = express.Router();

forumRouter.get('/', getAllForumsController);
forumRouter.get('/:id/topics', getTopicsOfForumController);
forumRouter.post('/', auth, createForumController);

export default forumRouter;
