const jwt = require('jsonwebtoken');

const generateToken = (id, type) => {
  const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET; // Use refresh secret if type is refresh, fallback to access secret
  const expiresIn = type === 'access' ? '15m' : '7d'; // Access token expires in 15m, Refresh token in 7d (adjust as needed)

  return jwt.sign({ id }, secret, {
    expiresIn: expiresIn,
  });
};

module.exports = generateToken; 