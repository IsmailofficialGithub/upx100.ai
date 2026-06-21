import Redis from 'ioredis'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

// Main redis client for caching
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
  showFriendlyErrorStack: true
})

redis.on('connect', () => {
  logger.info('Redis connected successfully')
})

redis.on('error', (err) => {
  logger.error({ err }, 'Redis connection error')
})

// Configuration for BullMQ connection options
export const bullRedisConnection = {
  host: redis.options.host || '127.0.0.1',
  port: redis.options.port || 6379,
  maxRetriesPerRequest: null // BullMQ requires this to be null
}

export default redis
