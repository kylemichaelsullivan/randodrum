/**
 * Dynamic scale type for probability thresholds
 * Used to determine accent and rimshot probabilities
 */

export const DYNAMICS = ['Normal', 'Accent', 'Rimshot'] as const;

export type DynamicName = (typeof DYNAMICS)[number];

export type DynamicThresholds = [accentThreshold: number, rimshotThreshold: number];
