import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const beatRouter = createTRPCRouter({
	generate: publicProcedure
		.input(
			z.object({
				beats: z.number().min(1).max(16),
				measures: z.number().min(1).max(32),
				difficulty: z.enum([
					"I'm Too Young to Drum",
					'Hey, Not Too Rough',
					'Hurt Me Plenty',
					'Ultra-Violence',
					'Drumline!',
				]),
			})
		)
		.mutation(async ({ input }) => {
			// Simulate beat generation
			return {
				success: true,
				beat: {
					id: Math.random().toString(36).substr(2, 9),
					...input,
					generatedAt: new Date().toISOString(),
				},
			};
		}),
});
