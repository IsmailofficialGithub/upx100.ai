import { supabaseAdmin } from '../config/supabase.js'
import redis from '../config/redis.js'
import { StatusCodes } from 'http-status-codes'
import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

/**
 * Middleware to enforce package-based resource limits.
 * Checks the organization's plan and blocks creations if limits are exceeded.
 */
export const enforceLimits = (limitKey) => {
  return async (req, res, next) => {
    try {
      const orgId = req.user?.orgId
      // Admins (e.g. GCC Staff) skip limits
      if (req.user?.role === 'gcc_admin' || !orgId) {
        return next()
      }

      const cacheKey = `org:limits:${orgId}`
      let limits = null

      // 1. Attempt to fetch limits from Redis cache
      try {
        const cached = await redis.get(cacheKey)
        if (cached) {
          limits = JSON.parse(cached)
        }
      } catch (err) {
        logger.warn({ err }, 'Failed to fetch limit cache from Redis')
      }

      // 2. Fallback to Database if cache is empty
      if (!limits) {
        const { data: sub, error } = await supabaseAdmin
          .from('subscriptions')
          .select('*, package:subscription_packages(*)')
          .eq('organization_id', orgId)
          .maybeSingle()

        if (error) throw error

        let activePackage = null
        if (sub?.package) {
          activePackage = sub.package
        } else {
          // If no subscription record, use default 'Free' package limits
          const { data: freePkg, error: freeError } = await supabaseAdmin
            .from('subscription_packages')
            .select('*')
            .eq('name', 'Free')
            .maybeSingle()

          if (freeError) throw freeError
          activePackage = freePkg
        }

        if (activePackage) {
          limits = {
            max_agents: activePackage.max_agents,
            max_inbound_phone_numbers: activePackage.max_inbound_phone_numbers,
            max_outbound_phone_numbers: activePackage.max_outbound_phone_numbers,
            max_lead_upload_rows: activePackage.max_lead_upload_rows,
            allow_voice_cloning: activePackage.allow_voice_cloning
          }

          // Cache limits in Redis for 10 minutes
          try {
            await redis.set(cacheKey, JSON.stringify(limits), 'EX', 600)
          } catch (err) {
            logger.warn({ err }, 'Failed to write limit cache to Redis')
          }
        }
      }

      // If limits couldn't be loaded, let the request proceed to be safe
      if (!limits) {
        return next()
      }

      // 3. Enforce specific resource constraints
      switch (limitKey) {
        case 'max_agents': {
          const { count, error } = await supabaseAdmin
            .schema('inbound')
            .from('agents')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', orgId)
            .is('deleted_at', null)

          if (error) throw error

          if (count >= limits.max_agents) {
            return res.status(StatusCodes.PAYMENT_REQUIRED).json({
              error: {
                code: 'LIMIT_EXCEEDED',
                message: `You have reached the maximum limit of ${limits.max_agents} active agents allowed on your current package. Please upgrade to create more.`
              }
            })
          }
          break
        }

        case 'max_inbound_phone_numbers': {
          const { count, error } = await supabaseAdmin
            .schema('inbound')
            .from('phone_numbers')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', orgId)

          if (error) throw error

          if (count >= limits.max_inbound_phone_numbers) {
            return res.status(StatusCodes.PAYMENT_REQUIRED).json({
              error: {
                code: 'LIMIT_EXCEEDED',
                message: `You have reached the maximum limit of ${limits.max_inbound_phone_numbers} phone lines allowed on your current package. Please upgrade to import or purchase more.`
              }
            })
          }
          break
        }

        case 'allow_voice_cloning': {
          if (!limits.allow_voice_cloning) {
            return res.status(StatusCodes.PAYMENT_REQUIRED).json({
              error: {
                code: 'FEATURE_LOCKED',
                message: 'Custom voice cloning is not available on your current plan. Please upgrade to unlock this feature.'
              }
            })
          }
          break
        }

        default:
          break
      }

      next()
    } catch (err) {
      logger.error({ err, limitKey }, 'Error enforcing resource limits')
      next(err)
    }
  }
}
