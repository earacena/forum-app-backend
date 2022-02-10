import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';
import Post from './post.model';

const api = supertest(app.app);

describe('Post API', () => {
  describe('when retrieving Posts', () => {
    beforeEach(async () => {
      await Post.sync({ force: true });
      await Post.create({
        threadId: 1,
        userId: 1,
        content: 'This is what I wanted to discuss.',
      });
      await Post.create({
        threadId: 1,
        userId: 2,
        content: 'Very interesting discussion.',
      });
      await Post.create({
        threadId: 2,
        userId: 2,
        content: 'Following up on our previous discussion...',
      });
    });

    test('successfully retrieves all posts', async () => {
      const response = await api.get('/api/posts').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(3);
    });

    test('successfully a post by id', async () => {
      const response = await api.get('/api/posts/2').expect(200);
      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).content).toBe(
        'Very interesting discussion.',
      );
    });
  });

  describe('when deleting posts', () => {
    beforeEach(async () => {
      await Post.sync({ force: true });
      await Post.create({
        threadId: 1,
        userId: 1,
        content: 'This is what I wanted to discuss.',
      });
      await Post.create({
        threadId: 1,
        userId: 2,
        content: 'Very interesting discussion.',
      });
      await Post.create({
        threadId: 2,
        userId: 2,
        content: 'Following up on our previous discussion...',
      });
    });

    test('successfully deletes post', async () => {
      const response = await api.get('/api/posts/').expect(200);
      await api
        .delete(`/api/posts/${JSON.parse(response.text)[0].id}`)
        .expect(204);
    });

    test('deletion is reflected in length of returned posts', async () => {
      let response = await api.get('/api/posts/').expect(200);
      await api
        .delete(`/api/posts/${JSON.parse(response.text)[0].id}`)
        .expect(204);

      response = await api.get('/api/posts').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(2);
    });
  });

  describe('when creating posts', () => {
    beforeEach(async () => {
      await Post.sync({ force: true });
    });

    test('successfully creates post', async () => {
      const newPost = {
        threadId: 1,
        userId: 1,
        content: 'Interesting...',
      };

      const response = await api.post('/api/posts').send(newPost).expect(201);

      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).content).toBe('Interesting...');
    });
  });

  describe('when updating posts', () => {
    beforeEach(async () => {
      await Post.sync({ force: true });
      await Post.create({
        threadId: 1,
        userId: 1,
        content: 'This is what I wanted to discuss.',
      });
      await Post.create({
        threadId: 1,
        userId: 2,
        content: 'Very interesting discussion.',
      });
      await Post.create({
        threadId: 2,
        userId: 2,
        content: 'Following up on our previous discussion...',
      });
    });

    test('successfully updates post by id', async () => {
      const postToUpdate = {
        content: 'This is a very interesting discussion.',
      };

      let response = await api
        .put('/api/posts/2')
        .send(postToUpdate)
        .expect(200);

      expect(JSON.parse(response.text).content).toBe(
        'This is a very interesting discussion.',
      );

      response = await api.get('/api/posts/2').expect(200);

      expect(JSON.parse(response.text).content).toBe(
        'This is a very interesting discussion.',
      );
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
