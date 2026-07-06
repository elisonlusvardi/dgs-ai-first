export class AppError extends Error {
	public readonly code: string;
	public readonly statusCode: number;
	public readonly retryable: boolean;

	constructor(message: string, code: string, statusCode: number, retryable = false) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.statusCode = statusCode;
		this.retryable = retryable;
	}
}

export interface ErrorPayload {
	error: {
		code: string;
		message: string;
		statusCode: number;
		retryable: boolean;
	};
}

export function toAppError(error: unknown): AppError {
	if (error instanceof AppError) {
		return error;
	}

	if (error instanceof Error) {
		return new AppError(error.message, 'INTERNAL_ERROR', 500, false);
	}

	return new AppError('Erro desconhecido', 'UNKNOWN_ERROR', 500, false);
}

export function toErrorPayload(error: AppError): ErrorPayload {
	return {
		error: {
			code: error.code,
			message: error.message,
			statusCode: error.statusCode,
			retryable: error.retryable,
		},
	};
}
