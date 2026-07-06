import type { RetrievedChunk } from '../shared/types';

const CORPUS: RetrievedChunk[] = [
	{
		id: 'chunk-pol-001-1',
		source_document: 'POL-001',
		content: 'A politica de devolucao permite retorno em ate 30 dias apos o recebimento.',
		score: 0.95,
	},
	{
		id: 'chunk-proc-042-1',
		source_document: 'PROC-042',
		content: 'O frete especial deve ser aprovado para cargas acima de 50kg.',
		score: 0.89,
	},
	{
		id: 'chunk-sla-2024-1',
		source_document: 'SLA-2024',
		content: 'Clientes enterprise possuem SLA prioritario com resposta em ate 2 horas.',
		score: 0.87,
	},
];

export async function retrieveRelevantChunks(query: string, maxChunks: number): Promise<RetrievedChunk[]> {
	const q = query.toLowerCase();
	const scored = CORPUS.map((chunk) => {
		const contains = chunk.content.toLowerCase().includes(q) || chunk.source_document.toLowerCase().includes(q);
		return {
			...chunk,
			score: contains ? chunk.score : Math.max(chunk.score - 0.35, 0.1),
		};
	});

	return scored.sort((a, b) => b.score - a.score).slice(0, maxChunks);
}
