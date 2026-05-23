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
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

describe('Leads API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/leads should be accessible', async () => {
    leadService.listLeadsByOrg.mockResolvedValue([{ id: 'lead1' }])
    
    const res = await request(app).get('/api/leads')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
  })

  it('POST /api/leads should create a meeting lead for Client Admin', async () => {
    leadService.createLead.mockResolvedValue({
      id: 'lead-new',
      organization_id: 'org123',
      name: 'Jane Doe',
      meeting_time: '2026-05-21T15:00:00.000Z',
      meeting_date: '2026-05-21',
      status: 'follow_up',
    })

    const res = await request(app)
      .post('/api/leads')
      .send({
        organization_id: 'org123',
        name: 'Jane Doe',
        meeting_time: '2026-05-21T15:00:00.000Z',
        meeting_date: '2026-05-21',
        status: 'follow_up',
      })

    expect(res.statusCode).toEqual(201)
    expect(res.body.data.id).toBe('lead-new')
    expect(leadService.createLead).toHaveBeenCalled()
  })

  it('PATCH /api/leads/:id should update meeting_outcome for Client Admin', async () => {
    leadService.getLeadById.mockResolvedValue({
      id: 'lead1',
      organization_id: 'org123',
    })
    leadService.updateLead.mockResolvedValue({
      id: 'lead1',
      meeting_outcome: 'proposal',
    })

    const res = await request(app)
      .patch('/api/leads/lead1')
      .send({ meeting_outcome: 'proposal' })

    expect(res.statusCode).toEqual(200)
    expect(leadService.updateLead).toHaveBeenCalledWith(
      'lead1',
      expect.objectContaining({ meeting_outcome: 'proposal' })
    )
  })

  it('POST /api/leads/:id/sync-crm should fail for Client Admin', async () => {
    const res = await request(app)
      .post('/api/leads/lead1/sync-crm')
    
    expect(res.statusCode).toEqual(403)
  })
})
