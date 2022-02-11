import 'dotenv/config';
import { String as RtString, Number as RtNumber } from 'runtypes'

const determineDatabaseUrl = (nodeEnv: string): string => {
  switch (nodeEnv) {
    case 'development':
      return RtString.check(process.env['DEV_DATABASE_URL']);
    case 'testing':
      return RtString.check(process.env['TEST_DATABASE_URL']);
    default:
      return '';
  }
};

export const NODE_ENV = RtString.check(process.env['NODE_ENV']);
export const DATABASE_URL = determineDatabaseUrl(NODE_ENV);

export const PORT: number = RtNumber.check(process.env['PORT']);
