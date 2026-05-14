import request from 'supertest'
import app from '../app.js'

jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = {
      role: 'client_sub',
      orgId: '00000000-0000-0000-0000-0000000000aa',
      userId: '00000000-0000-0000-0000-0000000000bb',
      profile: {},
      email: 'sub@test.com'
    }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

describe('RBAC — export monthly', () => {
  it('GET /api/export/monthly returns 403 for client_sub', async () => {
    const res = await request(app).get('/api/export/monthly')
    expect(res.statusCode).toEqual(403)
  })
})
