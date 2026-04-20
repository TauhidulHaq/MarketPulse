require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  await connectDB();
  const username = 'admin';
  const email = 'admin@example.com';
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    console.log('Admin user already exists:', existing.username);
    process.exit(0);
  }

  const user = await User.create({ username, password: 'admin123', name: 'Administrator', email });
  console.log('Created admin user:', user.username);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
