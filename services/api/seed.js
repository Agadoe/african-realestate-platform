const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Agent = require('./models/Agent');
const Neighborhood = require('./models/Neighborhood');
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

const seedAgents = [
  {
    licenseNumber: 'AG123456',
    agencyName: 'Premium Real Estate',
    bio: 'Experienced real estate agent with over 10 years in the Ghanaian market.',
    commissionRate: 5.5,
    rating: 4.8,
    reviewCount: 42,
    specialties: ['Luxury Properties', 'Investment', 'Commercial'],
    verificationStatus: 'verified'
  },
  {
    licenseNumber: 'AG789012',
    agencyName: 'Urban Properties Ltd',
    bio: 'Specializing in residential properties across Accra and Kumasi.',
    commissionRate: 4.8,
    rating: 4.9,
    reviewCount: 38,
    specialties: ['Residential', 'First-time Buyers', 'Rentals'],
    verificationStatus: 'verified'
  }
];

const seedNeighborhoods = [
  {
    name: 'Airport Residential Area',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    description: 'One of Accra\'s most prestigious neighborhoods with excellent security and modern infrastructure.',
    coordinates: {
      type: 'Polygon',
      coordinates: [[
        [-0.190, 5.605],
        [-0.185, 5.605],
        [-0.185, 5.610],
        [-0.190, 5.610],
        [-0.190, 5.605]
      ]],
      bounds: {
        northeast: { lat: 5.610, lng: -0.185 },
        southwest: { lat: 5.605, lng: -0.190 }
      }
    },
    amenities: ['International Schools', 'Private Hospitals', 'Shopping Malls', '24/7 Security'],
    safetyScore: 9.2,
    infrastructureScore: 9.5,
    appreciationRate: 8.5,
    propertyCount: 142
  },
  {
    name: 'East Legon',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
    description: 'Upscale residential area popular with expatriates and affluent locals.',
    coordinates: {
      type: 'Polygon',
      coordinates: [[
        [-0.175, 5.595],
        [-0.170, 5.595],
        [-0.170, 5.600],
        [-0.175, 5.600],
        [-0.175, 5.595]
      ]],
      bounds: {
        northeast: { lat: 5.600, lng: -0.170 },
        southwest: { lat: 5.595, lng: -0.175 }
      }
    },
    amenities: ['Golf Course', 'Restaurants', 'Gyms', 'Parks'],
    safetyScore: 8.8,
    infrastructureScore: 9.0,
    appreciationRate: 12.3,
    propertyCount: 89
  }
];

const seedProperties = [
  {
    title: 'Luxury 3-Bedroom Apartment',
    description: 'Stunning luxury apartment with breathtaking ocean views. This modern 3-bedroom apartment features high-end finishes, spacious living areas, and premium amenities.',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 150000,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    yearBuilt: 2020,
    condition: 'new',
    address: {
      street: '123 Ocean View Road',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: {
        type: 'Point',
        coordinates: [-0.188, 5.607]
      }
    },
    features: ['Swimming Pool', 'Gym', '24/7 Security', 'Parking'],
    amenities: ['Balcony', 'Air Conditioning', 'Modern Kitchen', 'Laundry Room'],
    status: 'active',
    listingScore: 92
  },
  {
    title: 'Modern 4-Bedroom Villa',
    description: 'Beautiful modern villa in the heart of East Legon. Features spacious rooms, modern kitchen, and private garden.',
    propertyType: 'villa',
    listingType: 'sale',
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    yearBuilt: 2018,
    condition: 'excellent',
    address: {
      street: '456 Villa Avenue',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: {
        type: 'Point',
        coordinates: [-0.172, 5.598]
      }
    },
    features: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
    amenities: ['Balcony', 'Fireplace', 'Modern Kitchen', 'Laundry Room'],
    status: 'active',
    listingScore: 88
  },
  {
    title: 'Self-Listed Luxury Penthouse',
    description: 'Beautiful penthouse apartment listed directly by the owner. Features panoramic city views, high-end finishes, and premium amenities.',
    propertyType: 'penthouse',
    listingType: 'sale',
    price: 320000,
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    yearBuilt: 2019,
    condition: 'excellent',
    address: {
      street: '789 Skyline Boulevard',
      city: 'Accra',
      region: 'Greater Accra',
      country: 'Ghana',
      coordinates: {
        type: 'Point',
        coordinates: [-0.185, 5.602]
      }
    },
    features: ['Rooftop Terrace', 'Gym', 'Concierge', 'Parking'],
    amenities: ['Balcony', 'Air Conditioning', 'Modern Kitchen', 'Laundry Room', 'Smart Home'],
    status: 'active',
    listingScore: 95
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Agent.deleteMany();
    await Neighborhood.deleteMany();

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

    // Create agents and link to users
    const agentsWithUserIds = seedAgents.map((agent, index) => ({
      ...agent,
      userId: createdUsers[index + 1]._id // Link to agent users
    }));

    const createdAgents = await Agent.insertMany(agentsWithUserIds);
    console.log(`Created ${createdAgents.length} agents`);

    // Create neighborhoods
    const createdNeighborhoods = await Neighborhood.insertMany(seedNeighborhoods);
    console.log(`Created ${createdNeighborhoods.length} neighborhoods`);

    // Create properties and link to agents or owners
    const propertiesWithUserIds = seedProperties.map((property, index) => {
      // Last property is owned by the owner user
      if (index === seedProperties.length - 1) {
        return {
          ...property,
          ownerId: createdUsers[3]._id, // Link to owner user
          neighborhoodId: createdNeighborhoods[index % createdNeighborhoods.length]._id
        };
      } else {
        // First properties are linked to agents
        return {
          ...property,
          agentId: createdAgents[index % createdAgents.length]._id,
          neighborhoodId: createdNeighborhoods[index % createdNeighborhoods.length]._id
        };
      }
    });

    const createdProperties = await Property.insertMany(propertiesWithUserIds);
    console.log(`Created ${createdProperties.length} properties`);

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