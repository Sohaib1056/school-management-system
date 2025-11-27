import dotenv from 'dotenv';

export const loadEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const path = `.env${env === 'test' ? '.test' : ''}`;
  dotenv.config({ path });
  dotenv.config();
};
