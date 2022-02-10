import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';
import User from './user.model';

const api = supertest(app.app);

describe('User API', () => {
  describe('when retrieving users', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
      await User.create({
        username: 'user1',
        name: 'User One',
      });
      await User.create({
        username: 'user2',
        name: 'User Two',
      });
    });

    test('successfully retrieves all users', async () => {
      const response = await api.get('/api/users').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(2);
    });

    test('successfully a user by id', async () => {
      const response = await api.get('/api/users/2').expect(200);
      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).username).toBe('user2');
    });
  });

  describe('when deleting users', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
      await User.create({
        username: 'user1',
        name: 'User One',
      });

      await User.create({
        username: 'user2',
        name: 'User Two',
      });

      await User.create({
        username: 'user3',
        name: 'User Three',
      });
    });

    test('successfully deletes user', async () => {
      const response = await api.get('/api/users/').expect(200);
      await api
        .delete(`/api/users/${JSON.parse(response.text)[0].id}`)
        .expect(204);
    });

    test('deletion is reflected in length of returned users', async () => {
      let response = await api.get('/api/users/').expect(200);
      await api
        .delete(`/api/users/${JSON.parse(response.text)[0].id}`)
        .expect(204);

      response = await api.get('/api/users').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(2);
    });
  });

  describe('when creating users', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
    });

    test('successfully creates user', async () => {
      const newUser = {
        name: 'New User',
        username: 'newuser',
      };

      const response = await api.post('/api/users').send(newUser).expect(201);

      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).username).toBe('newuser');
      expect(JSON.parse(response.text).name).toBe('New User');
      expect(JSON.parse(response.text).id).toBe(1);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
