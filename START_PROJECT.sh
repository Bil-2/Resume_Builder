#!/bin/bash

# =====================================================
# 🚀 RESUME BUILDER - STARTUP SCRIPT
# =====================================================
# This script ensures everything starts correctly
# Run this after months or years - it will work!
# =====================================================

echo "🚀 Starting Resume Builder Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

echo "📋 Checking Prerequisites..."
echo ""

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found! Please install Node.js v16+${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: v$NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found!${NC}"
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    MONGO_VERSION=$(mongod --version | head -1)
    echo -e "${GREEN}✅ MongoDB: Installed${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found locally${NC}"
    echo "   You can:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔧 Checking Configuration..."
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found${NC}"
    if [ -f "backend/.env.example" ]; then
        echo "   Creating .env from .env.example..."
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANT: Edit backend/.env and set your MongoDB URI and JWT_SECRET${NC}"
        read -p "   Press Enter to continue..."
    else
        echo -e "${RED}❌ backend/.env.example not found!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ backend/.env exists${NC}"
fi

echo ""
echo "📦 Checking Dependencies..."
echo ""

# Check backend node_modules
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "   Installing backend dependencies..."
    cd backend && npm install && cd ..
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

# Check frontend node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "   Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

echo ""
echo "🔍 Checking Ports..."
echo ""

# Check if ports are available
if port_in_use 5001; then
    echo -e "${RED}❌ Port 5001 is already in use${NC}"
    echo "   Backend needs port 5001"
    echo "   Kill the process using: lsof -i :5001 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
    exit 1
else
    echo -e "${GREEN}✅ Port 5001 is available (Backend)${NC}"
fi

if port_in_use 3000; then
    echo -e "${RED}❌ Port 3000 is already in use${NC}"
    echo "   Frontend needs port 3000"
    echo "   Kill the process using: lsof -i :3000 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
    exit 1
else
    echo -e "${GREEN}✅ Port 3000 is available (Frontend)${NC}"
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "========================================="
echo "🚀 STARTING APPLICATION"
echo "========================================="
echo ""
echo "You need to open 3 terminals:"
echo ""
echo "Terminal 1 - MongoDB:"
echo -e "${YELLOW}  mkdir -p data/db && mongod --dbpath ./data/db${NC}"
echo ""
echo "Terminal 2 - Backend:"
echo -e "${YELLOW}  cd backend && npm run dev${NC}"
echo ""
echo "Terminal 3 - Frontend:"
echo -e "${YELLOW}  cd frontend && npm run dev${NC}"
echo ""
echo "Then open: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "========================================="
echo ""

read -p "Do you want me to start the backend now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting Backend..."
    echo "Note: Start MongoDB first in another terminal!"
    echo ""
    cd backend && npm run dev
fi
