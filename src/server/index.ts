/**
 * Server exports for the RandoDrum application
 */

export { appRouter, createCaller, type AppRouter } from './api/root';
export {
	createCallerFactory,
	createTRPCContext,
	createTRPCRouter,
	publicProcedure,
} from './api/trpc';
export { fixRender, generateBeat, generateRhythm } from './beat-generator';
