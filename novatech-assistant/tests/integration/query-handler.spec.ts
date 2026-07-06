import { describe, expect, it } from 'vitest';
import { queryHandler } from '../../src/functions/query/handler';

describe('queryHandler integration', () => {
  it('deve responder com 200 para request valida', async () => {
    const result = await queryHandler({
      body: {
        query: 'devolucao',
      },
    });

    expect(result.status).toBe(200);

    const body = result.body as {
      content: string;
      source_document?: string;
      isSuspicious: boolean;
      requiresHumanReview: boolean;
      reason: string;
    };

    expect(body.content.length).toBeGreaterThan(0);
    expect(typeof body.reason).toBe('string');
    expect(typeof body.isSuspicious).toBe('boolean');
    expect(body.requiresHumanReview).toBe(body.isSuspicious);
  });

  it('deve retornar 400 quando request for invalida', async () => {
    const result = await queryHandler({
      body: {
        query: 'oi',
      },
    });

    expect(result.status).toBe(400);

    const body = result.body as {
      error: { code: string; statusCode: number; message: string };
    };

    expect(body.error.code).toBe('INVALID_REQUEST');
    expect(body.error.statusCode).toBe(400);
    expect(body.error.message).toContain('query deve ter pelo menos 3 caracteres');
  });

  it('deve retornar 400 para formato HTTP invalido', async () => {
    const result = await queryHandler({
      invalid: true,
    });

    expect(result.status).toBe(400);

    const body = result.body as {
      error: { code: string; statusCode: number };
    };

    expect(body.error.code).toBe('INVALID_HTTP_REQUEST');
    expect(body.error.statusCode).toBe(400);
  });
});
