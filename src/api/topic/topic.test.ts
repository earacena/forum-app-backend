import { Request, Response, NextFunction } from 'express';
import supertest from 'supertest';
import app from '../../app';
import Topic from './topic.model';
import 'sequelize';
import {
  Topic as TopicType,
  TopicArray as TopicArrayType,
} from './topic.types';
import Thread from '../thread/thread.model';
import Role from '../role/role.model';
import { ThreadArray as ThreadArrayType } from '../thread/thread.types';
import User from '../user/user.model';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('./topic.model');
jest.mock('../role/role.model');
jest.mock('../user/user.model');
jest.mock('../thread/thread.model');
jest.mock(
  '../../middleware/authenticate',
  () => (req: Request, _res: Response, next: NextFunction) => {
    req.body.decodedToken = {
      id: 1,
      username: 'mockuser1',
      role: 'admin',
    };

    next();
  },
);

describe('Topic API', () => {
  const mockedTopics = [
    {
      id: 1,
      userId: 1,
      title: 'Cars',
      description: 'Anything and everything about cars.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      userId: 2,
      title: 'Food',
      description: 'Share your favorite food recipes.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      userId: 3,
      title: 'Music',
      description: 'Discussions about music.',
      dateCreated: new Date(Date.now()).toDateString(),
    },
  ];

  beforeAll(() => {
    (User.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Mock User 1',
      username: 'mockuser1',
      passwordHash: 'password_hash',
      dateRegistered: new Date(Date.now()).toDateString(),
    });
    (Topic.findAll as jest.Mock).mockResolvedValue(mockedTopics);
    (Topic.findByPk as jest.Mock).mockResolvedValue(mockedTopics[1]);
    (Topic.create as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      title: 'Cars',
      description: 'Discussions about cars.',
      dateCreated: new Date(Date.now()).toDateString(),
    });
  });

  describe('when retrieving topics', () => {
    test('successfully retrieves all topics', async () => {
      const response = await api.get('/api/topics').expect(200);
      const topics = TopicArrayType.check(JSON.parse(response.text));
      expect(topics).toHaveLength(3);
    });

    test('retrieves a topic by id', async () => {
      const response = await api.get('/api/topics/2').expect(200);
      const topic = TopicType.check(JSON.parse(response.text));
      expect(topic).toBeDefined();
    });

    test('returns status 400 when retrieving topic with unallocated id', async () => {
      (Topic.findByPk as jest.Mock).mockResolvedValueOnce(null);
      await api.get('/api/topics/20').expect(400);
    });

    test('successfully gets all threads with same topic id', async () => {
      (Thread.findAll as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          userId: 1,
          topicId: 1,
          title: 'Mock thread # 1',
          dateCreated: new Date(Date.now()).toDateString(),
        },
        {
          id: 3,
          userId: 4,
          topicId: 1,
          title: 'Mock thread # 2',
          dateCreated: new Date(Date.now()).toDateString(),
        },
      ]);

      const response = await api.get('/api/topics/1/threads').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      expect(threads).toBeDefined();
      expect(threads.every((thread) => thread.topicId === 1)).toEqual(true);
    });
  });

  describe('when creating topics', () => {
    test('successfully creates new topic', async () => {
      (Role.findByPk as jest.Mock).mockResolvedValueOnce({
        userId: 1,
        role: 'admin',
      });
      const newTopic = {
        title: 'Cars',
        description: 'Discussions about cars.',
      };

      const response = await api
        .post('/api/topics')
        .send(newTopic)
        .set('Authorization', 'bearer token')
        .expect(201);

      const topic = TopicType.check(JSON.parse(response.text));
      expect(topic).toBeDefined();
      expect(topic.title).toBe('Cars');
      expect(topic.description).toBe('Discussions about cars.');
    });
  });
});
