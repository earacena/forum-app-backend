import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';

const api = supertest(app.app);

describe('User API', () => {
  describe('when retrieving users', () => {
    test('successfully retrieves all users', async () => {
      const response = await api.get('/api/users').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(1);
    });

    test('successfully a user by id', async () => {
      const response = await api.get('/api/users/1').expect(200);
      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).username).toBe('testuser');
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
