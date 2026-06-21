import request from 'supertest'
import app from '../app.js'
import * as outboundTargetService from '../services/outboundTarget.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/outboundTarget.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    // Default mock user is client_admin
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

describe('Outbound Targets API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/outbound-targets should list targets', async () => {
    outboundTargetService.listOutboundTargetsByOrg.mockResolvedValue([{ id: 'target1', phone: '+12345678' }])
    
    const res = await request(app).get('/api/outbound-targets')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].phone).toBe('+12345678')
  })

  it('GET /api/outbound-targets/:id should return a specific target', async () => {
    outboundTargetService.getOutboundTargetById.mockResolvedValue({
      id: 'target1',
      organization_id: 'org123',
      phone: '+12345678'
    })

    const res = await request(app).get('/api/outbound-targets/target1')

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.id).toBe('target1')
  })

  it('POST /api/outbound-targets should create a single target', async () => {
    outboundTargetService.createOutboundTarget.mockResolvedValue({
      id: 'target-new',
      organization_id: 'org123',
      phone: '+12345678',
      status: 'outbound'
    })

    const res = await request(app)
      .post('/api/outbound-targets')
      .send({
        organization_id: 'org123',
        phone: '+12345678',
        initiate_call: true
      })

    expect(res.statusCode).toEqual(201)
    expect(res.body.data.id).toBe('target-new')
    expect(outboundTargetService.createOutboundTarget).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: 'org123',
        phone: '+12345678'
      }),
      true
    )
  })

  it('POST /api/outbound-targets/bulk should import multiple targets', async () => {
    outboundTargetService.createOutboundTargetsBulk.mockResolvedValue([
      { id: 't1', phone: '+111' },
      { id: 't2', phone: '+222' }
    ])

    const res = await request(app)
      .post('/api/outbound-targets/bulk')
      .send({
        organization_id: 'org123',
        targets: [
          { phone: '+111', name: 'User 1' },
          { phone: '+222', name: 'User 2' }
        ]
      })

    expect(res.statusCode).toEqual(201)
    expect(res.body.data).toHaveLength(2)
    expect(outboundTargetService.createOutboundTargetsBulk).toHaveBeenCalled()
  })

  it('PATCH /api/outbound-targets/:id should update target fields', async () => {
    outboundTargetService.getOutboundTargetById.mockResolvedValue({
      id: 'target1',
      organization_id: 'org123'
    })
    outboundTargetService.updateOutboundTarget.mockResolvedValue({
      id: 'target1',
      status: 'called'
    })

    const res = await request(app)
      .patch('/api/outbound-targets/target1')
      .send({ status: 'called' })

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.status).toBe('called')
    expect(outboundTargetService.updateOutboundTarget).toHaveBeenCalledWith(
      'target1',
      expect.objectContaining({ status: 'called' })
    )
  })

  it('DELETE /api/outbound-targets/:id should delete target', async () => {
    outboundTargetService.getOutboundTargetById.mockResolvedValue({
      id: 'target1',
      organization_id: 'org123'
    })
    outboundTargetService.deleteOutboundTarget.mockResolvedValue({
      id: 'target1'
    })

    const res = await request(app).delete('/api/outbound-targets/target1')

    expect(res.statusCode).toEqual(200)
    expect(outboundTargetService.deleteOutboundTarget).toHaveBeenCalledWith('target1')
  })
})
