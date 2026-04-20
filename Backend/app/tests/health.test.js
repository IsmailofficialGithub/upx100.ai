import request from 'supertest'
import app from '../app.js'

describe('Health & Ready Check API', () => {
  it('GET /health should return 200 and status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('status', 'ok')
  })

  it('GET /ready should return 200 and status ready', async () => {
    const res = await request(app).get('/ready')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('status', 'ready')
  })

  it('GET / should return active message', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toContain('UP100X AI API is active')
  })
})
