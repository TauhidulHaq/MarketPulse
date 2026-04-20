require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function run() {
  await connectDB();
  const username = 'admin';
  const user = await User.findOne({ username });
  if (!user) {
    console.log('No admin user found');
    process.exit(1);
  }
  const newPass = 'admin123';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPass, salt);
  await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
  console.log('Admin password updated to single-hash:', newPass);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
