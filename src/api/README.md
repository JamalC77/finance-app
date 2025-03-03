# API Documentation

This directory contains the backend API logic for the Finance App. It's organized to keep business logic separate from the Next.js routes while maintaining a monorepo structure.

## Directory Structure

- `controllers/`: Contains business logic for the API routes
- `services/`: Integrations with external services (Plaid, Stripe, etc.)
- `models/`: Data models and database interactions
- `utils/`: Helper utilities for the API

## Environment Variables

All sensitive information is managed through environment variables. **NEVER commit real secrets to the repository.**

1. Copy `.env.example` to `.env` in your local development environment
2. Fill in your actual API keys and secrets in the `.env` file
3. Use the `env.ts` utility to access environment variables in your code

Example:
```typescript
import { env } from '@/api/utils/env';

// Use environment variables safely
const apiKey = env.PLAID.CLIENT_ID;
```

## API Routes

The actual API routes are located in the Next.js App Router structure (`src/app/api/*`), but they should import and use the logic defined in this directory.

This separation allows for:
- Better organization of business logic
- Protection of sensitive information
- Potential for moving the API to a separate service later if needed

## Adding New API Services

When adding a new service integration:

1. Add required environment variables to `.env.example` (without real values)
2. Add the environment variables to your local `.env` file with real values
3. Update the `env.ts` file to include the new variables
4. Create a new service file in the `services/` directory
5. Create corresponding API routes using the Next.js App Router

## Development Guidelines

- Never hardcode sensitive information
- Use the environment utility for all sensitive information
- Keep the API directory structure clean and organized
- Document all new services and endpoints 