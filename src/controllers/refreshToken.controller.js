// const router = express.Router();
const jwt = require('jsonwebtoken');
const signup = require('../models/signup.models.js');

const { verify, sign } = jwt;

// Refresh Token
const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Verify the refresh token
    const decoded = verify(refreshToken, process.env.refresh_token_secrat);

    // Find the user by ID from the decoded refresh token
    const user = await signup.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the refresh token in the request matches the one in the database
    if (refreshToken !== user.refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate a new access token and refresh token
    const newAccessToken = sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Update the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

module.exports = refreshTokenController;
