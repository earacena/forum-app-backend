import supertest from 'supertest';
import app from '../../app';
import { sequelize } from '../../utils/db';
import Thread from './thread.model';

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

  describe('when deleting threads', () => {
    beforeEach(async () => {
      await Thread.sync({ force: true });
      await Thread.create({
        userId: 1,
        title: 'Dicussion topic #1',
      });
      await Thread.create({
        userId: 2,
        title: 'Discussion topic #2',
      });
      await Thread.create({
        userId: 3,
        title: 'Discussion topic #3',
      });
    });

    test('successfully deletes thread', async () => {
      const response = await api.get('/api/threads/').expect(200);
      await api
        .delete(`/api/threads/${JSON.parse(response.text)[0].id}`)
        .expect(204);
    });

    test('deletion is reflected in length of returned threads', async () => {
      let response = await api.get('/api/threads/').expect(200);
      await api
        .delete(`/api/threads/${JSON.parse(response.text)[0].id}`)
        .expect(204);

      response = await api.get('/api/threads').expect(200);
      expect(JSON.parse(response.text)).toHaveLength(2);
    });
  });

  describe('when creating threads', () => {
    beforeEach(async () => {
      await Thread.sync({ force: true });
    });

    test('successfully creates thread', async () => {
      const newThread = {
        userId: 1,
        title: 'Interesting topic to discuss',
      };

      const response = await api
        .post('/api/threads')
        .send(newThread)
        .expect(201);

      expect(JSON.parse(response.text)).toBeDefined();
      expect(JSON.parse(response.text).title).toBe('Interesting topic to discuss');
      expect(JSON.parse(response.text).userId).toBe(1);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
