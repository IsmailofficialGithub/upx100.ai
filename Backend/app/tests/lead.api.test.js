import request from 'supertest'
import app from '../app.js'
import * as leadService from '../services/lead.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/lead.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    // Default mock user is client_admin
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Leads API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/leads should be accessible', async () => {
    leadService.listLogsByOrg.mockResolvedValue([{ id: 'lead1' }])
    
    const res = await request(app).get('/api/leads')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
  })

  it('PATCH /api/leads/:id should fail for Client Admin', async () => {
    const res = await request(app)
      .patch('/api/leads/lead1')
      .send({ status: 'warm' })
    
    expect(res.statusCode).toEqual(403)
  })

  it('POST /api/leads/:id/sync-crm should fail for Client Admin', async () => {
    const res = await request(app)
      .post('/api/leads/lead1/sync-crm')
    
    expect(res.statusCode).toEqual(403)
  })
})
