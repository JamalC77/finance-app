#!/bin/bash
# Setup script for QuickBooks UI integration

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit

echo "Setting up QuickBooks UI components..."

# Install required packages
echo "Installing required packages..."
npm install chart.js react-chartjs-2 @headlessui/react @heroicons/react

# Check environment variables
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "# QuickBooks Integration" > .env.local
  echo "NEXT_PUBLIC_API_URL=http://localhost:5000" >> .env.local
  echo "Please update the .env.local file with your API URL."
fi

echo "Setup complete!"
echo "Next steps:"
echo "1. Update your .env.local file with the proper API URL"
echo "2. Start the application: npm run dev" 