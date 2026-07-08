import request from 'supertest'
import app from '../app.js'
import axios from 'axios'

jest.mock('axios')

describe('Marketing Landing Call API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_WEBHOOK_BASE_URL = 'https://auto.up100x.ai'
    process.env.REACT_APP_WEBHOOK_LANDING_PAGE_CALL = '/webhook/landing_page_call'
  })

  it('POST /api/marketing/landing-call should trigger webhook', async () => {
    axios.post.mockResolvedValue({ data: { ok: true } })

    const res = await request(app).post('/api/marketing/landing-call').send({
      phone: '+15550199',
      consent: true,
    })

    expect(res.statusCode).toBe(202)
    expect(axios.post).toHaveBeenCalledWith(
      'https://auto.up100x.ai/webhook/landing_page_call',
      expect.objectContaining({
        phone: '+15550199',
        source: 'landing_page',
      }),
    )
  })

  it('POST /api/marketing/landing-call should require consent', async () => {
    const res = await request(app).post('/api/marketing/landing-call').send({
      phone: '+15550199',
    })

    expect(res.statusCode).toBe(400)
    expect(axios.post).not.toHaveBeenCalled()
  })
})
