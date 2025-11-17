# Contributing to Nexus Hub Admin

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Basic knowledge of Vue 3, TypeScript, and modern web development

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/deptz/nexus-hub-fe.git
   cd nexus-hub-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API base URL and other configuration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Regenerate API client (if OpenAPI spec changes)**
   ```bash
   npm run generate-api
   ```

## Development Workflow

### Code Style

- Follow TypeScript best practices
- Use Vue 3 Composition API with `<script setup>`
- Follow existing code patterns and structure
- Use meaningful variable and function names
- Add comments for complex logic

### Project Structure

- `src/api/` - API client and generated code
- `src/components/` - Reusable Vue components
- `src/composables/` - Vue composables (reusable logic)
- `src/pages/` - Route pages/views
- `src/router/` - Vue Router configuration
- `src/stores/` - Pinia stores for state management
- `src/utils/` - Utility functions

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, maintainable code
   - Follow existing patterns
   - Add comments where necessary

3. **Test your changes**
   - Ensure the app runs without errors
   - Test the functionality you've added/modified
   - Check for TypeScript errors: `npm run build`

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   Use clear, descriptive commit messages.

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Before submitting a PR:**
   - Ensure your code follows the project's style guidelines
   - Make sure all TypeScript checks pass (`npm run build`)
   - Update documentation if you've changed functionality
   - Test your changes thoroughly

2. **PR Description:**
   - Clearly describe what the PR does
   - Reference any related issues
   - Include screenshots if UI changes are involved
   - List any breaking changes

3. **Review Process:**
   - PRs will be reviewed by maintainers
   - Address any feedback or requested changes
   - Be patient and responsive to comments

## Code Guidelines

### TypeScript

- Use TypeScript types for all function parameters and return values
- Avoid `any` type - use proper types or `unknown`
- Leverage TypeScript's type inference where appropriate

### Vue Components

- Use Composition API with `<script setup>` syntax
- Keep components focused and single-purpose
- Extract reusable logic into composables
- Use Pinia stores for shared state

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design for mobile and desktop

### API Client

- The API client is generated from `open_api_spec.json`
- Don't manually edit files in `src/api/generated/`
- If API changes, update `open_api_spec.json` and run `npm run generate-api`

## Reporting Issues

When reporting issues, please include:

- Clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/OS information (if relevant)
- Screenshots (if applicable)

## Questions?

If you have questions or need help, feel free to:

- Open an issue for discussion
- Check existing issues and discussions

Thank you for contributing!

