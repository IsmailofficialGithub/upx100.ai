import request from 'supertest'
import app from '../app.js'
import * as voiceService from '../services/voiceClone.service.js'
import { auth } from '../middlewares/auth.js'

jest.mock('../services/voiceClone.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'client_admin', orgId: 'org123', userId: 'user123' }
    next()
  })
}))

describe('Voice Clone API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/voice-clones should fail if sample URL is missing', async () => {
    const res = await request(app)
      .post('/api/voice-clones')
      .send({ voice_name: 'Clone 1' })
    
    expect(res.statusCode).toEqual(400)
    expect(res.body.error.code).toBe('MISSING_SAMPLE')
  })

  it('POST /api/voice-clones should succeed with sample URL', async () => {
    voiceService.submitCloneRequest.mockResolvedValue({ id: 'vc1', status: 'pending' })
    
    const res = await request(app)
      .post('/api/voice-clones')
      .send({ voice_name: 'Clone 1', sample_url: 'http://s3/sample.mp3' })
    
    expect(res.statusCode).toEqual(201)
    expect(res.body.data.status).toBe('pending')
  })
})
