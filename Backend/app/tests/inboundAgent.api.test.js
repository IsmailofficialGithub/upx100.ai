import request from 'supertest'
import app from '../app.js'
import * as agentService from '../services/inboundAgent.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/inboundAgent.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Inbound Agent API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/agents should be accessible to authenticated users', async () => {
    agentService.listAgentsByOrg.mockResolvedValue([{ id: 'agent1' }])
    
    const res = await request(app).get('/api/agents')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).toHaveLength(1)
  })

  it('POST /api/agents should return 403 for non-admin users', async () => {
    const res = await request(app)
      .post('/api/agents')
      .send({ name: 'New Agent' })
    
    expect(res.statusCode).toEqual(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })
})
