import { z } from 'zod';

export const QueryRequestSchema = z.object({
	query: z.string().min(3, 'query deve ter pelo menos 3 caracteres'),
	maxChunks: z.number().int().positive().max(5).optional(),
});

export const RetrievedChunkSchema = z.object({
	id: z.string(),
	source_document: z.string(),
	content: z.string(),
	score: z.number().min(0).max(1),
});

export const QueryResponseSchema = z.object({
	content: z.string(),
	source_document: z.string().optional(),
	confidence: z.number().min(0).max(1).optional(),
	isSuspicious: z.boolean(),
	requiresHumanReview: z.boolean(),
	reason: z.string(),
});

export type QueryRequest = z.infer<typeof QueryRequestSchema>;
export type RetrievedChunk = z.infer<typeof RetrievedChunkSchema>;
export type QueryResponse = z.infer<typeof QueryResponseSchema>;
