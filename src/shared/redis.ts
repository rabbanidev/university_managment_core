import config from '../config';
import { SetOptions, createClient } from 'redis';
import { errorLogger, logger } from './logger';

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', (error) => errorLogger.error('Redis Error:', error));
redisClient.on('connect', () => logger.info('Redis connected'));

const redisPubClient = createClient({
  url: config.redis.url,
});

const redisSubClient = createClient({
  url: config.redis.url,
});

// Redis connect function
const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

// Redis set function
const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

// Redis get function
const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

// Redis get function
const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

// Access token set in redis
const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access_token: ${userId}`;
  await redisClient.set(key, token, {
    EX: Number(config.redis.token_expires_in),
  });
};

// Get access token in redis
const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access_token: ${userId}`;
  return await redisClient.get(key);
};

// Get access token in redis
const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access_token: ${userId}`;
  await redisClient.del(key);
};

// Redis disconnect function
const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  disconnect,
  publisher: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
