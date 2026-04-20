import request from 'supertest'
import app from '../app.js'
import * as callLogService from '../services/callLog.service.js'

jest.mock('../services/callLog.service.js')

describe('Call Log API & Webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VAPI_WEBHOOK_SECRET = 'test_secret'
  })

  it('POST /api/call-logs/webhook should fail with invalid secret', async () => {
    const res = await request(app)
      .post('/api/call-logs/webhook')
      .set('x-vapi-secret', 'wrong_secret')
      .send({ type: 'call.ended' })
    
    expect(res.statusCode).toEqual(401)
  })

  it('POST /api/call-logs/webhook should succeed with valid secret', async () => {
    callLogService.createCallLog.mockResolvedValue({ id: 'log123' })
    
    const res = await request(app)
      .post('/api/call-logs/webhook')
      .set('x-vapi-secret', 'test_secret')
      .send({ 
        type: 'call.ended',
        call: { id: 'call1', metadata: { organization_id: 'org1' } }
      })
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.received).toBe(true)
  })
})
