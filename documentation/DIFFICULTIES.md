# Drum Beat Difficulty Levels

This document explains the various difficulty levels available in RandoDrum and how they affect beat generation.

## Overview

RandoDrum uses five difficulty levels inspired by classic video game difficulty settings. Each level progressively increases complexity across multiple dimensions:

1. **Rhythm complexity** - Available note durations
2. **Sticking patterns** - Hand switching frequency and run lengths
3. **Dynamics** - Volume variations and ghost notes
4. **Ornaments** - Flams and drags
5. **Balancing** - Hand distribution and clump prevention

## Difficulty Levels

### I’m Too Young to Drum

_The easiest level, perfect for beginners_

- **Durations**: Quarter notes, half notes, and whole notes only
- **Sticking**: Always single notes (no runs), 100% hand switching
- **Dynamics**: Only normal volume (no ghost notes, accents, or rimshots)
- **Ornaments**: None
- **Balancing**: Strict 45-55% dominant hand ratio, maximum 1 note per hand

### Hey, Not Too Rough

_Gentle introduction to more complex patterns_

- **Durations**: Quarter notes, half notes, and whole notes
- **Sticking**: 70% single notes, 30% two-note runs, 80% hand switching
- **Dynamics**: 80% normal, 20% accent/rimshot (no ghost notes)
- **Ornaments**: 5% chance of flams, no drags
- **Balancing**: 45-55% dominant hand ratio, maximum 2 notes per hand

### Hurt Me Plenty

_Moderate challenge with more variety_

- **Durations**: Quarter notes, half notes, and whole notes
- **Sticking**: 50% single, 30% two-note, 20% three-note runs, 60% hand switching
- **Dynamics**: 50% ghost, 50% normal, 30% accent, 5% rimshot
- **Ornaments**: 10% flams, 10% drags
- **Balancing**: 40-60% dominant hand ratio, maximum 3 notes per hand

### Ultra-Violence

_High difficulty with complex patterns_

- **Durations**: Quarter notes, half notes, and whole notes
- **Sticking**: 40% single, 30% two-note, 20% three-note, 10% four-note runs, 40% hand switching
- **Dynamics**: 20% ghost, 50% normal, 20% accent, 10% rimshot
- **Ornaments**: 15% flams, 15% drags
- **Balancing**: 35-65% dominant hand ratio, maximum 4 notes per hand

### Drumline!

_Maximum difficulty with no balancing_

- **Durations**: Quarter notes, half notes, and whole notes
- **Sticking**: Equal distribution of 1-4 note runs, 50% hand switching
- **Dynamics**: 20% ghost, 50% normal, 20% accent, 10% rimshot
- **Ornaments**: 25% flams, 25% drags
- **Balancing**: Disabled - allows natural hand distribution and longer runs

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

### Dynamic Scale

Dynamics are determined by weighted thresholds on a 0-10 scale:

- `[ghostThreshold, normalThreshold, accentThreshold, rimshotThreshold]`
- Random values below each threshold determine the dynamic level

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
