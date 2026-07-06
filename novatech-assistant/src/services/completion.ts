import type { RetrievedChunk } from '../shared/types';

interface CompletionInput {
	prompt: string;
	chunks: RetrievedChunk[];
}

interface CompletionOutput {
	content: string;
	source_document?: string;
	confidence: number;
}

export async function completeAnswer(input: CompletionInput): Promise<CompletionOutput> {
	const topChunk = input.chunks[0];

	if (!topChunk) {
		return {
			content: 'Nao encontrei informacao suficiente nos documentos disponiveis.',
			source_document: undefined,
			confidence: 0.2,
		};
	}

	if (!input.prompt) {
		return {
			content: 'Prompt invalido para geracao de resposta.',
			source_document: undefined,
			confidence: 0,
		};
	}

	return {
		content: topChunk.content,
		source_document: topChunk.source_document,
		confidence: Math.min(Math.max(topChunk.score, 0), 1),
	};
}
