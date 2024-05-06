/**
 * ApiResponse class
 */
class ApiResponse {
    constructor(statusCode, data, success) {
      this.statusCode = statusCode;
      this.data = data;
      this.validation = success;
    }
  }
  
  /**
   * Error handler middleware
   * @param {Error} err - The error object
   * @param {import('express').Request} req - The request object
   * @param {import('express').Response} res - The response object
   * @param {import('express').NextFunction} next - The next middleware function
   */
  const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);
  
    // Determine the appropriate error code
    let statusCode = 500;
    if (err instanceof SyntaxError) statusCode = 400;
    else if (err.name === 'ValidationError') statusCode = 422;
    else if (err.name === 'CastError') statusCode = 400;    
  
    // Create an error response object
    const errorResponse = new ApiResponse(statusCode, { message: err.message }, false);
  
    // If the error is a validation error, add the errors field to the response
    if (err.name === 'ValidationError') {
      errorResponse.data.errors = Object.values(err.errors).map((error) => error.message);
    }
  
    // Send the error response
    res.status(statusCode).json(errorResponse);
  };
  
  // Export the errorHandler function and ApiResponse class
  module.exports = {
    errorHandler,
    ApiResponse,
  };