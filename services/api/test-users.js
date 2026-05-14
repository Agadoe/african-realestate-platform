const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/database');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const testUsers = async () => {
  try {
    console.log('Testing user functionality...');

    // Find all users
    const users = await User.find();
    console.log(`Found ${users.length} users:`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} - ${user.role}`);
    });

    // Find owner users specifically
    const owners = await User.find({ role: 'owner' });
    console.log(`\nFound ${owners.length} owner users:`);

    owners.forEach((owner, index) => {
      console.log(`${index + 1}. ${owner.firstName} ${owner.lastName} - ${owner.email}`);
    });

    console.log('\n✓ User functionality test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error testing user functionality:', error);
    process.exit(1);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testUsers();
}

module.exports = testUsers;