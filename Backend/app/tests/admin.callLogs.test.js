import request from 'supertest'
import app from '../app.js'
import * as callLogService from '../services/callLog.service.js'
import { auth, isAdmin } from '../middlewares/auth.js'

jest.mock('../services/callLog.service.js')
jest.mock('../middlewares/auth.js', () => ({
  auth: jest.fn((req, res, next) => {
    req.user = { role: 'gcc_admin', orgId: null, userId: 'admin1' }
    next()
  }),
  isAdmin: jest.fn((req, res, next) => next()),
}))

describe('Admin call logs delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/admin/call-logs/delete rejects empty ids', async () => {
    const res = await request(app).post('/api/admin/call-logs/delete').send({ ids: [] })
    expect(res.statusCode).toEqual(400)
  })

  it('POST /api/admin/call-logs/delete removes scoped logs', async () => {
    const id = '00000000-0000-4000-a000-000000000099'
    callLogService.getCallLogsByIds.mockResolvedValue([
      { id, organization_id: '00000000-0000-4000-a000-000000000003', is_deleted_data: true },
    ])
    callLogService.deleteCallLogsByIds.mockResolvedValue({ deleted: 1, ids: [id] })

    const res = await request(app).post('/api/admin/call-logs/delete').send({ ids: [id] })

    expect(res.statusCode).toEqual(200)
    expect(res.body.data.deleted).toBe(1)
    expect(callLogService.deleteCallLogsByIds).toHaveBeenCalledWith([id])
  })
})
