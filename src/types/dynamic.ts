/**
 * Dynamic scale type for probability thresholds
 * Used to determine accent and rimshot probabilities
 */

import { createConstArray, type NamedConfig } from './type-utils';

export const DYNAMICS = createConstArray(['Normal', 'Accent', 'Rimshot'] as const);

export type DynamicName = (typeof DYNAMICS)[number];
export type Dynamic = DynamicName;
export type DynamicConfig = NamedConfig<DynamicName>;

export type DynamicScale = [number, number];
