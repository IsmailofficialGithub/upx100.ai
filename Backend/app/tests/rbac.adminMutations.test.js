import request from 'supertest'
import app from '../app.js'

jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = {
      role: 'sp_sub',
      orgId: '00000000-0000-0000-0000-0000000000cc',
      userId: '00000000-0000-0000-0000-0000000000dd',
      profile: {},
      email: 'spsub@test.com'
    }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next())
}))

describe('RBAC — admin mutations', () => {
  it('POST /api/admin/organizations returns 403 for sp_sub', async () => {
    const res = await request(app)
      .post('/api/admin/organizations')
      .send({ name: 'Evil Org', country_code: 'US' })
    expect(res.statusCode).toEqual(403)
  })
})
