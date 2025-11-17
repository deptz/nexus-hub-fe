# Nexus Hub Admin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)

Vue.js + Vite admin dashboard for the Nexus Hub API.

## Backend System

This frontend application is designed to work with the **Nexus Hub** backend system. The Nexus Hub is an AI orchestrator platform that provides the API endpoints this admin dashboard connects to.

- **Backend Repository**: [Nexus Hub](https://github.com/deptz/nexus-hub)
- **API Documentation**: The API client is generated from `open_api_spec.json` which follows the OpenAPI specification provided by the Nexus Hub backend.

To run this frontend, you'll need a running instance of the Nexus Hub backend. Make sure to configure the `VITE_API_BASE_URL` environment variable to point to your Nexus Hub API server.

## Features

- Full admin dashboard with Vue 3 + TypeScript
- Tailwind CSS for styling
- Pinia for state management
- Vue Router for navigation
- OpenAPI-generated API client
- Authentication with API key
- Responsive design

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Routing
- **Axios** - HTTP client
- **OpenAPI TypeScript Codegen** - API client generation

## Project Structure

```
ai-spinoff-fe/
├── src/
│   ├── api/              # Generated API client + custom wrappers
│   ├── components/       # Reusable Vue components
│   │   ├── common/       # Common components (DataTable, LoadingSpinner, etc.)
│   │   └── layout/       # Layout components (ApiLayout)
│   ├── composables/     # Vue composables (useApi, useAuth, etc.)
│   ├── pages/           # Route pages
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.vue
│   └── main.ts
├── open_api_spec.json   # OpenAPI specification
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deptz/nexus-hub-fe.git
   cd nexus-hub-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_TITLE=Nexus Hub Admin
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Regenerating API Client

If the OpenAPI spec changes, regenerate the API client:
```bash
npm run generate-api
```

## Usage

### Authentication

1. Start the app and navigate to the login page
2. Enter your API key (and optionally Tenant ID)
3. The API key will be stored in localStorage and used for all API requests

### Pages

- **Dashboard** (`/dashboard`) - Overview with quick actions and metrics
- **Messages** (`/messages`) - Send inbound messages and check job status
- **API Keys** (`/api-keys`) - Manage API keys (create, list, revoke)
- **Tenant Prompt** (`/tenant/prompt`) - Edit tenant system prompt
- **Health** (`/health`) - Check API health status

## API Client

The API client is automatically generated from `open_api_spec.json` using `openapi-typescript-codegen`. The generated client is located in `src/api/generated/`.

Custom API client wrapper (`src/api/client.ts`) handles:
- Authentication (API key via X-API-Key header)
- Base URL configuration
- Error handling and 401 redirects

## State Management

Pinia stores are used for state management:
- `authStore` - Authentication state
- `messagesStore` - Message operations
- `apiKeysStore` - API key management
- `tenantStore` - Tenant prompt
- `healthStore` - Health check status

## Components

### Common Components

- `DataTable` - Reusable data table with sorting and actions
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error display component
- `ConfirmDialog` - Confirmation dialog
- `FormInput` - Reusable form input
- `ToastContainer` - Toast notification container

### Layout Components

- `ApiLayout` - Main layout with sidebar navigation

## Composables

- `useAuth` - Authentication utilities
- `useApi` - Generic API composable
- `useMessages` - Message operations
- `useApiKeys` - API key operations
- `useTenant` - Tenant operations
- `useHealth` - Health check operations
- `useToast` - Toast notifications

## Environment Variables

- `VITE_API_BASE_URL` - API base URL (default: http://localhost:8000)
- `VITE_APP_TITLE` - Application title (default: Nexus Hub Admin)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:
```bash
npm run build
```

Ensure all dependencies are installed:
```bash
npm install
```

### API Client Generation

If the API client is out of sync with the OpenAPI spec:
```bash
npm run generate-api
```

### Environment Variables

Make sure your `.env` file is properly configured. The app will use default values if environment variables are not set:
- `VITE_API_BASE_URL` defaults to `http://localhost:8000`
- `VITE_APP_TITLE` defaults to `Nexus Hub Admin`

### CORS Issues

If you encounter CORS errors when connecting to the API, ensure:
- The API server has CORS properly configured
- The `VITE_API_BASE_URL` in your `.env` matches your API server URL

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

