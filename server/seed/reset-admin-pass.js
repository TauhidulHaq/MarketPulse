require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await connectDB();
  const user = await User.findOne({ username: 'admin' });
  if (!user) {
    console.log('No admin user found');
    process.exit(1);
  }
  const newPass = 'admin123';
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPass, salt);
  await user.save();
  console.log('Admin password reset to:', newPass);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
