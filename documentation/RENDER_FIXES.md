# Render Fixes Documentation

This document outlines the improvements made to the beat generation system to produce more readable and conventional music notation, as well as hydration-related fixes for browser extension compatibility.

## Overview

The `fixRender()` function in `src/server/beat-generator.ts` was implemented to intelligently combine consecutive rests into longer, more readable durations following conventional music notation grouping rules.

## Implementation Details

### Core Function: `fixRender(measure: Measure): Measure`

**Purpose**: Combines consecutive rests into conventional music notation groupings to improve readability.

**Logic**:

1. Iterates through the measure looking for consecutive rests
2. Calculates the total duration of consecutive rests
3. Applies conventional grouping rules to determine the optimal rest duration
4. Replaces consecutive rests with a single rest of the optimal duration

### Supporting Function: `getOptimalRestDuration(totalDuration: number): Duration | null`

**Purpose**: Determines the most appropriate rest duration based on conventional music notation rules.

**Rules Applied**:

- **4 quarter rests (96 ticks)** → **Whole rest** (special case)
- **3 quarter rests (72 ticks)** → **Dotted half rest** (three-beat grouping)
- **2 quarter rests (48 ticks)** → **Half rest** (two-beat grouping)
- **Single quarter rest (24 ticks)** → **Keep as-is** (no combination needed)

## Conventional Grouping Rules

### Two-Beat Groupings

- Quarter-Rest + Quarter-Rest = Half-Rest (48 ticks)
- Follows standard music notation practice of grouping rests into logical rhythmic units

### Three-Beat Groupings

- Quarter-Rest + Quarter-Rest + Quarter-Rest = Dotted Half-Rest (72 ticks)
- Quarter-Rest + Half-Rest = Dotted Half-Rest (72 ticks)

### Four-Beat Special Case

- Four consecutive quarter rests = Whole Rest (96 ticks)
- This is a special case that overrides other grouping rules for complete measure rests

## Integration

The `fixRender()` function is integrated into the beat generation pipeline:

```typescript
return fixRender(
	applyBalancing(
		addOrnaments(
			addDynamics(generateHandRuns(measure, difficultyConfig), difficultyConfig),
			difficultyConfig
		),
		difficultyConfig
	)
);
```

## Testing

Comprehensive test coverage includes:

### Basic Combinations

- Two consecutive quarter rests → Half rest
- Three consecutive quarter rests → Dotted half rest
- Four consecutive quarter rests → Whole rest

### Mixed Combinations

- Quarter rest + Half rest → Dotted half rest
- Various mixed duration combinations

### Edge Cases

- Single rests (unchanged)
- Non-consecutive rests (preserved separately)
- Empty measures
- Measures with only notes (unchanged)

### Integration Tests

- Verifies function works within the full beat generation pipeline
- Ensures total measure duration remains correct after processing

## Benefits

1. **Improved Readability**: Rests are grouped into logical, conventional units
2. **Standard Notation**: Follows established music theory practices
3. **Cleaner Output**: Reduces visual clutter in generated beats
4. **Musical Accuracy**: Produces notation that musicians expect to see

## Technical Notes

- Function is exported for testing purposes
- Uses TypeScript strict typing with `Duration` type
- Maintains all note properties (start time, duration, rest flag)
- Preserves non-rest notes unchanged
- Only affects "I’m Too Young to Drum" difficulty level (uses durations: 24, 48, 72, 96)

## Hydration Fix Implementation

### Component Structure

The hydration fix system uses Next.js's `Script` component to load an external script that removes browser extension attributes before React hydration:

```typescript
import Script from 'next/script';

export function HydrationFix() {
	return <Script id='hydration-fix' src='/scripts/hydration-fix.js' strategy='beforeInteractive' />;
}
```

### Implementation Details

- **External Script**: `/public/scripts/hydration-fix.js` contains the browser extension attribute removal logic
- **Strategy**: `beforeInteractive` ensures the script runs before React hydration
- **Functionality**: Removes browser extension attributes that cause hydration mismatches

### Browser Extension Attributes Cleaned

The script removes the following browser extension attributes from the document body:

- `cz-shortcut-listen` - Common password manager extension
- `data-1password-root` - 1Password
- `data-bitwarden-watching` - Bitwarden
- `data-dashlane-id` - Dashlane
- `data-grammarly-ignore` - Grammarly
- `data-grammarly-shadow-root` - Grammarly
- `data-lastpass-icon-root` - LastPass

### Technical Implementation

The script uses JSDoc type annotations to ensure TypeScript compatibility:

```javascript
// Clean attribute removal
attributesToRemove.forEach(attr => {
	if (body.hasAttribute(attr)) {
		body.removeAttribute(attr);
	}
});
```

### Script Loading Strategy

The `beforeInteractive` strategy ensures the script runs:

1. Before React hydration begins
2. Before any other JavaScript executes
3. Synchronously to prevent race conditions

### Benefits

1. **Security**: Uses external script loading instead of inline script injection
2. **Performance**: External script can be cached by the browser
3. **Maintainability**: JavaScript logic is in a separate, debuggable file
4. **Best Practices**: Uses Next.js's recommended `Script` component with `beforeInteractive` strategy

## Future Considerations

The current implementation focuses on the "I’m Too Young to Drum" difficulty level. Future enhancements could:

- Extend grouping rules to other difficulty levels
- Handle more complex rest combinations
- Add support for tied rests across measure boundaries
- Implement advanced grouping rules for compound time signatures
