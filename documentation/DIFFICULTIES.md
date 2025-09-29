# Drum Beat Difficulty Levels

This document explains the various difficulty levels available in RandoDrum and how they affect beat generation.

## Overview

RandoDrum uses five difficulty levels inspired by classic video game difficulty settings. Each level progressively increases complexity across multiple dimensions:

1. **Rhythm complexity** - Available note durations
2. **Sticking patterns** - Hand switching frequency and run lengths
3. **Dynamics** - Volume variations
4. **Ornaments** - Flams and drags
5. **Balancing** - Hand distribution and clump prevention

## Difficulty Levels

### I’m Too Young to Drum

_The easiest level, perfect for beginners_

- **Durations**: Quarter notes (60%), half notes (25%), dotted half notes, and whole notes
- **Sticking**: Always single notes (no runs), 100% hand switching
- **Dynamics**: Only normal volume (`[1.0, 1.0]`)
- **Ornaments**: None
- **Balancing**: Strict 45-55% dominant hand ratio, maximum 1 note per hand
- **Rest Probability**: 30%

### Hey, Not Too Ruff

_Gentle introduction to more complex patterns_

- **Durations**: Eighth notes (30%), quarter notes (50%), dotted quarter notes, and half notes
- **Sticking**: 70% single notes, 30% two-note runs, 80% hand switching
- **Dynamics**: 80% normal, 20% accent (`[0.8, 1.0]`)
- **Ornaments**: 5% chance of flams, no drags
- **Balancing**: 45-55% dominant hand ratio, maximum 2 notes per hand
- **Rest Probability**: 25%

### Hurt Me Plenty

_Moderate challenge with more variety_

- **Durations**: Sixteenth notes (20%), eighth triplets (5%), eighth notes (25%), dotted eighth notes (10%), quarter notes (30%), dotted quarter notes (10%)
- **Sticking**: 50% single, 30% two-note, 20% three-note runs, 60% hand switching
- **Dynamics**: 60% normal, 30% accent, 10% rimshot (`[0.6, 0.9]`)
- **Ornaments**: 10% flams, 10% drags
- **Balancing**: 40-60% dominant hand ratio, maximum 3 notes per hand
- **Rest Probability**: 20%

### Ultra-Violence

_High difficulty with complex patterns_

- **Durations**: Sixteenth notes (20%), eighth triplets (15%), eighth notes (25%), quarter triplets (10%), dotted eighth notes (10%), quarter notes (15%), dotted quarter notes (15%)
- **Sticking**: 40% single, 30% two-note, 20% three-note, 10% four-note runs, 40% hand switching
- **Dynamics**: 50% normal, 30% accent, 20% rimshot (`[0.5, 0.8]`)
- **Ornaments**: 15% flams, 15% drags
- **Balancing**: 35-65% dominant hand ratio, maximum 4 notes per hand
- **Rest Probability**: 15%

### Drumline!

_Maximum difficulty with no balancing_

- **Durations**: Sixteenth notes (30%), eighth triplets (20%), eighth notes (25%), quarter triplets (5%), dotted eighth notes (8%), quarter notes (10%), dotted quarter notes (2%)
- **Sticking**: Equal distribution of 1-4 note runs, 50% hand switching
- **Dynamics**: 50% normal, 30% accent, 20% rimshot (`[0.5, 0.8]`)
- **Ornaments**: 25% flams, 25% drags
- **Balancing**: Disabled - allows natural hand distribution and longer runs
- **Rest Probability**: 10%

## Technical Details

### Duration System (96-Grid)

Notes are measured in grid units based on a 96-tick system where 96 ticks = whole note (4 beats). This system provides clean integer values for all common rhythmic patterns:

**Straight Notes (Power-of-Two Divisions):**

- 96 = whole note (4 beats)
- 72 = dotted half note (3 beats)
- 48 = half note (2 beats)
- 36 = dotted quarter note (1.5 beats)
- 24 = quarter note (1 beat)
- 18 = dotted eighth note (3/4 beat)
- 12 = eighth note (1/2 beat)
- 6 = sixteenth note (1/4 beat)

**Triplets (Divide by 3):**

- 16 = quarter triplet (3 hits over 2 beats)
- 8 = eighth triplet (3 hits over 1 beat)

### Sticking Generation

The system uses run-length distributions to determine how many consecutive notes each hand plays before switching. Higher difficulties allow longer runs and less frequent switching.

### Dynamic Thresholds

Dynamics are determined by weighted thresholds on a 0-1 scale using random number generation. The `dynamicThresholds` is configured as a tuple `[accentThreshold, rimshotThreshold]`:

- `accentThreshold` - values below this result in normal dynamics
- `rimshotThreshold` - values between accentThreshold and rimshotThreshold result in accent dynamics
- Values at or above rimshotThreshold result in rimshot dynamics
- **Constraint**: accentThreshold must be <= rimshotThreshold for logical consistency
- **Implementation**: A random value (0-1) is generated for each note and compared against these thresholds to determine the dynamic level

**Example**: With `dynamicThresholds: [0.6, 0.9]` (accentThreshold: 0.6, rimshotThreshold: 0.9):

- Random values 0.0-0.59 → Normal (60%)
- Random values 0.6-0.89 → Accent (30%)
- Random values 0.9-1.0 → Rimshot (10%)

**Difficulty Level Examples**:

- **I’m Too Young to Drum**: `[1.0, 1.0]` - Only normal dynamics
- **Hey, Not Too Ruff**: `[0.8, 1.0]` - Mostly normal with some accents
- **Hurt Me Plenty**: `[0.6, 0.9]` - Balanced mix of all dynamics
- **Ultra-Violence**: `[0.5, 0.8]` - More accents and rimshots
- **Drumline!**: `[0.5, 0.8]` - Maximum dynamic variation

### Ornament Probabilities

- **Flam**: A grace note played slightly before the main note
- **Drag**: Two grace notes played before the main note
- Probabilities are cumulative (flam + drag = total ornament chance)

### Balancing System

When enabled, balancing ensures:

- **Max Clump**: Limits consecutive notes with the same hand
- **Hand Ratio**: Maintains a target percentage of dominant vs non-dominant hand usage
- **Drumline!** disables balancing to allow more natural, challenging patterns

## Implementation Notes

The beat generation process follows this sequence:

1. **Rhythm Generation**: Fill measure with allowed durations
2. **Sticking Assignment**: Apply hand runs and switching patterns
3. **Dynamic Assignment**: Add volume variations
4. **Ornament Addition**: Apply flams and drags
5. **Balancing**: Adjust hand distribution and clumps (skipped for Drumline!)

Each difficulty level provides a different configuration object that controls these generation parameters, allowing for progressive complexity increases while maintaining musical coherence.
