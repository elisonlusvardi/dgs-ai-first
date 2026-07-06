import type { RetrievedChunk } from '../shared/types';

export function buildPrompt(query: string, chunks: RetrievedChunk[]): string {
	const context = chunks
		.map((chunk, index) => `${index + 1}. [${chunk.source_document}] ${chunk.content}`)
		.join('\n');

	return [
		'Voce e o assistente NovaTech.',
		'Responda usando apenas os chunks abaixo e cite source_document.',
		'',
		`Pergunta: ${query}`,
		'',
		'Contexto:',
		context,
	].join('\n');
}
