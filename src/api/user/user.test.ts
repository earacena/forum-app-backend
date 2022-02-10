import supertest from 'supertest';
import bcrypt from 'bcrypt';
import { String as RtString } from 'runtypes';
import app from '../../app';
import { sequelize } from '../../utils/db';
import User from './user.model';
import { User as UserType, UserArray as UserArrayType } from './user.types';

const api = supertest(app.app);

describe('User API', () => {
  describe('when retrieving users', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
      await User.create({
        username: 'user1',
        name: 'User One',
        passwordHash: RtString.check(await bcrypt.hash('password1', 10)),
      });

      await User.create({
        username: 'user2',
        name: 'User Two',
        passwordHash: RtString.check(await bcrypt.hash('password2', 10)),
      });
    });

    test('successfully retrieves all users', async () => {
      const response = await api.get('/api/users').expect(200);
      const users = UserArrayType.check(JSON.parse(response.text));
      expect(users).toHaveLength(2);
    });

    test('successfully a user by id', async () => {
      const response = await api.get('/api/users/2').expect(200);
      const user = UserType.check(JSON.parse(response.text));
      expect(user).toBeDefined();
      expect(user.username).toBe('user2');
    });
  });

  describe('when deleting users', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
      await User.create({
        username: 'user1',
        name: 'User One',
        passwordHash: RtString.check(await bcrypt.hash('password1', 10)),
      });

      await User.create({
        username: 'user2',
        name: 'User Two',
        passwordHash: RtString.check(await bcrypt.hash('password2', 10)),
      });

      await User.create({
        username: 'user3',
        name: 'User Three',
        passwordHash: RtString.check(await bcrypt.hash('password3', 10)),
      });
    });

    test('successfully deletes user', async () => {
      const response = await api.get('/api/users/').expect(200);
      const users = UserArrayType.check(JSON.parse(response.text));
      const user = UserType.check(users[0]);
      await api.delete(`/api/users/${user.id}`).expect(204);
    });

    test('deletion is reflected in length of returned users', async () => {
      let response = await api.get('/api/users/').expect(200);
      let users = UserArrayType.check(JSON.parse(response.text));
      const user = UserType.check(users[0]);
      await api.delete(`/api/users/${user.id}`).expect(204);

      response = await api.get('/api/users').expect(200);
      users = UserArrayType.check(JSON.parse(response.text));
      expect(users).toHaveLength(2);
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
        password: 'secretkey',
      };

      const response = await api.post('/api/users').send(newUser).expect(201);
      const user = UserType.check(JSON.parse(response.text));

      expect(user).toBeDefined();
      expect(user.username).toBe('newuser');
      expect(user.name).toBe('New User');
      expect(user.id).toBe(1);
      expect(user.passwordHash).toBeDefined();
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
