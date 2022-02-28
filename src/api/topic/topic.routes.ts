import express from 'express';
import topicControllers from './topic.controllers';

const {
  getTopicsController,
  getTopicByIdController,
} = topicControllers;

const topicsRouter = express.Router();

topicsRouter.get('/', getTopicsController);
topicsRouter.get('/:id', getTopicByIdController);

export default topicsRouter;
