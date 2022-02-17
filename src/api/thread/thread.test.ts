import { NextFunction, Request, Response } from 'express';
import supertest from 'supertest';
import app from '../../app';
import 'sequelize';
import Thread from './thread.model';
import User from '../user/user.model';
import {
  Thread as ThreadType,
  ThreadArray as ThreadArrayType,
} from './thread.types';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('../user/user.model');
jest.mock('./thread.model');
jest.mock(
  '../../middleware/authenticate',
  () => (req: Request, _res: Response, next: NextFunction) => {
    req.body.decodedToken = {
      id: 1,
      username: 'mockuser1',
    };

    next();
  },
);

describe('Thread API', () => {
  const mockedThreads = [
    {
      id: 1,
      userId: 1,
      title: 'Mocked discussion topic #1',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      userId: 1,
      title: 'Mocked discussion topic #2',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      userId: 2,
      title: 'Mocked discussion topic #3',
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
    (Thread.findByPk as jest.Mock).mockResolvedValue(mockedThreads[0]);
    (Thread.findAll as jest.Mock).mockResolvedValue(mockedThreads);
    (Thread.create as jest.Mock).mockResolvedValue({
      id: 4,
      userId: 3,
      title: 'Mocked discussion topic #4',
      dateCreated: new Date(Date.now()).toDateString(),
    });
    (Thread.destroy as jest.Mock).mockImplementation(() => {});
  });

  describe('when retrieving threads', () => {
    test('successfully retrieves all threads', async () => {
      const response = await api.get('/api/threads').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      expect(threads).toHaveLength(3);
    });

    test('successfully a thread by id', async () => {
      const response = await api.get('/api/threads/1').expect(200);
      const thread = ThreadType.check(JSON.parse(response.text));
      expect(thread).toBeDefined();
      expect(thread.title).toBe('Mocked discussion topic #1');
    });
  });

  describe('when deleting threads', () => {
    test('successfully deletes thread', async () => {
      const response = await api.get('/api/threads/').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);

      await api
        .delete(`/api/threads/${thread.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);
    });

    test('deletion is reflected in length of returned threads', async () => {
      let response = await api.get('/api/threads/').expect(200);
      let threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);

      await api
        .delete(`/api/threads/${thread.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);

      (Thread.findAll as jest.Mock).mockResolvedValueOnce(
        mockedThreads.slice(1),
      );

      response = await api.get('/api/threads').expect(200);
      threads = ThreadArrayType.check(JSON.parse(response.text));
      expect(JSON.parse(response.text)).toHaveLength(2);
    });
  });

  describe('when creating threads', () => {
    test('successfully creates thread', async () => {
      const newThread = {
        userId: 3,
        title: 'Mocked discussion thread #4',
      };

      const response = await api
        .post('/api/threads')
        .send(newThread)
        .set('Authorization', 'bearer token')
        .expect(201);

      const thread = ThreadType.check(JSON.parse(response.text));
      expect(thread).toBeDefined();
      expect(thread.title).toBe('Mocked discussion topic #4');
      expect(thread.userId).toBe(3);
    });
  });
});
