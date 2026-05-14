#!/bin/bash

# African Real Estate Platform - Development Startup Script

echo "🚀 Starting African Real Estate Platform Development Environment"

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if ! docker ps | grep -q mongodb; then
    echo "🔄 Starting MongoDB container..."
    docker start mongodb 2>/dev/null || docker run -d -p 27017:27017 --name mongodb mongo:latest
    sleep 5
fi

echo "✅ MongoDB is running"

# Install dependencies if needed
echo "📦 Installing dependencies..."

# Backend
echo "🔧 Installing backend dependencies..."
cd services/api
npm install

# Frontend
echo "🎨 Installing frontend dependencies..."
cd ../../apps/web
npm install

cd ../..

# Seed database if empty
echo "🌱 Seeding database..."
cd services/api
npm run seed-simple

# Start services
echo "🚀 Starting services..."

# Start backend in background
echo "🖥️  Starting backend API server..."
npm run dev > /tmp/african-realestate-backend.log 2>&1 &
BACKEND_PID=$!

# Start frontend
echo "🌐 Starting frontend web app..."
cd ../../apps/web
npm run dev > /tmp/african-realestate-frontend.log 2>&1 &
FRONTEND_PID=$!

cd ../..

echo "✅ Backend running on http://localhost:3001"
echo "✅ Frontend running on http://localhost:3000"
echo "🎯 Open http://localhost:3000 in your browser to access the application"

# Cleanup function
cleanup() {
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Trap exit signals
trap cleanup EXIT INT TERM

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID