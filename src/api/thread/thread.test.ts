import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';

const api = supertest(app.app);

describe('Thread API', () => {
  describe('when retrieving threads', () => {
    test('successfully retrieves all threads', async () => {
      const response = await api.get('/api/threads').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(1);
    });

    test('successfully a thread by id', async () => {
      const response = await api.get('/api/threads/1').expect(200);
      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).title).toBe('This is my first thread!');
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
