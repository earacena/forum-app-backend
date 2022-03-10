import { NextFunction, Request, Response } from 'express';
import Thread from '../thread/thread.model';
import { ThreadArray } from '../thread/thread.types';
import Topic from './topic.model';
import {
  Topic as TopicType,
  TopicArray as TopicArrayType,
  RequestIdParam,
} from './topic.types';

const getTopicsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const topics = TopicArrayType.check(await Topic.findAll());
    res.json(topics);
  } catch (error: unknown) {
    next(error);
  }
};

const getTopicByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const topic = TopicType.check(await Topic.findByPk(id));
    res.status(200).json(topic);
  } catch (error: unknown) {
    next(error);
  }
};

const getThreadsOfTopicController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });
    const threads = ThreadArray.check(
      await Thread.findAll({ raw: true, where: { topicId: id }, order: [['id', 'ASC']] }),
    );
    res.status(200).json(threads);
  } catch (error) {
    next(error);
  }
};

export default {
  getTopicsController,
  getTopicByIdController,
  getThreadsOfTopicController,
};
