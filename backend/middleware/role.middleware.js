/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if the authenticated user has the required role(s)
 * 
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'midwife', 'mother')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (protect middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login first.'
      });
    }

    // Check if user's role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
};

module.exports = { authorize };