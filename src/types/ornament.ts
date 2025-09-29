/**
 * Drum ornament type definitions
 */

export const TECHNIQUE_TYPES = ['Flam', 'Drag'] as const;
export type TechniqueTypeName = (typeof TECHNIQUE_TYPES)[number];

export const ORNAMENTS = [...TECHNIQUE_TYPES, null] as const;
export type OrnamentName = (typeof ORNAMENTS)[number];
