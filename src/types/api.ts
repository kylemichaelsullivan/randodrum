/**
 * API response types and error handling
 */

import type { GeneratedBeat } from './beat';

export type ApiError = {
	success: false;
	error: string;
	message?: string;
	code?: string;
};

export type ApiSuccess<T = unknown> = {
	success: true;
	data: T;
	message?: string;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export type BeatGenerationResponse = ApiResponse<{
	beat: GeneratedBeat;
	id: string;
}>;
