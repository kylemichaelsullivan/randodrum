/**
 * API response types and error handling
 */

import type { GeneratedBeat } from './beat';

// Base API response type
export type ApiResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
};

// Beat generation response
export type BeatGenerationResponse = ApiResponse<{
	beat: GeneratedBeat;
	id: string;
}>;

// Error response type
export type ApiError = {
	success: false;
	error: string;
	message?: string;
	code?: string;
};

// Success response type
export type ApiSuccess<T = unknown> = {
	success: true;
	data: T;
	message?: string;
};
