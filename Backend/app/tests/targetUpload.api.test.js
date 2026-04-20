import request from 'supertest'
import app from '../app.js'
import * as uploadService from '../services/targetUpload.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/targetUpload.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Target Uploads API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/target-uploads should fail if file URL is missing', async () => {
    const res = await request(app)
      .post('/api/target-uploads')
      .send({ list_name: 'Contact List' })
    
    expect(res.statusCode).toEqual(400)
    expect(res.body.error.code).toBe('MISSING_FILE')
  })

  it('POST /api/target-uploads should succeed with file URL', async () => {
    uploadService.submitUpload.mockResolvedValue({ id: 'up1', status: 'pending' })
    
    const res = await request(app)
      .post('/api/target-uploads')
      .send({ list_name: 'Contact List', file_url: 'http://s3/list.csv' })
    
    expect(res.statusCode).toEqual(201)
  })
})
