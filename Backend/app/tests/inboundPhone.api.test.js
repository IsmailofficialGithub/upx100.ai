import request from 'supertest'
import app from '../app.js'
import * as phoneService from '../services/inboundPhone.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/inboundPhone.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

describe('Inbound Phone API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/phone-numbers should be accessible', async () => {
    phoneService.listNumbersByOrg.mockResolvedValue([{ phone_number: '+123' }])
    
    const res = await request(app).get('/api/phone-numbers')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
  })

  it('POST /api/phone-numbers (Provision) should be allowed for Client Admin', async () => {
    phoneService.provisionNumber.mockResolvedValue({
      db: { id: 'p1', phone_number: '+123', organization_id: 'org123', status: 'active' },
      webhook: { status: 'provisioning' },
    })

    const res = await request(app)
      .post('/api/phone-numbers')
      .send({ phone_number: '+1234567890', organization_id: 'org123' })

    expect(res.statusCode).toEqual(201)
    expect(phoneService.provisionNumber).toHaveBeenCalled()
  })

  it('POST /api/phone-numbers/:id/port-request should be allowed for Client Admin', async () => {
    phoneService.getNumberById.mockResolvedValue({
      id: 'p1',
      organization_id: 'org123',
      metadata: {}
    })
    phoneService.submitPortRequest.mockResolvedValue({
      id: 'p1',
      port_requested: true,
      port_status: 'submitted'
    })

    const res = await request(app)
      .post('/api/phone-numbers/p1/port-request')
      .send({ current_carrier: 'Twilio' })

    expect(res.statusCode).toEqual(200)
  })
})
