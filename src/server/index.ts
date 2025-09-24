/**
 * Server exports for the RandoDrum application
 */

export { appRouter, createCaller, type AppRouter } from './api/root';
export { createTRPCContext, createTRPCRouter, publicProcedure } from './api/trpc';
export { generateBeat, generateRhythm } from './beat-generator';
