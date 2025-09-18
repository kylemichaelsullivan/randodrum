/**
 * Error handling types and utilities
 */

import type { ComponentType, ReactNode } from 'react';

// Base error types
export type AppError = {
	code: string;
	message: string;
	timestamp: number;
	details?: Record<string, unknown>;
};

export type ValidationError = AppError & {
	code: 'VALIDATION_ERROR';
	field?: string;
	value?: unknown;
};

export type NetworkError = AppError & {
	code: 'NETWORK_ERROR';
	status?: number;
	url?: string;
};

export type BeatGenerationError = AppError & {
	code: 'BEAT_GENERATION_ERROR';
	difficulty?: string;
	formData?: Record<string, unknown>;
};

export type StorageError = AppError & {
	code: 'STORAGE_ERROR';
	operation: 'read' | 'write' | 'delete' | 'clear';
	key?: string;
};

// Error result types
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

// Error handler types
export type ErrorHandler<T = unknown> = (error: AppError) => T;

export type AsyncErrorHandler<T = unknown> = (error: AppError) => Promise<T>;

// Error boundary types
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

// Error logging types
export type ErrorLogger = {
	log: (error: AppError) => void;
	logAsync: (error: AppError) => Promise<void>;
};

// Error recovery types
export type ErrorRecovery<T> = {
	canRecover: (error: AppError) => boolean;
	recover: (error: AppError) => T | Promise<T>;
};

// Specific error codes
export const ERROR_CODES = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	NETWORK_ERROR: 'NETWORK_ERROR',
	BEAT_GENERATION_ERROR: 'BEAT_GENERATION_ERROR',
	STORAGE_ERROR: 'STORAGE_ERROR',
	UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// Error factory functions
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
