import redis from '../config/redis.js'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

/**
 * Fetch cached agents list for an organization/user
 */
export const getCachedAgents = async (orgId, userId = null) => {
  if (redis.status !== 'ready') {
    console.log('[REDIS BYPASS] getCachedAgents -> Redis server offline')
    return null
  }
  const key = `org:agents:${orgId || 'null'}:${userId || 'all'}`
  try {
    const cached = await redis.get(key)
    if (cached) {
      logger.info({ key }, 'REDIS ACTION: getCachedAgents -> HIT')
      return JSON.parse(cached)
    }
    logger.info({ key }, 'REDIS ACTION: getCachedAgents -> MISS')
    return null
  } catch (err) {
    console.error(`[REDIS ERROR] getCachedAgents (${key}) failed:`, err)
    logger.warn({ err, key }, 'Failed to get cached agents from Redis')
    return null
  }
}

/**
 * Cache agents list for an organization/user
 */
export const setCachedAgents = async (orgId, userId, agents) => {
  if (redis.status !== 'ready') {
    console.log('[REDIS BYPASS] setCachedAgents -> Redis server offline')
    return
  }
  const key = `org:agents:${orgId || 'null'}:${userId || 'all'}`
  try {
    await redis.set(key, JSON.stringify(agents), 'EX', 600) // 10 minutes cache
    logger.info({ key }, 'REDIS ACTION: setCachedAgents -> SET')
  } catch (err) {
    console.error(`[REDIS ERROR] setCachedAgents (${key}) failed:`, err)
    logger.warn({ err, key }, 'Failed to cache agents list in Redis')
  }
}

/**
 * Clear all cached agents lists for an organization
 */
export const clearAgentsCache = async (orgId) => {
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] clearAgentsCache (orgId: ${orgId}) -> Redis server offline`)
    return
  }
  const pattern = `org:agents:${orgId || 'null'}:*`
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
      logger.info({ pattern, count: keys.length }, 'Successfully cleared matching agents caches in Redis')
    }
  } catch (err) {
    console.error(`[REDIS ERROR] clearAgentsCache (orgId: ${orgId}) failed:`, err)
    logger.error({ err, orgId }, 'Failed to clear matching agents caches in Redis')
  }
}
