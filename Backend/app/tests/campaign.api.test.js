import request from 'supertest'
import app from '../app.js'
import * as campaignService from '../services/campaign.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/campaign.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Campaign Control API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/campaigns/:id/pause should fail if reason is missing', async () => {
    const res = await request(app)
      .post('/api/campaigns/agent1/pause')
      .send({})
    
    expect(res.statusCode).toEqual(400)
    expect(res.body.error.code).toBe('MISSING_REASON')
  })

  it('POST /api/campaigns/:id/pause should succeed with reason', async () => {
    campaignService.pauseCampaign.mockResolvedValue({ id: 'agent1', status: 'paused' })
    
    const res = await request(app)
      .post('/api/campaigns/agent1/pause')
      .send({ reason: 'Maintenance' })
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toMatch(/paused/)
  })
})
