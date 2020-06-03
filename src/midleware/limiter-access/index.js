import {RateLimiterRedis} from 'rate-limiter-flexible'
import { redisClient } from '../../database/redis-provider'

const rateLimiter = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 5 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {

  rateLimiter.consume(req.ip)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(429).send('Too Many Requests')
    });
};

export default rateLimiterMiddleware