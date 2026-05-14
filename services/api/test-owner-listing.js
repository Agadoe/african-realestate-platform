// Test script for owner property listing functionality
const axios = require('axios');

// API base URL
const API_BASE = 'http://localhost:3001/api';

// Test user credentials
const testOwner = {
  firstName: 'Property',
  lastName: 'Owner',
  email: 'owner@test.com',
  password: 'test123',
  role: 'owner'
};

// Test property data
const testProperty = {
  title: 'Test Property Listing',
  description: 'This is a test property listing created by an owner',
  propertyType: 'apartment',
  listingType: 'sale',
  price: 100000,
  currency: 'GHS',
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  areaUnit: 'sqm',
  yearBuilt: 2020,
  condition: 'good',
  address: {
    street: '123 Test Street',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana'
  },
  features: ['Parking', 'Security'],
  amenities: ['Balcony', 'Kitchen'],
  status: 'active'
};

let authToken = '';
let ownerId = '';
let propertyId = '';

async function runTests() {
  try {
    console.log('🧪 Starting property owner listing tests...\n');

    // 1. Register a new owner
    console.log('1. Registering new property owner...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testOwner);
    console.log('   ✅ Registration successful');
    console.log('   User ID:', registerResponse.data.user._id);

    ownerId = registerResponse.data.user._id;
    authToken = registerResponse.data.token;

    // 2. Create a property listing
    console.log('\n2. Creating property listing...');
    const createResponse = await axios.post(`${API_BASE}/properties`, testProperty, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('   ✅ Property listing created successfully');
    console.log('   Property ID:', createResponse.data._id);

    propertyId = createResponse.data._id;

    // 3. Get the property listing
    console.log('\n3. Retrieving property listing...');
    const getResponse = await axios.get(`${API_BASE}/properties/${propertyId}`);
    console.log('   ✅ Property listing retrieved successfully');
    console.log('   Property title:', getResponse.data.title);

    // 4. Update the property listing
    console.log('\n4. Updating property listing...');
    const updateData = {
      price: 110000,
      description: 'Updated test property listing with new price'
    };

    const updateResponse = await axios.put(`${API_BASE}/properties/${propertyId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('   ✅ Property listing updated successfully');
    console.log('   New price:', updateResponse.data.price);

    // 5. Get owner's listings
    console.log('\n5. Retrieving owner\'s listings...');
    // This would typically be a custom endpoint or filtered property search
    console.log('   ℹ️  In a full implementation, this would show all properties owned by this user');

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Owner registration: ✅');
    console.log('   - Property creation: ✅');
    console.log('   - Property retrieval: ✅');
    console.log('   - Property update: ✅');
    console.log('   - Owner listing management: ℹ️  (Partially implemented)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log('   💡 Hint: Make sure the backend server is running on port 3001');
    } else if (error.response?.status === 403) {
      console.log('   💡 Hint: Check if the user has proper permissions');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Hint: Make sure the API server is running');
    }
  }
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests };