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

### Examples:

- **4/4 time**: `4 × 24 = 96 ticks` (whole note)
- **6/8 time**: `6 × 24 = 144 ticks` (dotted whole note)
- **3/4 time**: `3 × 24 = 72 ticks` (dotted half note)

## Duration Values

The system supports 15 distinct duration values, each representing a specific note type:

### Straight Notes (Power-of-Two Divisions)

| Duration | Note Type        | Symbol | Beats | Fraction of Whole Note |
| -------- | ---------------- | ------ | ----- | ---------------------- |
| 96       | Whole            | w      | 4.0   | 1.0                    |
| 72       | Dotted Half      | h.     | 3.0   | 0.75                   |
| 48       | Half             | h      | 2.0   | 0.5                    |
| 36       | Dotted Quarter   | q.     | 1.5   | 0.375                  |
| 24       | Quarter          | q      | 1.0   | 0.25                   |
| 18       | Dotted Eighth    | e.     | 0.75  | 0.1875                 |
| 12       | Eighth           | e      | 0.5   | 0.125                  |
| 9        | Dotted Sixteenth | s.     | 0.375 | 0.09375                |
| 6        | Sixteenth        | s      | 0.25  | 0.0625                 |
| 3        | Thirty-Second    | t      | 0.125 | 0.03125                |

### Triplets (Divide by 3)

| Duration | Note Type       | Symbol | Beats | Fraction of Whole Note |
| -------- | --------------- | ------ | ----- | ---------------------- |
| 16       | Quarter Triplet | q3     | 2/3   | 0.166...               |
| 8        | Eighth Triplet  | e3     | 1/3   | 0.083...               |

### Sixtuplets (Divide by 6)

| Duration | Note Type           | Symbol | Beats | Fraction of Whole Note |
| -------- | ------------------- | ------ | ----- | ---------------------- |
| 4        | Eighth Sixtuplet    | e6     | 1/6   | 0.041...               |
| 2        | Sixteenth Sixtuplet | s6     | 1/12  | 0.020...               |

## Implementation Details

### Type Safety

The system uses TypeScript union types to ensure only valid duration values are used:

```typescript
export type DurationValue = 2 | 3 | 4 | 6 | 8 | 9 | 12 | 16 | 18 | 24 | 32 | 36 | 48 | 72 | 96;
```

### Duration Configuration

Each duration is associated with metadata including name, symbol, and color:

```typescript
export const DURATION_CONFIGS: readonly DurationConfig[] = [
	{ name: 'Whole', symbol: 'w', value: 96 },
	{ name: 'Dotted Half', symbol: 'h.', value: 72 },
	// ... etc
];
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

- **I'm Too Young to Drum**: Whole, Dotted Half, Half, Quarter (96, 72, 48, 24)
- **Hey, Not Too Rough**: Half, Dotted Quarter, Quarter, Eighth (48, 36, 24, 12)
- **Hurt Me Plenty**: Dotted Quarter, Quarter, Dotted Eighth, Eighth, Eighth Triplet, Sixteenth (36, 24, 18, 12, 8, 6)
- **Ultra-Violence**: Dotted Quarter, Quarter, Dotted Eighth, Eighth, Eighth Triplet, Sixteenth, Thirty-Second (36, 24, 18, 12, 8, 6, 3)
- **Drumline!**: Same durations as Ultra-Violence without balancing and other safeguards

## Mathematical Properties

### Divisibility

96 is highly divisible, making it perfect for rhythmic subdivisions:

- Divisors: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96
- Supports: halves, thirds, quarters, sixths, eighths, twelfths, sixteenths, thirty-seconds

### Clean Fractions

All common rhythmic patterns result in clean integer values:

- Quarter note triplet: 96 ÷ 3 = 32 ticks
- Eighth note triplet: 96 ÷ 6 = 16 ticks
- Sixteenth note triplet: 96 ÷ 12 = 8 ticks

## Advantages

1. **Precision**: No floating-point arithmetic errors
2. **Flexibility**: Supports all standard rhythmic subdivisions
3. **Simplicity**: Integer-based calculations are fast and reliable
4. **Compatibility**: Works well with MIDI timing and sequencer applications
5. **Extensibility**: Easy to add new subdivisions (e.g., quintuplets, septuplets)

## Usage in RandoDrum

The 96-grid system is used throughout the application for:

- **Beat Generation**: Creating rhythmically accurate drum patterns
- **Display**: Rendering notes at precise positions
- **Export**: Generating MIDI-compatible timing data
- **Validation**: Ensuring measures have correct total duration
- **Difficulty Scaling**: Controlling which rhythmic subdivisions are available

## Testing

The system is thoroughly tested to ensure:

- Measures always sum to exactly the grid size
- Only valid duration values are used
- Rhythm generation terminates correctly
- All difficulty levels produce valid patterns

Example test case:

```typescript
it('generates measures with correct total duration', () => {
	const beat = generateBeat({ beats: 4, measures: 2, difficulty: 'Hey, Not Too Rough' });

	beat.measures.forEach(measure => {
		const totalDuration = measure.reduce((sum, note) => sum + note.dur, 0);
		expect(totalDuration).toBe(96); // 4 beats * 24 ticks per beat
	});
});
```

This 96-grid system provides the foundation for RandoDrum's precise and flexible rhythmic generation capabilities.
