# Testing Setup

This directory contains the comprehensive testing setup for the RandoDrum application.

## Test Structure

```
src/__tests__/
├── components/           # Component tests
│   ├── ui/              # UI component tests
│   │   ├── buttons/     # Button component tests
│   │   ├── forms/       # Form component tests
│   │   └── sections/    # Section component tests
│   └── providers/       # Provider component tests
├── services/            # Service and utility tests
├── stores/              # Zustand store tests
├── fixtures/            # Test data and mock responses
├── mocks/               # Shared mock implementations
├── utils/               # Test utilities and helpers
├── setup.ts             # Global test configuration
└── index.ts             # Test exports
```

## Testing Stack

- **Vitest** - Primary test runner for unit and integration tests
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Additional DOM matchers for assertions
- **@testing-library/user-event** - User interaction simulation

## Test Types

### 1. Unit Tests

- **Component Tests**: React component rendering and behavior
- **Store Tests**: Zustand store state management
- **Service Tests**: Beat generation and utility functions

### 2. Integration Tests

- **Component Integration**: Multi-component interaction testing
- **Store Integration**: Complex state management scenarios

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests with UI interface
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run tests once (CI mode)
pnpm test:run
```

## Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that includes all necessary providers:

- QueryClient for React Query
- ThemeProvider for theme context

### Fixtures

Test fixtures provide realistic mock data for:

- Beat generation results
- Form data
- Store states

### Mocks

Shared mock implementations for:

- External dependencies (Next.js router, FontAwesome)
- tRPC API calls
- Browser APIs (ResizeObserver, matchMedia)

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@/__tests__/utils';
import { Button } from '@/components/ui/buttons';

describe('Button', () => {
  it('renders with correct title', () => {
    render(<Button title="Test">Click me</Button>);
    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
  });
});
```

### Store Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useBeatStore } from '@/stores/beat-store';

describe('BeatStore', () => {
	it('sets current beat', () => {
		const { result } = renderHook(() => useBeatStore());

		act(() => {
			result.current.setCurrentBeat(mockBeat);
		});

		expect(result.current.currentBeat).toEqual(mockBeat);
	});
});
```

## Best Practices

1. **Use the custom render function** from `@/__tests__/utils` for component tests
2. **Mock external dependencies** in the setup file
3. **Use realistic test data** from fixtures
4. **Test user interactions** with fireEvent and user-event
5. **Clean up after tests** with beforeEach/afterEach
6. **Test accessibility** with screen readers and keyboard navigation
7. **Test error states** and edge cases

## Coverage Goals

- **Components**: 90%+ coverage
- **Stores**: 95%+ coverage
- **Services**: 90%+ coverage
- **Utilities**: 95%+ coverage
