import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'

/**
 * Submit a new access request from the landing page.
 */
export const createAccessRequest = async (req, res) => {
  const { name, company, employees, phone, email, interest } = req.body

  if (!name || !email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: 'Name and email are required.' }
    })
  }

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .insert([
      {
        name,
        company,
        employees,
        phone,
        email,
        interest,
        status: 'pending'
      }
    ])
    .select()
    .single()

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: 'Failed to submit access request.', details: error.message }
    })
  }

  return res.status(StatusCodes.CREATED).json({
    message: 'Access request submitted successfully.',
    data
  })
}

/**
 * Fetch all access requests for the admin dashboard.
 */
export const getAccessRequests = async (req, res) => {
  const { role } = req.user

  if (role !== 'gcc_admin' && role !== 'gcc_reviewer') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Insufficient permissions to view access requests.' }
    })
  }

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: 'Failed to fetch access requests.', details: error.message }
    })
  }

  return res.json({ data })
}

/**
 * Update the status of an access request.
 */
export const updateAccessRequestStatus = async (req, res) => {
  const { role } = req.user
  const { id } = req.params
  const { status } = req.body

  if (role !== 'gcc_admin' && role !== 'gcc_reviewer') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: { message: 'Insufficient permissions to update access requests.' }
    })
  }

  if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: { message: 'Invalid status provided.' }
    })
  }

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: 'Failed to update access request status.', details: error.message }
    })
  }

  return res.json({ message: 'Status updated successfully.', data })
}
