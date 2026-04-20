const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Development-only: generate a token for a given username and redirect
async function autoLogin(req, res) {
  try {
    if (process.env.NODE_ENV === 'production') return res.status(403).send('Not allowed');
    const { username } = req.query;
    if (!username) return res.status(400).send('username query required');
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send('User not found');
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    const client = process.env.CLIENT_URL || 'http://localhost:5173';
    const redirectUrl = `${client}/auto?token=${encodeURIComponent(token)}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('dev autoLogin error:', err);
    return res.status(500).send('error');
  }
}

module.exports = { autoLogin };
