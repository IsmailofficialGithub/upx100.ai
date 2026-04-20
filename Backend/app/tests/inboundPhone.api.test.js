import request from 'supertest'
import app from '../app.js'
import * as phoneService from '../services/inboundPhone.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/inboundPhone.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
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

  it('POST /api/phone-numbers (Provision) should be forbidden for Client Admin', async () => {
    const res = await request(app)
      .post('/api/phone-numbers')
      .send({ phone_number: '+123' })
    
    expect(res.statusCode).toEqual(403)
  })

  it('POST /api/phone-numbers/:id/port-request should be allowed for Client Admin', async () => {
    phoneService.requestPort.mockResolvedValue({ id: 'p1' })
    
    const res = await request(app)
      .post('/api/phone-numbers/p1/port-request')
      .send({ current_carrier: 'Twilio' })
    
    expect(res.statusCode).toEqual(200)
  })
})
