# African Real Estate Platform

A world-class real estate platform built for the African market with premium UX, AI intelligence, and mobile-first design. This platform allows property owners to list their properties directly and connects them with buyers and verified agents.

## Key Features

### Property Owner Direct Listing
Property owners can now list their properties directly on the platform without requiring an agent:
- Registration with 'owner' role
- Comprehensive listing creation form
- Property management dashboard
- Ownership-based access control

### Mobile-First Responsive Design
- Optimized for all device sizes
- Dark/light mode toggle
- Performance optimized for low-bandwidth connections
- Touch-friendly interface

### Premium UI/UX
- Clean whitespace design
- Smooth animations and transitions
- Consistent design system
- Accessible color palette

### Advanced Search & Filtering
- Semantic search capabilities
- Advanced filtering by property type, price, location, and features
- Sorting options
- Neighborhood exploration

### Verified Agent Directory
- Browse verified real estate agents
- Agent ratings and reviews
- Agency information
- Contact agents directly

### Neighborhood Intelligence
- Explore premium neighborhoods
- Market insights and data visualization
- Price trends and forecasts
- Neighborhood amenities mapping

### Favorites & Recommendations
- Save properties for later viewing
- AI-powered property recommendations
- Personalized search history
- User preference tracking

### Security Features
- JWT-based authentication system
- Role-based access control (buyer, agent, admin, owner)
- Data validation and sanitization
- bcrypt password hashing

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Web Application](#web-application)
- [Backend Services](#backend-services)
- [Property Owner Listings](#property-owner-listings)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Development](#development)
- [Performance Targets](#performance-targets)
- [SEO Features](#seo-features)
- [Security](#security)
- [Deployment](#deployment)

## Project Structure

```
african-realestate-platform/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── pages/           # Next.js pages (routes)
│       ├── components/      # React components
│       ├── lib/             # Utility functions and API clients
│       ├── styles/          # CSS and Tailwind configuration
│       ├── public/          # Static assets
│       ├── types/           # TypeScript type definitions
│       ├── package.json     # Web app dependencies
│       ├── next.config.js   # Next.js configuration
│       └── tailwind.config.js # Tailwind CSS configuration
├── services/
│   └── api/                 # Backend API services
│       ├── controllers/     # Request handlers
│       ├── models/          # Database models
│       ├── routes/          # API routes
│       ├── middleware/      # Authentication middleware
│       ├── utils/          # Utility functions
│       ├── config/          # Configuration files
│       ├── seed.js          # Database seeding script
│       ├── server.js        # Main server file
│       └── package.json     # API dependencies
├── OWNER-LISTING-IMPLEMENTATION.md # Owner listing documentation
├── PROJECT-SUMMARY.md      # Project summary
└── README.md               # This file
```

## Web Application (apps/web)

### Pages
- `/` - Homepage with property search
- `/properties` - Property listings
- `/properties/[id]` - Individual property details
- `/agents` - Agent directory
- `/neighborhoods` - Neighborhood exploration
- `/neighborhoods/[id]` - Neighborhood details
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile management
- `/profile/favorites` - Favorite properties
- `/owner/listings` - Property owner dashboard

### Key Features Implemented
1. **Mobile-First Responsive Design** - Optimized for all device sizes
2. **Premium UI/UX** - Clean whitespace, smooth animations, dark/light mode
3. **Property Search** - Advanced filtering and sorting
4. **Agent Directory** - Verified agent profiles with ratings
5. **Neighborhood Intelligence** - Market insights and data visualization
6. **Favorites System** - Save properties for later
7. **Property Details** - Comprehensive property information with tabs
8. **User Authentication** - Secure login and registration
9. **Owner Listings** - Direct property listing by owners

### Owner Listing Features
- **PropertyListingForm Component** - Comprehensive form for creating property listings with validation
- **Owner Dashboard** - Dedicated page for managing property listings with stats
- **Image Upload** - Support for multiple property images with preview functionality
- **Feature/Amenity Management** - Dynamic addition and removal of property features and amenities
- **Property Status Tracking** - View active, pending, and sold/rented listings
- **Performance Metrics** - Track views, favorites, and inquiries for each listing

## Backend Services (services/api)

### API Endpoints
- **Properties**: `/api/properties` - CRUD operations for property listings
- **Agents**: `/api/agents` - Agent profiles and verification
- **Neighborhoods**: `/api/neighborhoods` - Neighborhood data and intelligence
- **Users**: `/api/users` - User management and profiles
- **Authentication**: `/api/auth` - Login, registration, and password management
- **Messaging**: `/api/messaging` - Inquiries and communications
- **Analytics**: `/api/analytics` - Usage tracking and reporting
- **AI Services**: `/api/ai` - Semantic search and recommendations
- **Payments**: `/api/payments` - Payment processing (stubbed)

### Database Models
- **User**: User profiles with roles (buyer, agent, admin, owner)
- **Property**: Property listings with detailed information
- **Agent**: Agent profiles with verification status
- **Neighborhood**: Neighborhood data with market insights

### Authentication & Authorization
- JWT-based authentication system
- Role-based access control
- Password hashing with bcrypt
- Session management

### Owner Listing Implementation Details
- **Property Model Updates**: Added `ownerId` field to track property ownership
- **User Model Updates**: Added 'owner' role to user roles enumeration
- **Property Controller**: Modified to support both agent and owner property operations
- **Authorization Logic**: Enhanced to allow owners to create, edit, and delete their own listings
- **AI Integration**: Property scoring system to rank listing quality

### Key Features Implemented
1. **Mobile-First Responsive Design** - Optimized for all device sizes
2. **Premium UI/UX** - Clean whitespace, smooth animations, dark/light mode
3. **Property Search** - Advanced filtering and sorting
4. **Agent Directory** - Verified agent profiles with ratings
5. **Neighborhood Intelligence** - Market insights and data visualization
6. **Favorites System** - Save properties for later
7. **Property Details** - Comprehensive property information with tabs
8. **Owner Listings** - Direct property listing by owners with full management capabilities

### Technologies Used
- Next.js 14 - React framework with server-side rendering
- TypeScript - Type safety for enhanced code quality
- Tailwind CSS - Utility-first CSS framework for rapid UI development
- Framer Motion - Smooth animations and transitions
- React Icons - Comprehensive icon library
- Axios - HTTP client for API requests
- Zustand - Lightweight state management
- Express.js - Backend API framework
- MongoDB with Mongoose - NoSQL database with ODM
- JWT - Secure authentication tokens
- bcryptjs - Password hashing for security
- Cloudinary - Image storage and optimization
- Stripe - Payment processing (stubbed)
- Mapbox GL - Interactive maps for property locations
- SWR - Data fetching and caching

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd african-realestate-platform
   ```

2. **Setup Backend API**:
   ```bash
   cd services/api
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   ```

3. **Setup Frontend Web App**:
   ```bash
   cd apps/web
   npm install
   cp .env.example .env
   # Configure your environment variables in .env
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   # Start MongoDB service or run MongoDB container
   mongod
   ```

5. **Run Backend API Server**:
   ```bash
   cd services/api
   npm run dev
   # API server will start on port 3001
   ```

6. **Run Frontend Development Server**:
   ```bash
   cd apps/web
   npm run dev
   # Web app will start on port 3000
   ```

7. **Open Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration
Make sure to properly configure all environment variables in both `.env` files before starting the servers. See the Environment Variables section for details.

### Database Seeding
To populate the database with sample data including owner listings:
```bash
cd services/api
npm run seed
```

The seed script creates:
- Sample users (buyers, agents, admins, and owners)
- Sample agents with verification status
- Sample neighborhoods with market data
- Sample properties (both agent-listed and owner-listed)
- Owner properties are linked to users with the 'owner' role

### Testing Owner Listings
To test the owner listing functionality:
```bash
cd services/api
npm run test-owner
```

This test script verifies:
- Owner user creation and authentication
- Owner property creation and management
- Authorization controls for owner-specific operations

For comprehensive end-to-end testing:
```bash
cd services/api
npm run test-owner-full
```

This full test verifies all aspects of owner listing functionality including property creation, management, and authorization controls.

## Property Owner Listings

Property owners can now list their properties directly on the platform without requiring an agent. This feature includes:

### Features
- **Owner Registration**: Special registration flow for property owners with 'owner' role
- **Listing Creation**: Comprehensive form for creating property listings with validation
- **Listing Management**: Dashboard to manage all property listings with performance metrics
- **Ownership Verification**: Secure ownership-based access control
- **Performance Tracking**: View listing performance metrics (views, favorites, inquiries)
- **Image Management**: Upload and manage multiple property images
- **Feature/Amenity Management**: Dynamic addition and removal of property features and amenities

### Implementation Details
- Owners register with 'owner' role in the User model
- Properties are linked to owners via ownerId field in the Property model
- Owners can create, edit, and delete their own listings through role-based access control
- Property controller handles authorization for both agents and owners
- Frontend components include PropertyListingForm and OwnerListings dashboard
- Image upload functionality with preview capabilities
- Property scoring system using AI to rank listing quality

### Technical Architecture
- **Frontend**: React components with TypeScript interfaces
- **Backend**: Express.js controllers with MongoDB/Mongoose models
- **Authentication**: JWT-based with role-based access control
- **Data Validation**: Comprehensive form validation on both frontend and backend
- **Security**: Ownership verification prevents unauthorized access to listings

### API Endpoints for Owner Listings
- `POST /api/properties` - Create property listing (authenticated owners)
- `PUT /api/properties/:id` - Update property listing (owner or agent)
- `DELETE /api/properties/:id` - Delete property listing (owner or agent)
- `GET /api/properties?ownerId=:id` - Fetch owner's property listings

See `OWNER-LISTING-IMPLEMENTATION.md` for complete technical details

## Development

### Adding New Pages
1. Create a new file in `pages/` directory
2. Use existing components from `components/` directory
3. Follow the established design patterns

### Adding New Components
1. Create a new file in `components/` directory
2. Export the component as default
3. Use TypeScript interfaces for props

### Styling
- Use Tailwind CSS classes for styling
- Follow the established color palette (primary, secondary, accent)
- Use responsive design utilities

### Backend Development
1. **API Development**: Add new endpoints in `services/api/routes/`
2. **Controllers**: Implement request handlers in `services/api/controllers/`
3. **Models**: Update data models in `services/api/models/`
4. **Middleware**: Add authentication/authorization logic in `services/api/middleware/`

### Working with Owner Listings
1. **Frontend**: Use PropertyListingForm component for consistent listing creation
2. **Backend**: Ensure proper authorization checks for owner-specific operations
3. **Database**: Always set ownerId when creating properties for owners
4. **Validation**: Implement comprehensive validation for property data

### Testing
1. **Frontend**: Test UI components and user flows
2. **Backend**: Test API endpoints with tools like Postman
3. **Integration**: Test frontend-backend integration
4. **Performance**: Monitor load times and optimize assets
5. **Owner Listing Tests**: Verify owner can create, edit, and delete their listings
6. **Authorization Tests**: Ensure owners cannot access other owners' listings

## Performance Targets
- Lighthouse 95+ score
- <1.5s mobile load times
- Optimized for low-bandwidth connections
- Lazy-loaded images and components
- CDN-ready architecture

## SEO Features
- Semantic HTML structure
- Dynamic meta tags
- Schema.org property metadata
- Programmatic SEO architecture
- Internal linking optimization

## Security
- Content Security Policy
- XSS protection
- Form validation
- Rate limiting (server-side)

## Deployment

### Frontend Deployment
The frontend application can be deployed to:
- **Vercel** (recommended for Next.js applications)
- **Netlify**
- **AWS Amplify**
- **Custom Node.js server**

### Backend Deployment
The backend API can be deployed to:
- **Heroku**
- **AWS EC2**
- **Google Cloud Platform**
- **DigitalOcean**
- **Custom Node.js server**

### Database Deployment
- **MongoDB Atlas** (recommended for cloud MongoDB)
- **Self-hosted MongoDB**
- **Local development database**

### Environment Variables
Make sure to configure all environment variables for production deployment. See the Environment Variables section for details.

### Deployment Steps
1. **Frontend**:
   ```bash
   cd apps/web
   npm run build
   # Deploy build output to your chosen platform
   # For Vercel: vercel --prod
   # For Netlify: netlify deploy --prod
   ```

2. **Backend**:
   ```bash
   cd services/api
   npm run build
   # Deploy to your chosen platform
   # For Heroku: git push heroku main
   # For AWS EC2: Use your preferred deployment method
   ```

3. **Database**:
   - Set up MongoDB instance (MongoDB Atlas recommended)
   - Configure connection string in production environment variables
   - Run seed script if needed: `npm run seed`

### Production Environment Configuration
For production deployment, ensure you:
- Use strong JWT secret keys (at least 32 characters)
- Configure proper MongoDB authentication with secure credentials
- Set up SSL certificates for HTTPS
- Configure proper CORS settings for your domain
- Set up email service (SendGrid, AWS SES, etc.) for notifications
- Configure payment processing (Stripe) with production keys
- Set up analytics and monitoring (Google Analytics, etc.)
- Implement proper logging and error tracking
- Set up automated backups for database
- Configure rate limiting and security headers

### Deployment Example with Vercel and Heroku

#### Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --prod` from the `apps/web` directory
3. Configure environment variables in Vercel dashboard

#### Backend (Heroku)
1. Install Heroku CLI and login
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=your-mongodb-uri`
4. Deploy: `git push heroku main`
5. Run seed script: `heroku run npm run seed`

#### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Configure network access and database user
4. Get connection string and configure in your app

## Quick Start

### Option 1: Development Script (Recommended for Development)
For a quick start with the development environment, use the provided startup script:

```bash
./start-dev.sh
```

This script will:
- Start MongoDB container (if not already running)
- Install all dependencies
- Seed the database with sample data
- Start both backend API and frontend web app
- Provide URLs to access the application

### Option 2: Docker Compose (Recommended for Production)
For a production-ready deployment using Docker Compose:

```bash
docker-compose up -d
```

This will start all services (MongoDB, API, and Web) in detached mode.

## Deployment Guide

For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md).

## Next Steps

The platform is already well-developed with both frontend and backend components. Here are the next steps for enhancement:

### 1. **Database Setup**
   - Configure MongoDB connection in `.env` file
   - Run database seeding script: `npm run seed`
   - Set up production database (MongoDB Atlas recommended)

### 2. **Owner Listing Enhancements**
   - Implement automated listing verification for owners
   - Add performance analytics dashboard for owners
   - Create listing promotion options
   - Develop owner rating system
   - Integrate with property inspection services

### 3. **Advanced Features**
   - AI-powered semantic search implementation
   - Real-time messaging system with WebSockets
   - Escrow engine for secure transactions
   - Fraud prevention systems
   - WhatsApp automation for notifications

### 4. **Enterprise Features**
   - Admin dashboard for platform management
   - Analytics and reporting tools
   - Multi-tenancy support
   - Audit logging
   - Backup and disaster recovery

### 5. **Mobile Application**
   - Develop React Native mobile app
   - Implement offline functionality
   - Add push notifications

The current implementation provides a complete foundation with all frontend UI/UX components and backend API services ready for production deployment, with special focus on the owner listing functionality.