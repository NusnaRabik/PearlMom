/**
 * Request Logger Middleware
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    const logLevel = statusCode >= 400 ? '⚠️' : '✅';
    
    console.log(
      `${logLevel} ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`
    );
  });

  next();
};

module.exports = logger;