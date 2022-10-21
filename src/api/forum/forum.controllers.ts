import { NextFunction, Request, Response } from 'express';
import { decodedToken as decodedTokenType, RequestIdParam } from '../../common.types';
import User from '../user/user.model';
import Role from '../role/role.model';
import { User as UserType } from '../user/user.types';
import Forum from './forum.model';
import { Forum as ForumType, ForumPostRequest } from './forum.types';
import Topic from '../topic/topic.model';
import { TopicArray } from '../topic/topic.types';

const createForumController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { forumTitle, forumTopics, decodedToken } = ForumPostRequest.check(req.body);
    const token = decodedTokenType.check(decodedToken);
    const user = UserType.check(await User.findByPk(token.id));

    // Create the forum
    const newForum = ForumType.check(
      await Forum.create({
        title: forumTitle,
        userId: user.id,
      }),
    );

    // Record user with 'admin' role for the given forum
    await Role.create({
      userId: user.id,
      forumId: newForum.id,
      role: 'admin',
    });

    // Add topics to the forum asynchronously
    const topicPromises = forumTopics.map(async (t) => (
      Topic.create({
        userId: user.id,
        title: t.title,
        description: t.description,
      })
    ));
    await Promise.all(topicPromises);

    res.status(201).json(newForum);
  } catch (error: unknown) {
    next(error);
  }
};

const getTopicsOfForumController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = RequestIdParam.check({ id: req.params['id'] });

    // Fetch topics with givin forum id
    const topics = TopicArray.check(await Topic.findAll({ where: { forumId: id } }));
    res.status(200).json(topics);
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  createForumController,
  getTopicsOfForumController,
};
