#!/bin/sh

set -e

echo "Running migrations..."
npx drizzle-kit migrate
echo "Migrations completed successfully!"