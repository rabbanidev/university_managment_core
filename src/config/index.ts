import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL,
    token_expires_in: process.env.REDIS_TOKEN_EXPIRES_IN,
  },
};
