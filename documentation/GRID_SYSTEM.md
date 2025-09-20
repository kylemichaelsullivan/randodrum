# 96-Grid System Documentation

## Overview

RandoDrum uses a 96-grid system for precise rhythmic notation and beat generation. This system provides clean integer values for all common rhythmic patterns, making it ideal for algorithmic music generation and precise timing calculations.

## Core Concept

The 96-grid system is based on the principle that **96 ticks = 1 whole note (4 beats)**. This creates a highly divisible number that accommodates all standard rhythmic subdivisions without fractional values.

## Grid Size Calculation

The grid size for each measure is calculated as:

```
gridSize = beatsPerMeasure × 24
```

Where:

- `beatsPerMeasure` is the number of beats in the measure (typically 4, 6, or 8)
- `24` represents the number of ticks per quarter note in the 96-grid system

## Duration Values

The system supports 10 distinct duration values, each representing a specific note type:

### Straight Notes (Power-of-Two Divisions)

| Duration | Note Type | Symbol | Beats | Fraction of Whole Note |
| -------- | --------- | ------ | ----- | ---------------------- |
| 6        | Sixteenth | s      | 0.25  | 0.0625                 |
| 12       | Eighth    | e      | 0.5   | 0.125                  |
| 24       | Quarter   | q      | 1.0   | 0.25                   |
| 48       | Half      | h      | 2.0   | 0.5                    |
| 96       | Whole     | w      | 4.0   | 1.0                    |

### Dotted Notes (1.5x Base Duration)

| Duration | Note Type      | Symbol | Beats | Fraction of Whole Note |
| -------- | -------------- | ------ | ----- | ---------------------- |
| 18       | Dotted Eighth  | i      | 0.75  | 0.1875                 |
| 36       | Dotted Quarter | j      | 1.5   | 0.375                  |
| 72       | Dotted Half    | d      | 3.0   | 0.75                   |

### Triplets (Divide by 3)

| Duration | Note Type       | Symbol | Beats | Fraction of Whole Note |
| -------- | --------------- | ------ | ----- | ---------------------- |
| 8        | Eighth Triplet  | T      | 1/3   | 0.083...               |
| 16       | Quarter Triplet | t      | 2/3   | 0.166...               |

## Implementation Details

### Type Safety

The system uses TypeScript union types to ensure only valid duration values are used:

```typescript
// Straight note durations (power-of-two divisions)
export type StraightDuration = 6 | 12 | 24 | 48 | 96;

// Triplet durations (divide by 3)
export type TripletDuration = 8 | 16;

// Dotted note durations (1.5x the base duration)
export type DottedDuration = 18 | 36 | 72;

// Duration value type
export type DurationValue = StraightDuration | DottedDuration | TripletDuration;
```

### Duration Configuration

Each duration is associated with metadata including name, symbol, and value:

```typescript
export const DURATION_CONFIGS: readonly DurationConfig[] = [
	// Straight notes (power-of-two divisions)
	{ name: 'Sixteenth', symbol: 's', value: 6 },
	{ name: 'Eighth', symbol: 'e', value: 12 },
	{ name: 'Quarter', symbol: 'q', value: 24 },
	{ name: 'Half', symbol: 'h', value: 48 },
	{ name: 'Whole', symbol: 'w', value: 96 },

	// Dotted notes (1.5x base duration)
	{ name: 'Dotted Eighth', symbol: 'i', value: 18 },
	{ name: 'Dotted Quarter', symbol: 'j', value: 36 },
	{ name: 'Dotted Half', symbol: 'd', value: 72 },

	// Triplets (divide by 3)
	{ name: 'Eighth Triplet', symbol: 'T', value: 8 },
	{ name: 'Quarter Triplet', symbol: 't', value: 16 },
] as const;
```

## Rhythm Generation Process

The 96-grid system is used in the following way during beat generation:

### 1. Grid Size Calculation

```typescript
const gridSize = formData.beats * 24; // Quarter Note = 24 ticks
```

### 2. Rhythm Filling

The `generateRhythm` function fills the grid by:

