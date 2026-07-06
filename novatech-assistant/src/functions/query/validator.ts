import { z } from 'zod';
import { QueryRequestSchema } from '../../shared/types';
import { AppError } from '../../shared/errors';

export function parseQueryRequest(body: unknown) {
	const parsed = QueryRequestSchema.safeParse(body);
	if (!parsed.success) {
		const reason = parsed.error.issues.map((issue) => issue.message).join('; ');
		throw new AppError(`Request invalida: ${reason}`, 'INVALID_REQUEST', 400, false);
	}

	return parsed.data;
}

export const HttpRequestSchema = z.object({
	body: z.unknown().refine((value) => value !== undefined, {
		message: 'body ausente no request',
	}),
});

export function parseHttpRequest(request: unknown) {
	const parsed = HttpRequestSchema.safeParse(request);
	if (!parsed.success) {
		throw new AppError('Formato de request invalido', 'INVALID_HTTP_REQUEST', 400, false);
	}
	return parsed.data;
}
