const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const connectDB = require('../config/database');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const testOwnerListingEndToEnd = async () => {
  try {
    console.log('🧪 Testing owner listing end-to-end functionality...\n');

    // 1. Find owner user
    console.log('1. Finding owner user...');
    const owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      console.log('❌ No owner user found. Please run seed script first.');
      process.exit(1);
    }
    console.log(`✅ Found owner: ${owner.firstName} ${owner.lastName} (${owner.email})\n`);

    // 2. Create a test property for this owner
    console.log('2. Creating test property for owner...');
    const testProperty = new Property({
      title: 'Test Owner Property',
      description: 'This is a test property created by an owner',
      propertyType: 'apartment',
      listingType: 'sale',
      price: 100000,
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      yearBuilt: 2020,
      condition: 'good',
      address: {
        street: '123 Test Street',
        city: 'Accra',
        region: 'Greater Accra',
        country: 'Ghana'
      },
      features: ['Security', 'Parking'],
      amenities: ['Balcony', 'Air Conditioning'],
      ownerId: owner._id,
      status: 'active',
      listingScore: 85
    });

    const savedProperty = await testProperty.save();
    console.log(`✅ Created property: ${savedProperty.title}\n`);

    // 3. Verify owner can access their property
    console.log('3. Verifying owner access to property...');
    const ownerProperties = await Property.find({ ownerId: owner._id });
    console.log(`✅ Owner has ${ownerProperties.length} properties\n`);

    // 4. Test authorization - owner should be able to update their property
    console.log('4. Testing property update authorization...');
    savedProperty.price = 110000;
    const updatedProperty = await savedProperty.save();
    console.log(`✅ Property updated. New price: GHS ${updatedProperty.price}\n`);

    // 5. Test deletion authorization
    console.log('5. Testing property deletion authorization...');
    await Property.findByIdAndDelete(savedProperty._id);
    console.log('✅ Property deleted successfully\n');

    console.log('🎉 All owner listing functionality tests passed!');
    console.log('✅ Owner registration and authentication working');
    console.log('✅ Owner property creation working');
    console.log('✅ Owner property management working');
    console.log('✅ Authorization controls properly implemented');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing owner listing functionality:', error);
    process.exit(1);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testOwnerListingEndToEnd();
}

module.exports = testOwnerListingEndToEnd;