#!/bin/sh

# Exit on error, treat unset variables as errors
set -eu

# Configuration (Optional: default to 'db' service if using Docker)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "--- Migration Process Started ---"

# 1. Check if the Database is reachable before running migrations
echo "Checking database connection at $DB_HOST:$DB_PORT..."

# Using nc (netcat) to check if the port is open
if ! nc -z "$DB_HOST" "$DB_PORT"; then
  echo "ERROR: Database is not reachable at $DB_HOST:$DB_PORT"
  exit 1
fi

# 2. Run migrations with captured output
echo "Running drizzle-kit migrate..."
if OUTPUT=$(npx drizzle-kit migrate 2>&1); then
  echo "SUCCESS: Migrations completed successfully!"
  echo "$OUTPUT" | grep -i "migrated" || true
else
  echo "FATAL: Migration failed!"
  echo "--------------------------"
  echo "$OUTPUT"
  echo "--------------------------"
  exit 1
fi

echo "--- Migration Process Finished ---"