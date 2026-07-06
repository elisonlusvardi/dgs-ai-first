import { QueryResponseSchema } from '../../shared/types';
import type { ValidationResult } from '../../services/response-validator';

interface BuildResponseInput {
	content: string;
	source_document?: string;
	confidence?: number;
	validation: ValidationResult;
}

export function buildQueryResponse(input: BuildResponseInput) {
	const response = {
		content: input.content,
		source_document: input.source_document,
		confidence: input.confidence,
		isSuspicious: input.validation.isSuspicious,
		requiresHumanReview: input.validation.isSuspicious,
		reason: input.validation.sourceValidation.reason,
	};

	return QueryResponseSchema.parse(response);
}
