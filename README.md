# CFO Line Frontend

This is the frontend for CFO Line, built with Next.js.

## Project Structure

```
cfo-line/
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   ├── lib/             # Shared utilities and API clients
│   └── styles/          # CSS and styling
├── public/              # Static assets
└── .env.example         # Example environment variables
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Finance App API running (see [API README](../finance-app-api/README.md))

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
4. Edit the `.env.local` file with your configuration

### Development

Start the development server:

```
npm run dev
```

The application will run on http://localhost:3000 by default.

### Building for Production

Build the application:

```
npm run build
```

### Deployment

You can deploy the frontend to Vercel, Netlify, or any other static site hosting:

```
npm run build
```

Then deploy the `.next` directory.

## Environment Variables

The application uses environment variables for configuration. See `.env.example` for a list of required variables.

Key environment variables:

- `NEXT_PUBLIC_API_URL` - URL of the Finance App API (e.g., http://localhost:5000)

## Connecting with the API

The frontend connects to the API using the `NEXT_PUBLIC_API_URL` environment variable. Make sure the API is running and accessible from the frontend.

## Security

- All sensitive information is stored in environment variables
- API keys and secrets are never exposed to the client
- Authentication is handled securely through the API
