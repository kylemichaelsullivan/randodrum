import { beatFormDataSchema } from '@/utils/validation';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { generateBeat } from '@/server';

import type { BeatFormData, BeatGenerationResponse } from '@/types';

export const beatRouter = createTRPCRouter({
	generate: publicProcedure
		.input(beatFormDataSchema)
		.mutation(async ({ input }): Promise<BeatGenerationResponse> => {
			try {
				const generatedBeat = generateBeat(input as BeatFormData);

				return {
					success: true,
					data: {
						id: Math.random().toString(36).substring(2, 11),
						beat: generatedBeat,
					},
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Failed to generate beat',
				};
			}
		}),
});
