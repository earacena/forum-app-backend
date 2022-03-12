import { sign as JwtSign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { String as RtString } from 'runtypes';
import { Response, Request, NextFunction } from 'express';
import User from '../user/user.model';
import { LoginRequest } from './login.types';
import { User as UserType } from '../user/user.types';
import { SECRET_JWT_KEY } from '../../config';

const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = LoginRequest.check(req.body);
    const user = UserType.check(
      await User.findOne({ where: { username: credentials.username } }),
    );

    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        error: 'invalid credentials',
      });
      return;
    }

    // Group together data needed to identify user when decoding token
    const userDetails = {
      id: user.id,
      username: user.username,
    };

    const token = RtString.check(JwtSign(userDetails, SECRET_JWT_KEY));

    res
      .status(200)
      .send({
        token,
        id: user.id,
        username: user.username,
        name: user.name,
      })
      .end();
  } catch (error: unknown) {
    next(error);
  }
};

export default {
  loginController,
};
