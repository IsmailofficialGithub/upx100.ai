import request from 'supertest'
import app from '../app.js'
import * as scriptService from '../services/scriptRequest.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/scriptRequest.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Script Requests API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/script-requests should allow client submission', async () => {
    scriptService.submitRequest.mockResolvedValue({ id: 'req1', status: 'pending' })
    
    const res = await request(app)
      .post('/api/script-requests')
      .send({ script_content: 'New content' })
    
    expect(res.statusCode).toEqual(201)
    expect(res.body.data.status).toBe('pending')
  })

  it('PATCH /api/script-requests/:id/review should fail for Client Admin', async () => {
    const res = await request(app)
      .patch('/api/script-requests/req1/review')
      .send({ status: 'approved' })
    
    expect(res.statusCode).toEqual(403)
  })
})
