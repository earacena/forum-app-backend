import supertest from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../app';
import User from '../user/user.model';
import Role from '../role/role.model';

import {
  TokenResponse as TokenResponseType,
} from './login.types';

const api = supertest(app.app);
jest.mock('jsonwebtoken');
jest.mock('sequelize');
jest.mock('../user/user.model');
jest.mock('../role/role.model');
jest.mock('bcrypt');

describe('Login API', () => {
  beforeAll(() => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Mock User 1',
      username: 'mockuser1',
      passwordHash: 'password_hash',
      dateRegistered: new Date(Date.now()).toDateString(),
    });
    (Role.findByPk as jest.Mock).mockResolvedValue({
      userId: 1,
      role: 'admin',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mock token');
  });

  describe('when receiving a login request', () => {
    test('successfully returns a token for correct credentials', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'mockuser1', password: 'password1' })
        .expect(200);

      const tokenResponse = TokenResponseType.check(JSON.parse(response.text));
      expect(tokenResponse.token).toBeDefined();
      expect(tokenResponse.username).toBeDefined();
      expect(tokenResponse.name).toBeDefined();
    });

    test('returns error for incorrect credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      await api
        .post('/api/login')
        .send({ username: 'mockuser1', password: 'password2' })
        .expect(400);

      (User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await api
        .post('/api/login')
        .send({ username: 'user2', password: 'password1' })
        .expect(400);
    });
  });
});
