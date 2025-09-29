/**
 * Error handling types and utilities
 */

import type { ComponentType, ReactNode } from 'react';

export const ERROR_CODES = [
	'BEAT_GENERATION_ERROR',
	'NETWORK_ERROR',
	'STORAGE_ERROR',
	'UNKNOWN_ERROR',
	'VALIDATION_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type AppError = {
	code: string;
	message: string;
	timestamp: number;
	details?: Record<string, unknown>;
};

export type BeatGenerationError = AppError & {
	code: 'BEAT_GENERATION_ERROR';
	difficulty?: string;
	formData?: Record<string, unknown>;
};

export type NetworkError = AppError & {
	code: 'NETWORK_ERROR';
	status?: number;
	url?: string;
};

export type StorageError = AppError & {
	code: 'STORAGE_ERROR';
	operation: 'read' | 'write' | 'delete' | 'clear';
	key?: string;
};

export type ValidationError = AppError & {
	code: 'VALIDATION_ERROR';
	field?: string;
	value?: unknown;
};

export type ErrorResult = {
	success: false;
	error: AppError;
	data?: never;
};

export type SuccessResult<T> = {
	success: true;
	data: T;
	error?: never;
};

export type Result<T> = SuccessResult<T> | ErrorResult;

export type ErrorBoundaryState = {
	hasError: boolean;
	error?: AppError;
	errorInfo?: {
		componentStack: string;
		errorBoundary?: string;
	};
};

export type ErrorBoundaryProps = {
	children: ReactNode;
	fallback?: ComponentType<{ error: AppError; reset: () => void }>;
	onError?: (error: AppError, errorInfo: ErrorBoundaryState['errorInfo']) => void;
};

export type ErrorHandler<T = unknown> = (error: AppError) => T;
export type AsyncErrorHandler<T = unknown> = (error: AppError) => Promise<T>;

export type ErrorLogger = {
	log: (error: AppError) => void;
	logAsync: (error: AppError) => Promise<void>;
};

export type ErrorRecovery<T> = {
	canRecover: (error: AppError) => boolean;
	recover: (error: AppError) => T | Promise<T>;
};

// Helper Functions
export const createBeatGenerationError = (
	message: string,
	difficulty?: string,
	formData?: Record<string, unknown>,
	details?: Record<string, unknown>
): BeatGenerationError => ({
	code: 'BEAT_GENERATION_ERROR',
	message,
	difficulty,
	formData,
	details,
	timestamp: Date.now(),
});

export const createNetworkError = (
	message: string,
	status?: number,
	url?: string,
	details?: Record<string, unknown>
): NetworkError => ({
	code: 'NETWORK_ERROR',
	message,
	status,
	url,
	details,
	timestamp: Date.now(),
});

export const createStorageError = (
	message: string,
	operation: 'read' | 'write' | 'delete' | 'clear',
	key?: string,
	details?: Record<string, unknown>
): StorageError => ({
	code: 'STORAGE_ERROR',
	message,
	operation,
	key,
	details,
	timestamp: Date.now(),
});

export const createValidationError = (
	message: string,
	field?: string,
	value?: unknown,
	details?: Record<string, unknown>
): ValidationError => ({
	code: 'VALIDATION_ERROR',
	message,
	field,
	value,
	details,
	timestamp: Date.now(),
});
