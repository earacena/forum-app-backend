import supertest from 'supertest';
import { Request, Response, NextFunction } from 'express';
import app from '../../app';
import 'sequelize';
import Post from './post.model';
import User from '../user/user.model';
import { Post as PostType, PostArray as PostArrayType } from './post.types';

const api = supertest(app.app);

jest.mock('sequelize');
jest.mock('../user/user.model');
jest.mock('./post.model');
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

describe('Post API', () => {
  const mockedPosts = [
    {
      id: 1,
      threadId: 1,
      userId: 1,
      content: 'This is what I wanted to discuss.',
      datePosted: new Date(Date.now()).toDateString(),
    },
    {
      id: 2,
      threadId: 1,
      userId: 2,
      content: 'Very interesting discussion.',
      datePosted: new Date(Date.now()).toDateString(),
    },
    {
      id: 3,
      threadId: 2,
      userId: 2,
      content: 'Following up on our previous discussion...',
      datePosted: new Date(Date.now()).toDateString(),
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
    (Post.findByPk as jest.Mock).mockResolvedValue(mockedPosts[0]);
    (Post.findAll as jest.Mock).mockResolvedValue(mockedPosts);
    (Post.create as jest.Mock).mockResolvedValue({
      id: 4,
      userId: 1,
      threadId: 1,
      content: 'Interesting...',
      datePosted: new Date(Date.now()).toDateString(),
    });
    (Post.update as jest.Mock).mockResolvedValue([
      1,
      [
        {
          id: 1,
          threadId: 1,
          userId: 1,
          content: 'This is a very interesting discussion.',
          datePosted: new Date(Date.now()).toDateString(),
        },
      ],
    ]);
    (Post.destroy as jest.Mock).mockImplementation(() => {});
  });

  describe('when retrieving Posts', () => {
    test('successfully retrieves all posts', async () => {
      const response = await api.get('/api/posts').expect(200);
      const posts = PostArrayType.check(JSON.parse(response.text));
      expect(posts).toHaveLength(3);
    });

    test('successfully a post by id', async () => {
      const response = await api.get('/api/posts/1').expect(200);
      const post = PostType.check(JSON.parse(response.text));
      expect(post).toBeDefined();
      expect(post.content).toBe('This is what I wanted to discuss.');
    });
  });

  describe('when deleting posts', () => {
    test('successfully deletes post', async () => {
      const response = await api.get('/api/posts/').expect(200);
      const posts = PostArrayType.check(JSON.parse(response.text));
      const post = PostType.check(posts[0]);

      await api
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);
    });

    test('deletion is reflected in length of returned posts', async () => {
      let response = await api.get('/api/posts/').expect(200);
      let posts = PostArrayType.check(JSON.parse(response.text));
      const post = PostType.check(posts[0]);

      await api
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', 'bearer token')
        .expect(204);

      (Post.findAll as jest.Mock).mockResolvedValueOnce(mockedPosts.slice(1));

      response = await api.get('/api/posts').expect(200);
      posts = PostArrayType.check(JSON.parse(response.text));
      expect(posts).toHaveLength(2);
    });

    test("returns error when trying to delete other users' post", async () => {
      const response = await api.get('/api/posts/').expect(200);
      const posts = PostArrayType.check(JSON.parse(response.text));
      const post = PostType.check(posts[2]);

      (Post.findByPk as jest.Mock).mockResolvedValueOnce({
        id: 3,
        threadId: 2,
        userId: 2,
        content: 'Following up on our previous discussion...',
        datePosted: 'Thu Feb 17 2022',
      });

      await api
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', 'bearer token')
        .expect(401);
    });
  });

  describe('when creating posts', () => {
    test('successfully creates post', async () => {
      const newPost = {
        threadId: 1,
        content: 'Interesting...',
      };

      const response = await api
        .post('/api/posts')
        .send(newPost)
        .set('Authorization', 'bearer token')
        .expect(201);

      const post = PostType.check(JSON.parse(response.text));
      expect(post).toBeDefined();
      expect(post.content).toBe('Interesting...');
    });
  });

  describe('when updating posts', () => {
    test('successfully updates post by id', async () => {
      const postToUpdate = {
        content: 'This is a very interesting discussion.',
      };
      (Post.findByPk as jest.Mock).mockResolvedValueOnce({
        id: 1,
        threadId: 1,
        userId: 1,
        content: 'This is a very interesting discussion.',
        datePosted: new Date(Date.now()).toDateString(),
      });

      let response = await api
        .put('/api/posts/1')
        .send(postToUpdate)
        .set('Authorization', 'bearer token')
        .expect(200);

      let post = PostType.check(JSON.parse(response.text));
      expect(post.content).toBe('This is a very interesting discussion.');

      (Post.findByPk as jest.Mock).mockResolvedValueOnce({
        id: 1,
        threadId: 1,
        userId: 1,
        content: 'This is a very interesting discussion.',
        datePosted: new Date(Date.now()).toDateString(),
      });

      response = await api.get('/api/posts/1').expect(200);
      post = PostType.check(JSON.parse(response.text));

      expect(JSON.parse(response.text).content).toBe(
        'This is a very interesting discussion.',
      );
    });
  });
});
