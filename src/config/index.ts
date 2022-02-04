import 'dotenv/config';

const validateEnvironmentVariable = (value: string | undefined): string => value || '';

const isValidNumber = (value: unknown): value is number => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Number.isNaN(Number(value))) {
    return false;
  }

  return true;
};

const determineDatabaseUrl = (nodeEnv: string): string => {
  switch (nodeEnv) {
    case 'development':
      return validateEnvironmentVariable(process.env['DEV_DATABASE_URL']);
    default:
      return '';
  }
};

export const NODE_ENV = validateEnvironmentVariable(process.env['NODE_ENV']);

export const DATABASE_URL = determineDatabaseUrl(NODE_ENV);

export const PORT = isValidNumber(
  validateEnvironmentVariable(process.env['PORT']),
);
