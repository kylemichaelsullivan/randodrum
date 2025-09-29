# RandoDrum

A drum beat generator application that creates randomized drum patterns with configurable difficulty levels inspired by classic video game difficulty settings.

## Features

- **5 Difficulty Levels**: From "I’m Too Young to Drum" (beginner) to "Drumline!" (expert)
- **96-Grid System**: Precise rhythmic notation using integer-based timing
- **Configurable Parameters**:
  - Beats per measure (1-16)
  - Number of measures (1-32)
  - Difficulty level selection
- **Dynamic Levels**: Normal, Accent, and Rimshot variations
- **Ornaments**: Flam and Drag techniques
- **Hand Balancing**: Automatic dominant/non-dominant hand distribution
- **Browser Extension Compatibility**: Handles hydration issues from browser extensions

## Tech Stack

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **tRPC** for type-safe API calls
- **TanStack Form** for form management
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Vitest** for testing
- **Zod** for runtime validation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd randodrum

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format:check # Check Prettier formatting
pnpm format:write # Fix Prettier formatting
pnpm typecheck    # Run TypeScript type checking
pnpm check        # Run linting and type checking

# Testing
pnpm test:run     # Run tests once (recommended)
pnpm test:ui      # Interactive test UI for debugging
pnpm test:coverage # Run tests with coverage analysis
```

### Important Testing Notes

- **Use `pnpm test:run` for most development work** - This runs tests once and exits, which is faster and more reliable
- **Avoid `pnpm test` (watch mode)** - Watch mode can be resource-intensive and may cause issues in some environments
- **Use `pnpm test:ui` for interactive debugging** - The UI provides a better experience for debugging failing tests

## How It Works

### Beat Generation Process

1. **Form Input**: User selects beats per measure, number of measures, and difficulty level
2. **Rhythm Generation**: Creates rhythm using the 96-grid system with weighted duration selection
3. **Sticking Assignment**: Applies hand runs and switching patterns based on difficulty
4. **Dynamic Assignment**: Adds volume variations (Normal/Accent/Rimshot)
5. **Ornament Addition**: Applies flams and drags based on difficulty settings
6. **Balancing**: Ensures proper hand distribution (when enabled)
7. **Render Fixes**: Optimizes rest notation for better readability

### Difficulty Levels

- **I’m Too Young to Drum**: Quarter notes, half notes, whole notes only
- **Hey, Not Too Ruff**: Adds eighth notes and basic dynamics
- **Hurt Me Plenty**: Includes sixteenth notes, triplets, and ornaments
- **Ultra-Violence**: Complex patterns with advanced techniques
- **Drumline!**: Maximum complexity with no balancing safeguards

### 96-Grid System

The application uses a 96-tick grid system where:

- 96 ticks = 1 whole note (4 beats)
- 24 ticks = 1 quarter note (1 beat)
- Supports all standard rhythmic subdivisions without fractional values

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── providers/       # Context providers and boundaries
│   └── ui/             # UI components (forms, buttons, etc.)
├── server/             # Server-side code
│   ├── api/            # tRPC API routes
│   └── beat-generator.ts # Core beat generation logic
├── stores/             # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and validation
└── __tests__/          # Test files
```

## Documentation

Comprehensive documentation is available in the `/documentation` folder:

- **[DIFFICULTIES.md](./documentation/DIFFICULTIES.md)** - Difficulty level configurations
- **[GRID_SYSTEM.md](./documentation/GRID_SYSTEM.md)** - 96-grid system explanation
- **[VALIDATION_SYSTEM.md](./documentation/VALIDATION_SYSTEM.md)** - Validation and type safety
- **[FORMS.md](./documentation/FORMS.md)** - Form system architecture
- **[TESTING.md](./documentation/TESTING.md)** - Testing guidelines
- **[BROWSER_EXTENSIONS.md](./documentation/BROWSER_EXTENSIONS.md)** - Browser extension handling

## Development Guidelines

### Commit Messages

Follow the standardized commit format: `TYPE: Message in Title Case`

Valid types: `ADD`, `BRANCH`, `DEPLOY`, `FIX`, `MERGE`, `REFACTOR`, `REMOVE`, `REVERT`, `UPDATE`

Examples:

- `ADD: Implement User Profile Image Upload`
- `FIX: Resolve Authentication Token Expiration Issue`
- `REFACTOR: Extract Form Validation Logic into Custom Hook`

### Code Style

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use semantic commit messages
- Write comprehensive tests
- Document complex functionality

## Browser Compatibility

The application includes special handling for browser extensions that may interfere with React hydration:

- **Password Managers**: 1Password, LastPass, Bitwarden, Dashlane
- **Writing Assistants**: Grammarly
- **Other Extensions**: Various browser extensions

See [BROWSER_EXTENSIONS.md](./documentation/BROWSER_EXTENSIONS.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow commit message guidelines
4. Add tests for new functionality
5. Run `pnpm check` to ensure code quality
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
