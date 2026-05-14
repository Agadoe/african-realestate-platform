const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const seedUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'buyer',
    phone: '+233 20 123 4567',
    verified: true
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'agent',
    phone: '+233 24 987 6543',
    verified: true
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '+233 30 111 2222',
    verified: true
  },
  {
    firstName: 'Property',
    lastName: 'Owner',
    email: 'owner@example.com',
    password: 'owner123',
    role: 'owner',
    phone: '+233 50 123 4567',
    verified: true
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();

    console.log('Existing data cleared');

    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;