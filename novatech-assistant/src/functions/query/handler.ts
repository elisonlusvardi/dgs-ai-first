import { buildPrompt } from '../../services/prompt-builder';
import { completeAnswer } from '../../services/completion';
import { validateResponse } from '../../services/response-validator';
import { retrieveRelevantChunks } from '../../services/search';
import { config } from '../../shared/config';
import { toAppError, toErrorPayload } from '../../shared/errors';
import { logger } from '../../shared/logger';
import { buildQueryResponse } from './response-builder';
import { parseHttpRequest, parseQueryRequest } from './validator';

interface HttpResponse {
  status: number;
  body: unknown;
}

export async function queryHandler(request: unknown): Promise<HttpResponse> {
  const startedAt = Date.now();

  try {
    const httpRequest = parseHttpRequest(request);
    const parsedRequest = parseQueryRequest(httpRequest.body);

    logger.info({ context: 'query', message: 'request_received', query: parsedRequest.query });

    const chunks = await retrieveRelevantChunks(
      parsedRequest.query,
      parsedRequest.maxChunks ?? config.maxChunks,
    );

    const prompt = buildPrompt(parsedRequest.query, chunks);
    const completion = await completeAnswer({ prompt, chunks });
    const validation = validateResponse(completion);

    const response = buildQueryResponse({
      content: completion.content,
      source_document: completion.source_document,
      confidence: completion.confidence,
      validation,
    });

    logger.info({
      context: 'query',
      message: 'response_validated',
      isSuspicious: response.isSuspicious,
      reason: response.reason,
      durationMs: Date.now() - startedAt,
    });

    return {
      status: 200,
      body: response,
    };
  } catch (error: unknown) {
    const appError = toAppError(error);

    logger.error({
      context: 'query',
      message: 'query_failed',
      code: appError.code,
      statusCode: appError.statusCode,
      durationMs: Date.now() - startedAt,
      timeoutMs: config.queryTimeoutMs,
      modelName: config.modelName,
    });

    return {
      status: appError.statusCode,
      body: toErrorPayload(appError),
    };
  }
}
