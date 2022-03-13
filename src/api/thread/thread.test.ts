import { NextFunction, Request, Response } from 'express';
import supertest from 'supertest';
import app from '../../app';
import 'sequelize';
import Thread from './thread.model';
import Post from '../post/post.model';
import User from '../user/user.model';
import {
  Thread as ThreadType,
  ThreadArray as ThreadArrayType,
} from './thread.types';
import { PostArray as PostArrayType } from '../post/post.types';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('../user/user.model');
jest.mock('./thread.model');
jest.mock('../post/post.model');
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
      topicId: 1,
      title: 'Mocked discussion topic #1',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      userId: 1,
      topicId: 1,
      title: 'Mocked discussion topic #2',
      dateCreated: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      userId: 2,
      topicId: 1,
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
      topicId: 1,
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

    test('successfully a retrieves thread by id', async () => {
      const response = await api.get('/api/threads/1').expect(200);
      const thread = ThreadType.check(JSON.parse(response.text));
      expect(thread).toBeDefined();
      expect(thread.title).toBe('Mocked discussion topic #1');
    });

    test('returns status 400 when retrieving thread with unallocated id', async () => {
      (Thread.findByPk as jest.Mock).mockResolvedValueOnce(null);
      await api.get('/api/threads/20').expect(400);
    });

    test('successfully get all posts with same thread id', async () => {
      (Post.findAll as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          threadId: 1,
          userId: 1,
          isOriginalPost: true,
          authorName: 'mockuser1',
          content: 'This is what I wanted to discuss.',
          datePosted: new Date(Date.now()).toDateString(),
        },
        {
          id: 2,
          threadId: 1,
          userId: 2,
          isOriginalPost: false,
          authorName: 'mockuser2',
          content: 'That is very interesting',
          datePosted: new Date(Date.now()).toDateString(),
        },
      ]);

      const response = await api.get('/api/threads/1/posts').expect(200);

      const posts = PostArrayType.check(JSON.parse(response.text));
      expect(posts).toBeDefined();
      expect(posts.every((post) => post.threadId === 1)).toEqual(
        true,
      );
      expect(posts).toBe(posts.sort((a, b) => a.id - b.id));
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

    test('returns same response even if deleting same thread twice', async () => {
      const response = await api.get('/api/threads/').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);

      await api
        .delete(`/api/threads/${thread.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);
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

    test('all associated posts are also deleted', async () => {
      (Post.findAll as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          threadId: 1,
          userId: 1,
          isOriginalPost: true,
          authorName: 'mockuser1',
          content: 'This is what I wanted to discuss.',
          datePosted: new Date(Date.now()).toDateString(),
        },
        {
          id: 2,
          threadId: 1,
          userId: 2,
          isOriginalPost: false,
          authorName: 'mockuser2',
          content: 'That is very interesting',
          datePosted: new Date(Date.now()).toDateString(),
        },
        {
          id: 3,
          threadId: 1,
          userId: 3,
          isOriginalPost: false,
          authorName: 'mockuser2',
          content: 'That is super interesting',
          datePosted: new Date(Date.now()).toDateString(),
        },
      ]);

      let response = await api.get('/api/threads/').expect(200);
      const threads = ThreadArrayType.check(JSON.parse(response.text));
      const thread = ThreadType.check(threads[0]);

      response = await api.get(`/api/threads/${thread.id}/posts`);
      let posts = PostArrayType.check(JSON.parse(response.text));
      expect(posts).toHaveLength(3);

      await api
        .delete(`/api/threads/${thread.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);

      (Post.findAll as jest.Mock).mockResolvedValueOnce([]);
      response = await api.get(`/api/threads/${thread.id}/posts`).expect(200);
      posts = PostArrayType.check(JSON.parse(response.text));
      expect(posts).toHaveLength(0);
    });
  });

  describe('when creating threads', () => {
    test('successfully creates thread', async () => {
      const newThread = {
        topicId: 1,
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
