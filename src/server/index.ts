/**
 * Server exports for the RandoDrum application
 */

export { appRouter, createCaller } from './api/root';
export { createTRPCContext, createTRPCRouter, publicProcedure } from './api/trpc';
export {
	generateBeat,
	generateRhythm,
	generateHandRuns,
	addDynamics,
	addOrnaments,
	applyBalancing,
} from './beat-generator';
