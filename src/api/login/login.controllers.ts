import { sign as JwtSign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { String as RtString } from 'runtypes';
import { Response, Request } from 'express';
import User from '../user/user.model';
import { LoginRequest } from './login.types';
import { User as UserType } from '../user/user.types';
import { SECRET_JWT_KEY } from '../../config';
import { RtValidationError } from '../post/post.types';

const loginController = async (req: Request, res: Response) => {
  try {
    const credentials = LoginRequest.check(req.body);
    const user = UserType.check(await User.findOne({ where: { username: credentials.username } }));

    const isPasswordCorrect = (user === null)
      ? false
      : await bcrypt.compare(credentials.password, user.passwordHash);

    if (!(user && isPasswordCorrect)) {
      res
        .status(401)
        .json({
          error: 'invalid username or password',
        })
        .end();
    }

    const userDetails = {
      id: user.id,
      username: user.username,
    };

    const token = RtString.check(JwtSign(userDetails, SECRET_JWT_KEY));

    res
      .status(200)
      .send({
        token,
        username: user.username,
        name: user.name,
      });
  } catch (error: unknown) {
    if (RtValidationError.guard(error)) {
      if (error.code === 'CONTENT_INCORRECT' && error.details) {
        if ('decodedToken' in error.details) {
          res.status(401).json({ error: 'invalid or missing token' }).end();
        }

        res.status(400).json({ error: error.details }).end();
      }
    }
  }
};

export default {
  loginController,
};