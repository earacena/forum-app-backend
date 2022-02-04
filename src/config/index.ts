import 'dotenv/config';

const validateEnvironmentVariable = (value: string | undefined): string => {
  return value ? value : '';
};

const isValidNumber = (value: unknown): value is Number => {
  if (value === undefined || value === null) {
    return false;
  }

  if (isNaN(Number(value))) {
    return false;
  }

  return true;
};

export const NODE_ENV = process.env['NODE_ENV'];

let DATABASE_URL: string = '';
if (NODE_ENV === 'development') {
  DATABASE_URL = validateEnvironmentVariable(process.env['DEV_DATABASE_URL']);
}

export const PORT = isValidNumber(validateEnvironmentVariable(process.env['PORT']));

export { DATABASE_URL };
