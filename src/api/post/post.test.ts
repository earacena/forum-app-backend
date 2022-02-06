import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';

const api = supertest(app.app);

describe('Forum API', () => {
  describe('when retrieving Posts', () => {
    test('successfully retrieves all posts', async () => {
      const response = await api.get('/api/posts').expect(200);
      const posts = JSON.parse(response.text);
      expect(posts).toHaveLength(1);
    });

    test('successfully a post by id', async () => {
      const response = await api.get('/api/posts/1').expect(200);
      const post = JSON.parse(response.text);
      expect(post).toBeDefined();
      expect(post.content).toBe('This is my first post in this thread');
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
