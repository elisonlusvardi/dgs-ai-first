export interface AppConfig {
	queryTimeoutMs: number;
	modelName: string;
	maxChunks: number;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
	if (!value) return fallback;
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed <= 0) return fallback;
	return parsed;
}

export const config: AppConfig = {
	queryTimeoutMs: parsePositiveInt(process.env.QUERY_TIMEOUT_MS, 5000),
	modelName: process.env.MODEL_NAME ?? 'mock-novatech-v1',
	maxChunks: parsePositiveInt(process.env.MAX_CHUNKS, 3),
};
