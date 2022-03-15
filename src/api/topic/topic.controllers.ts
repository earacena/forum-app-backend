import { NextFunction, Request, Response } from 'express';
import Role from '../role/role.model';
import Thread from '../thread/thread.model';
import { ThreadArray } from '../thread/thread.types';
import Topic from './topic.model';
import {
  Topic as TopicType,
  TopicArray as TopicArrayType,
  RequestIdParam,
  TopicPostRequest,
  decodedToken as decodedTokenType,
} from './topic.types';
import { Role as RoleType } from '../role/role.types';
import { User as UserType } from '../user/user.types';
import User from '../user/user.model';

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

const createTopicController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, decodedToken } = TopicPostRequest.check(req.body);
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    // User must be admin to create topics
    const userRole = RoleType.check(Role.findByPk(user.id));
    if (!userRole || userRole.role !== 'admin') {
      res.status(401).json({ error: 'not authorized to create topics' }).end();
      return;
    }

    const newTopic = await Topic.create({
      userId: user.id,
      title,
      description,
    });

    res.status(201).json(newTopic);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  getTopicsController,
  getTopicByIdController,
  getThreadsOfTopicController,
  createTopicController,
};
