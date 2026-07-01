import Redis from 'ioredis'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

let redis
let bullRedisConnection = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null
}

if (process.env.NODE_ENV === 'test') {
  redis = {
    status: 'ready',
    on: () => {},
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    options: { host: '127.0.0.1', port: 6379 }
  }
} else {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ
    showFriendlyErrorStack: true
  })

  redis.on('connect', () => {
    logger.info('Redis connected successfully')
  })

  redis.on('error', (err) => {
    logger.error({ err }, 'Redis connection error')
  })

  bullRedisConnection = {
    host: redis?.options?.host || '127.0.0.1',
    port: redis?.options?.port || 6379,
    maxRetriesPerRequest: null
  }
}

export { bullRedisConnection }
export default redis
