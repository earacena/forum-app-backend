import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app';
import { sequelize } from '../../utils/db';
import User from '../user/user.model';
import {
  PasswordHash as PasswordHashType,
  TokenResponse as TokenResponseType,
} from './login.types';

const api = supertest(app.app);

describe('Login API', () => {
  describe('when receiving a login request', () => {
    beforeEach(async () => {
      await User.sync({ force: true });
      await User.create({
        username: 'user1',
        name: 'User One',
        passwordHash: PasswordHashType.check(
          await bcrypt.hash('password1', 10),
        ),
      });
    });

    test('successfully returns a token for correct credentials', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'user1', password: 'password1' })
        .expect(200);
      const tokenResponse = TokenResponseType.check(JSON.parse(response.text));
      expect(tokenResponse.token).toBeDefined();
      expect(tokenResponse.username).toBeDefined();
      expect(tokenResponse.name).toBeDefined();
    });

    test('returns error for incorrect credentials', async () => {
      await api
        .post('/api/login')
        .send({ username: 'user1', password: 'password2' })
        .expect(401);
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
