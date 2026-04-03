#!/bin/bash
# Quick Setup and Test Runner for AI Interview Agent

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        AI INTERVIEW AGENT - SETUP & TEST RUNNER            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js installed${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm installed${NC}"

# Navigate to server directory
cd "$(dirname "$0")/server"
echo ""
echo -e "${BLUE}📁 Working directory: $(pwd)${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
if npm install --silent; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Check environment
echo -e "${YELLOW}🔍 Checking environment...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "Please create .env file with:"
    echo "  PORT=8000"
    echo "  MONGODB_URL=<your-mongodb-url>"
    echo "  JWT_SECRET=<your-secret>"
    exit 1
fi

if grep -q "MONGODB_URL" .env; then
    echo -e "${GREEN}✓ MONGODB_URL configured${NC}"
else
    echo -e "${RED}❌ MONGODB_URL not configured in .env${NC}"
    exit 1
fi

if grep -q "JWT_SECRET" .env; then
    echo -e "${GREEN}✓ JWT_SECRET configured${NC}"
else
    echo -e "${RED}❌ JWT_SECRET not configured in .env${NC}"
    exit 1
fi
echo ""

# Menu
echo -e "${BLUE}What would you like to do?${NC}"
echo "1) Run local tests (quick validation)"
echo "2) Start server in development mode"
echo "3) Run all tests (local + integration)"
echo "4) Check system status"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🧪 Running local tests...${NC}"
        echo ""
        node tests/runTests.js
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🚀 Starting server in development mode...${NC}"
        echo ""
        echo -e "${GREEN}Server will run at http://localhost:8000${NC}"
        echo -e "${GREEN}Frontend connects to http://localhost:5173${NC}"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""
        npm run dev
        ;;
    3)
        echo ""
        echo -e "${YELLOW}🧪 Running local tests...${NC}"
        echo ""
        if node tests/runTests.js; then
            echo ""
            echo -e "${YELLOW}🚀 Starting server for integration tests...${NC}"
            npm start &
            SERVER_PID=$!
            sleep 3
            
            echo ""
            echo -e "${YELLOW}🧪 Running integration tests...${NC}"
            echo ""
            
            if bash tests/integrationTest.sh; then
                echo ""
                echo -e "${GREEN}✅ All tests passed!${NC}"
            else
                echo ""
                echo -e "${RED}❌ Integration tests failed${NC}"
            fi
            
            kill $SERVER_PID 2>/dev/null || true
        fi
        ;;
    4)
        echo ""
        echo -e "${YELLOW}🔍 Checking system status...${NC}"
        echo ""
        echo "Starting server..."
        npm start > /dev/null 2>&1 &
        SERVER_PID=$!
        sleep 2
        
        echo "Fetching status..."
        curl -s -X GET "http://localhost:8000/api/coding/debug/status" | python3 -m json.tool 2>/dev/null || \
        echo "Response: (Set PYTHONPATH or install python for pretty formatting)"
        
        kill $SERVER_PID 2>/dev/null || true
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
