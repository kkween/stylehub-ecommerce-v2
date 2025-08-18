require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Adjust the path below to your actual User model location
const User = require('./admin/controllers/adminController').User || require('./models/User');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname');
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
  }
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com',
    password: passwordHash,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user seeded.');
  mongoose.disconnect();
}

seedAdmin();
