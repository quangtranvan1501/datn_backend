const redis = require('redis');

const redisUrl = process.env.REDIS_URL;

let redisClient = {};

const createClient = async () => {
  console.log('redisUrl', redisUrl);
  const _redisClient = await redis
    .createClient({
      url: redisUrl,
    })
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  await _redisClient.set('key', 'value');
  const value = await _redisClient.get('key');
  console.log(value);

  redisClient = _redisClient;
};

/**
 * Hàm lấy dữ liệu từ cache hoặc gọi callback để lấy dữ liệu mới và lưu vào cache
 * @param {string} key - Key của dữ liệu trong cache
 * @param {number} expireTime - Thời gian hết hạn của cache (giây)
 * @param {Function} callback - Hàm callback để lấy dữ liệu mới nếu không có trong cache
 * @returns {Promise<any>} - Dữ liệu từ cache hoặc từ callback
 */
const getOrSetCache = async (key, expireTime, callback) => {
  try {
    let resltev = await redisClient.get(key);
    if (resltev) {
      return JSON.parse(resltev);
    }

    //set cache
    let data = await callback();
    await redisClient.SETEX(key, expireTime, JSON.stringify(data));
    return data;
  } catch (error) {
    console.log('Error', error);
  }
};

module.exports = { createClient, redisClient, getOrSetCache };
