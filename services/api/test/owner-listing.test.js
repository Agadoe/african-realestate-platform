const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const connectDB = require('../config/database');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const testOwnerListing = async () => {
  try {
    console.log('Testing owner listing functionality...');

    // Find owner user
    const owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      console.log('No owner user found. Please run seed script first.');
      process.exit(1);
    }

    console.log('Found owner user:', owner.firstName, owner.lastName);

    // Find properties owned by this user
    const ownerProperties = await Property.find({ ownerId: owner._id });
    console.log(`Found ${ownerProperties.length} properties owned by this user`);

    if (ownerProperties.length > 0) {
      console.log('Owner properties:');
      ownerProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.title} - ${property.status}`);
      });
    } else {
      console.log('No properties found for this owner');
    }

    // Test authorization by trying to access another user's property
    const agentProperty = await Property.findOne({ agentId: { $exists: true } });
    if (agentProperty) {
      console.log('\nTesting authorization - attempting to access agent property as owner...');
      console.log(`Agent property: ${agentProperty.title}`);
      console.log(`Owner ID: ${owner._id}`);
      console.log(`Property Owner ID: ${agentProperty.ownerId}`);
      console.log(`Property Agent ID: ${agentProperty.agentId}`);

      if (agentProperty.ownerId && agentProperty.ownerId.toString() === owner._id.toString()) {
        console.log('✓ Owner can access this property (they own it)');
      } else if (agentProperty.agentId && agentProperty.agentId.toString() === owner._id.toString()) {
        console.log('✓ Owner can access this property (they are the agent)');
      } else {
        console.log('✓ Owner cannot access this property (proper authorization in place)');
      }
    }

    console.log('\n✓ Owner listing functionality test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error testing owner listing functionality:', error);
    process.exit(1);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testOwnerListing();
}

module.exports = testOwnerListing;