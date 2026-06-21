import { enforceLimits } from '../middlewares/enforceLimits.js'
import { supabaseAdmin } from '../config/supabase.js'
import redis from '../config/redis.js'
import { StatusCodes } from 'http-status-codes'

// Mock authentication middleware
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next())
}))

// Mock Redis & BullMQ
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn()
  }))
})

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({ add: jest.fn() })),
  Worker: jest.fn().mockImplementation(() => ({ on: jest.fn() }))
}))

// Clean chained mock for Supabase Admin client defined directly inside the factory
jest.mock('../config/supabase.js', () => {
  const query = {
    schema: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    single: jest.fn(),
    maybeSingle: jest.fn()
  }
  query.schema.mockReturnValue(query)
  query.from.mockReturnValue(query)
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  query.is.mockReturnValue(query)

  return {
    supabaseAdmin: query
  }
})

describe('Enforce Limits Middleware', () => {
  let req, res, next

  beforeEach(() => {
    jest.clearAllMocks()
    req = {
      user: { role: 'client_admin', orgId: 'org-123' }
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    next = jest.fn()
  })

  it('should skip check and call next if user is GCC Admin', async () => {
    req.user.role = 'gcc_admin'
    const middleware = enforceLimits('max_agents')
    await middleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(supabaseAdmin.from).not.toHaveBeenCalled()
  })

  it('should skip check and call next if no orgId is found in user session', async () => {
    delete req.user.orgId
    const middleware = enforceLimits('max_agents')
    await middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should allow request if limits are not exceeded (using cached Redis values)', async () => {
    const limits = { max_agents: 5 }
    redis.get.mockResolvedValueOnce(JSON.stringify(limits)) // Cache hit
    
    // DB query for active agents count (returns 2)
    supabaseAdmin.is.mockResolvedValueOnce({ count: 2, error: null })

    const middleware = enforceLimits('max_agents')
    await middleware(req, res, next)

    expect(redis.get).toHaveBeenCalledWith('org:limits:org-123')
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('should block request and return 402 if max_agents limit is reached', async () => {
    const limits = { max_agents: 2 }
    redis.get.mockResolvedValueOnce(JSON.stringify(limits)) // Cache hit
    
    // DB query for active agents count (returns 2)
    supabaseAdmin.is.mockResolvedValueOnce({ count: 2, error: null })

    const middleware = enforceLimits('max_agents')
    await middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.PAYMENT_REQUIRED)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'LIMIT_EXCEEDED',
          message: expect.stringContaining('reached the maximum limit of 2 active agents')
        })
      })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should allow voice cloning request if subscription package allow_voice_cloning is true', async () => {
    const limits = { allow_voice_cloning: true }
    redis.get.mockResolvedValueOnce(JSON.stringify(limits))

    const middleware = enforceLimits('allow_voice_cloning')
    await middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('should block voice cloning request and return 402 if subscription package allow_voice_cloning is false', async () => {
    const limits = { allow_voice_cloning: false }
    redis.get.mockResolvedValueOnce(JSON.stringify(limits))

    const middleware = enforceLimits('allow_voice_cloning')
    await middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.PAYMENT_REQUIRED)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'FEATURE_LOCKED',
          message: expect.stringContaining('Custom voice cloning is not available')
        })
      })
    )
    expect(next).not.toHaveBeenCalled()
  })
})
