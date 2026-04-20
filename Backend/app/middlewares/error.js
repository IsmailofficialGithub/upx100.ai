import { StatusCodes } from 'http-status-codes'

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR
  
  const response = {
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      traceId: req.id // Assuming request ID middleware is used
    }
  }

  // Log the error
  console.error(`[Error] ${req.method} ${req.url}:`, err)

  res.status(statusCode).json(response)
}
