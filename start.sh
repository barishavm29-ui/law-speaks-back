#!/bin/bash
set -e

cd /app/backend
uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cd /app/frontend
npm run start -- -p "${PORT:-3000}" &
FRONTEND_PID=$!

wait -n "$BACKEND_PID" "$FRONTEND_PID"
exit $?
