module.exports = {
  secret: process.env.JWT_SECRET || 'pearl_mom_default_secret_key',
  expiresIn: process.env.JWT_EXPIRE || '30d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  issuer: 'pearl-mom-api',
  audience: 'pearl-mom-users'
};