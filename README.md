# CodeUni

A modern learning platform built with Next.js, focusing on interactive coding education and project-based learning.

## Features

- **Interactive Course Management**
  - Create and manage coding courses
  - Project-based learning modules
  - Real-time code editing and preview
  - Progress tracking

- **User Experience**
  - Responsive design for all devices
  - Dark/light mode support
  - Accessible interface
  - Performance optimized

- **Admin Dashboard**
  - Course analytics
  - User management
  - Content moderation
  - Performance metrics

## Tech Stack

- **Frontend**: Next.js, React, Material-UI
- **Styling**: SASS, Bulma
- **Testing**: Jest, React Testing Library, Playwright
- **Other**: Cloudinary (media), JWT (auth)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm/yarn
- MySQL (for local development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/tarikmaljanovic/codeUni
cd codeuni
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing Strategy

### Unit Tests
```bash
npm run test:unit
```
- Component testing
- Utility function testing
- Validation testing

### Integration Tests
```bash
npm run test:integration
```
- Component interaction testing
- API integration testing
- State management testing

### System Tests
```bash
npm run test:system
```
- End-to-end testing
- Cross-browser testing
- Mobile responsiveness
- Performance testing
- Accessibility testing

### Coverage Analysis
```bash
npm run test:coverage
```
Generates detailed coverage reports in `coverage/` directory

## Project Structure

```
codeuni/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── validationSchemas/ # Form validation
│   └── ...               # Route handlers and pages
├── public/                # Static assets
├── tests/                 # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── system/           # E2E tests
└── scripts/              # Build and utility scripts
```

## Development Guidelines

- Follow the established coding style
- Write tests for new features
- Update documentation as needed
- Use conventional commits

## Performance Considerations

- Optimized image loading
- Code splitting
- Server-side rendering
- Caching strategies

## Accessibility

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
