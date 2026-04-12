const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../views/responseHelper');

const register = async (req, res) => {
  try {
    const { username, password, name, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return error(res, 400, 'User with this username or email already exists.');
    }

    const user = await User.create({ username, password, name, email });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userData = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      shops: user.shops,
    };

    return success(res, { user: userData, token }, 'Registration successful.', 201);
  } catch (err) {
    console.error('Register error:', err);
    return error(res, 500, 'Failed to register user.');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 400, 'Username and password are required.');
    }

    const user = await User.findOne({ username }).populate('shops');
    if (!user) {
      return error(res, 401, 'Invalid credentials.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 401, 'Invalid credentials.');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const userData = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      shops: user.shops,
    };

    return success(res, { user: userData, token }, 'Login successful.');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 500, 'Failed to login.');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('shops');
    return success(res, user, 'User data retrieved.');
  } catch (err) {
    console.error('GetMe error:', err);
    return error(res, 500, 'Failed to retrieve user data.');
  }
};

module.exports = { register, login, getMe };
