import redis from '../config/redis.js'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

/**
 * Fetch cached subscription packages
 */
export const getCachedPackages = async () => {
  if (redis.status !== 'ready') {
    console.log('[REDIS BYPASS] getCachedPackages -> Redis server offline')
    return null
  }
  try {
    const cached = await redis.get('billing:packages')
    if (cached) {
      console.log('[REDIS ACTION] getCachedPackages -> HIT')
      logger.info('REDIS ACTION: getCachedPackages -> HIT')
      return JSON.parse(cached)
    }
    console.log('[REDIS ACTION] getCachedPackages -> MISS')
    logger.info('REDIS ACTION: getCachedPackages -> MISS')
    return null
  } catch (err) {
    console.error('[REDIS ERROR] getCachedPackages failed:', err)
    logger.warn({ err }, 'Failed to get cached packages from Redis')
    return null
  }
}

/**
 * Cache subscription packages
 */
export const setCachedPackages = async (packages) => {
  if (redis.status !== 'ready') {
    console.log('[REDIS BYPASS] setCachedPackages -> Redis server offline')
    return
  }
  try {
    await redis.set('billing:packages', JSON.stringify(packages), 'EX', 3600) // 1 hour
    console.log('[REDIS ACTION] setCachedPackages -> SET')
    logger.info('REDIS ACTION: setCachedPackages -> SET')
  } catch (err) {
    console.error('[REDIS ERROR] setCachedPackages failed:', err)
    logger.warn({ err }, 'Failed to save packages cache to Redis')
  }
}

/**
 * Fetch cached organization billing status
 */
export const getCachedBillingStatus = async (orgId) => {
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] getCachedBillingStatus (orgId: ${orgId}) -> Redis server offline`)
    return null
  }
  try {
    const cached = await redis.get(`org:billing:${orgId}`)
    if (cached) {
      console.log(`[REDIS ACTION] getCachedBillingStatus (orgId: ${orgId}) -> HIT`)
      logger.info({ orgId }, 'REDIS ACTION: getCachedBillingStatus -> HIT')
      return JSON.parse(cached)
    }
    console.log(`[REDIS ACTION] getCachedBillingStatus (orgId: ${orgId}) -> MISS`)
    logger.info({ orgId }, 'REDIS ACTION: getCachedBillingStatus -> MISS')
    return null
  } catch (err) {
    console.error(`[REDIS ERROR] getCachedBillingStatus (orgId: ${orgId}) failed:`, err)
    logger.warn({ err, orgId }, 'Failed to get cached billing status from Redis')
    return null
  }
}

/**
 * Cache organization billing status
 */
export const setCachedBillingStatus = async (orgId, statusData) => {
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] setCachedBillingStatus (orgId: ${orgId}) -> Redis server offline`)
    return
  }
  try {
    await redis.set(`org:billing:${orgId}`, JSON.stringify(statusData), 'EX', 600) // 10 minutes
    console.log(`[REDIS ACTION] setCachedBillingStatus (orgId: ${orgId}) -> SET`)
    logger.info({ orgId }, 'REDIS ACTION: setCachedBillingStatus -> SET')
  } catch (err) {
    console.error(`[REDIS ERROR] setCachedBillingStatus (orgId: ${orgId}) failed:`, err)
    logger.warn({ err, orgId }, 'Failed to save billing status cache to Redis')
  }
}

/**
 * Fetch cached organization resource limits
 */
export const getCachedLimits = async (orgId) => {
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] getCachedLimits (orgId: ${orgId}) -> Redis server offline`)
    return null
  }
  try {
    const cached = await redis.get(`org:limits:${orgId}`)
    if (cached) {
      console.log(`[REDIS ACTION] getCachedLimits (orgId: ${orgId}) -> HIT`)
      logger.info({ orgId }, 'REDIS ACTION: getCachedLimits -> HIT')
      return JSON.parse(cached)
    }
    console.log(`[REDIS ACTION] getCachedLimits (orgId: ${orgId}) -> MISS`)
    logger.info({ orgId }, 'REDIS ACTION: getCachedLimits -> MISS')
    return null
  } catch (err) {
    console.error(`[REDIS ERROR] getCachedLimits (orgId: ${orgId}) failed:`, err)
    logger.warn({ err, orgId }, 'Failed to get cached resource limits from Redis')
    return null
  }
}

/**
 * Cache organization resource limits
 */
export const setCachedLimits = async (orgId, limits) => {
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] setCachedLimits (orgId: ${orgId}) -> Redis server offline`)
    return
  }
  try {
    await redis.set(`org:limits:${orgId}`, JSON.stringify(limits), 'EX', 600) // 10 minutes
    console.log(`[REDIS ACTION] setCachedLimits (orgId: ${orgId}) -> SET`)
    logger.info({ orgId }, 'REDIS ACTION: setCachedLimits -> SET')
  } catch (err) {
    console.error(`[REDIS ERROR] setCachedLimits (orgId: ${orgId}) failed:`, err)
    logger.warn({ err, orgId }, 'Failed to save resource limits cache to Redis')
  }
}

/**
 * Invalidate all Redis caches for a specific organization
 */
export const clearOrgCache = async (orgId) => {
  if (!orgId) return
  if (redis.status !== 'ready') {
    console.log(`[REDIS BYPASS] clearOrgCache (orgId: ${orgId}) -> Redis server offline`)
    return
  }
  try {
    await redis.del(`org:limits:${orgId}`)
    await redis.del(`org:billing:${orgId}`)
    console.log(`[REDIS ACTION] clearOrgCache (orgId: ${orgId}) -> DEL org:limits & org:billing`)
    logger.info({ orgId }, 'Successfully invalidated Redis caches for organization')
  } catch (err) {
    console.error(`[REDIS ERROR] clearOrgCache (orgId: ${orgId}) failed:`, err)
    logger.error({ err, orgId }, 'Failed to invalidate Redis cache for organization')
  }
}
