#!/bin/bash

# Start PocketBase and SvelteKit dev servers concurrently

cleanup() {
  echo "Stopping servers..."
  kill "$PB_PID" "$WEB_PID" 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "Starting PocketBase..."
./backend/pocketbase serve &
PB_PID=$!

echo "Starting SvelteKit..."
cd web && npm run dev &
WEB_PID=$!

wait "$PB_PID" "$WEB_PID"
