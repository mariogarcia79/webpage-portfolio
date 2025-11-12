#!/bin/bash

cleanup() {
    kill %1 2>/dev/null
    kill %2 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

cd apps/backend
npm run dev &
BACKEND_PID=$!

sleep 3

cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✓ Backend running on http://localhost:4000${NC}"
echo -e "${GREEN}✓ Frontend running on http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to sigkill ${NC}"
echo ""

wait
