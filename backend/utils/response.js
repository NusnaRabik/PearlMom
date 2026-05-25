// Success response helper
const success = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

// Error response helper
const error = (res, message = 'Error occurred', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// Alternative naming convention (alias)
const successResponse = success;
const errorResponse = error;

module.exports = { success, error, successResponse, errorResponse };