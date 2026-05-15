# African Real Estate Platform - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the African Real Estate Platform, with special focus on the property owner listing functionality that allows property owners to list their properties directly without requiring an agent.

## Prerequisites

- Node.js 16.x or higher
- MongoDB 4.4 or higher
- Docker (recommended for MongoDB)
- npm or yarn package manager

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd african-realestate-platform
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd services/api
npm install

# Install frontend dependencies
cd ../../apps/web
npm install
```

### 3. Configure Environment Variables

Copy the example environment files and configure your settings:

```bash
# Backend API
cd services/api
cp .env.example .env
# Edit .env with your configuration

# Frontend Web App
cd apps/web
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start MongoDB

Using Docker (recommended):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Or start your local MongoDB service.

### 5. Seed the Database

```bash
cd services/api
npm run seed-simple
```

### 6. Start the Services

```bash
# Start backend API (from services/api directory)
npm run dev

# Start frontend web app (from apps/web directory)
npm run dev
```

### 7. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Property Owner Listing Functionality

### Key Features

1. **Owner Registration**: Property owners can register with the 'owner' role
2. **Listing Creation**: Comprehensive form for creating property listings
3. **Listing Management**: Dashboard to manage all property listings
4. **Performance Tracking**: View listing performance metrics
5. **Image Management**: Upload and manage multiple property images
6. **Feature/Amenity Management**: Dynamic addition and removal of features

### User Workflow

1. **Registration**: Owners register with 'owner' role
2. **Login**: Owners login to access their dashboard
3. **Create Listing**: Use the PropertyListingForm to create property listings
4. **Manage Listings**: View, edit, and delete their property listings

### Testing Owner Functionality

```bash
# Test user roles including owners
cd services/api
npm run test-users

# Test owner listing functionality
npm run test-owner
```

## Deployment

### Production Deployment Options

#### Option 1: Docker Compose (Recommended)
The easiest way to deploy the entire platform is using Docker Compose:

```bash
# Navigate to project root
cd african-realestate-platform

# Start all services
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

#### Option 2: Manual Deployment

1. **Frontend**:
   ```bash
   cd apps/web
   npm run build
   # Deploy to Vercel, Netlify, or your preferred hosting platform
   ```

2. **Backend**:
   ```bash
   cd services/api
   npm run build
   # Deploy to Heroku, AWS, or your preferred hosting platform
   ```

3. **Database**:
   - Set up MongoDB Atlas or your preferred MongoDB hosting
   - Configure connection string in production environment variables
   - Run seed script if needed

### Environment Configuration for Production

Ensure all environment variables are properly configured for production:
- Use strong JWT secret keys
- Configure proper MongoDB authentication
- Set up SSL certificates for HTTPS
- Configure proper CORS settings
- Set up email service for notifications
- Configure payment processing (Stripe) with production keys

## API Endpoints for Owner Listings

- `POST /api/properties` - Create property listing (authenticated owners)
- `PUT /api/properties/:id` - Update property listing (owner or agent)
- `DELETE /api/properties/:id` - Delete property listing (owner or agent)
- `GET /api/properties?ownerId=:id` - Fetch owner's property listings

## Security Considerations

- Role-based access control ensures only authorized users can modify properties
- Owners can only modify properties they own
- Agents can only modify properties they've listed
- Admins have full access for moderation
- Data validation and sanitization on both frontend and backend
- Password hashing with bcrypt for secure user authentication
- JWT tokens for secure session management

## Conclusion

The African Real Estate Platform provides a comprehensive solution for property owners to list their properties directly, creating a more inclusive and accessible real estate marketplace for the African market. The owner listing functionality has been thoroughly tested and is ready for production deployment.