- Starting at tick 0
- Selecting valid durations that fit within the remaining space
- Placing notes at precise tick positions
- Ensuring the total duration exactly matches the grid size

### 3. Duration Validation

Only durations from the allowed list (based on difficulty level) can be used:

- **I’m Too Young to Drum**: Quarter (24), Half (48), Dotted Half (72), Whole (96)
- **Hey, Not Too Rough**: Eighth (12), Quarter (24), Dotted Quarter (36), Half (48)
- **Hurt Me Plenty**: Sixteenth (6), Eighth Triplet (8), Eighth (12), Dotted Eighth (18), Quarter (24), Dotted Quarter (36)
- **Ultra-Violence**: Sixteenth (6), Eighth Triplet (8), Eighth (12), Quarter Triplet (16), Dotted Eighth (18), Quarter (24), Dotted Quarter (36)
- **Drumline!**: Sixteenth (6), Eighth Triplet (8), Eighth (12), Quarter Triplet (16), Dotted Eighth (18), Quarter (24), Dotted Quarter (36) - _No balancing safeguards_

Each difficulty level uses weighted probability distributions to determine which durations are more likely to appear in generated rhythms.

## Mathematical Properties

### Divisibility

96 is highly divisible, making it perfect for rhythmic subdivisions:

- Divisors: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96
- Supports: halves, thirds, quarters, sixths, eighths, twelfths, sixteenths, thirty-seconds

### Clean Fractions

All common rhythmic patterns result in clean integer values:

- Quarter note triplet: 96 ÷ 3 = 32 ticks (not used in current system)
- Eighth note triplet: 96 ÷ 6 = 16 ticks (Quarter Triplet = 16)
- Sixteenth note triplet: 96 ÷ 12 = 8 ticks (Eighth Triplet = 8)
- Dotted eighth note: 12 × 1.5 = 18 ticks
- Dotted quarter note: 24 × 1.5 = 36 ticks
- Dotted half note: 48 × 1.5 = 72 ticks

## Advantages

1. **Precision**: No floating-point arithmetic errors
2. **Flexibility**: Supports all standard rhythmic subdivisions
3. **Simplicity**: Integer-based calculations are fast and reliable
4. **Compatibility**: Works well with MIDI timing and sequencer applications

## Usage in RandoDrum

The 96-grid system is used throughout the application for:

- **Beat Generation**: Creating rhythmically accurate drum patterns with weighted duration selection
- **Hand Balancing**: Ensuring proper distribution between dominant and non-dominant hands
- **Dynamics**: Adding ghost notes, normal hits, accents, and rimshots
- **Ornaments**: Incorporating flams and drags based on difficulty level
- **Display**: Rendering notes at precise positions with proper timing
- **Import/Export**: Generating MIDI-compatible timing data
- **Validation**: Ensuring measures have correct total duration
- **Difficulty Scaling**: Controlling which rhythmic subdivisions are available

## Testing

The system is thoroughly tested to ensure:

- Measures always sum to exactly the grid size
- Only valid duration values are used
- Rhythm generation terminates correctly
- All difficulty levels produce valid patterns

Example test cases:

```typescript
it('generates rhythm that fills exactly the measure length', () => {
	const durationConfigs: DurationWeightConfig[] = [{ duration: 24 as DurationValue, weight: 1 }];
	const measureLen = 96;

	const rhythm = generateRhythm(durationConfigs, measureLen);

	const totalDuration = rhythm.reduce((sum, note) => sum + note.dur, 0);
	expect(totalDuration).toBe(measureLen);
});

it('handles tuplets correctly', () => {
	const durationConfigs: DurationWeightConfig[] = [
		{ duration: 8 as DurationValue, weight: 1 }, // Triplet eighth
	];
	const measureLen = 24;

	const rhythm = generateRhythm(durationConfigs, measureLen);

	expect(rhythm).toHaveLength(3);
	expect(rhythm[0]?.start).toBe(0);
	expect(rhythm[1]?.start).toBe(8);
	expect(rhythm[2]?.start).toBe(16);
});
```

This 96-grid system provides the foundation for RandoDrum's precise and flexible rhythmic generation capabilities.
