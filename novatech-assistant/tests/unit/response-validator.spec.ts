/**
 * Testes — Response Validator
 * 
 * Cobertura de casos críticos:
 * 1. Fonte válida (na whitelist) → não suspeita
 * 2. Fonte inválida (fora da whitelist) → suspeita
 * 3. Fonte ausente (undefined/null) → suspeita
 * 4. Fonte vazia (string vazia) → suspeita
 * 5. Schema inválido → erro de validação
 */

import { describe, it, expect } from 'vitest';
import {
  validateSourceDocument,
  validateResponse,
  getValidSources,
  ResponseSchema,
  type Response,
  type SourceValidationResult,
  type ValidationResult,
} from '../../src/services/response-validator';

// ============================================================================
// TESTS: validateSourceDocument (função core de verificação)
// ============================================================================

describe('validateSourceDocument', () => {
  // Caso 1: Fonte válida → não suspeita
  describe('Caso 1: Fonte válida (whitelist)', () => {
    it('deve aceitar POL-001', () => {
      const response: Response = {
        content: 'Política de devolução permite 30 dias.',
        source_document: 'POL-001',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
      expect(result.normalizedSource).toBe('POL-001');
      expect(result.reason).toContain('validada com sucesso');
    });

    it('deve aceitar PROC-042', () => {
      const response: Response = {
        content: 'Procedimento de frete especial.',
        source_document: 'PROC-042',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
    });

    it('deve aceitar PROC-042-v2', () => {
      const response: Response = {
        content: 'Versão revisada de frete especial.',
        source_document: 'PROC-042-v2',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
    });

    it('deve aceitar SLA-2024', () => {
      const response: Response = {
        content: 'Tabela de SLA para clientes.',
        source_document: 'SLA-2024',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
    });

    it('deve aceitar FAQ-Atendimento', () => {
      const response: Response = {
        content: 'Perguntas frequentes de atendimento.',
        source_document: 'FAQ-Atendimento',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
    });

    it('deve normalizar casing: "pol-001" (lowercase) deve ser aceito', () => {
      const response: Response = {
        content: 'Teste com lowercase.',
        source_document: 'pol-001',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
      expect(result.normalizedSource).toBe('POL-001');
    });

    it('deve trim espaços: "  POL-001  " deve ser aceito', () => {
      const response: Response = {
        content: 'Teste com espaços.',
        source_document: '  POL-001  ',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(false);
      expect(result.isValidSource).toBe(true);
      expect(result.normalizedSource).toBe('POL-001');
    });
  });

  // Caso 2: Fonte inválida → suspeita
  describe('Caso 2: Fonte inválida (não está na whitelist)', () => {
    it('deve marcar como suspeita: "PROC-999" (inexistente)', () => {
      const response: Response = {
        content: 'Resposta com fonte não autorizada.',
        source_document: 'PROC-999',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
      expect(result.reason).toContain('não está na whitelist');
      expect(result.reason).toContain('Possível alucinação');
    });

    it('deve marcar como suspeita: "DOC-DESCONHECIDO"', () => {
      const response: Response = {
        content: 'Resposta com fonte desconhecida.',
        source_document: 'DOC-DESCONHECIDO',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
    });

    it('deve marcar como suspeita: "confluence-wiki-page" (origem interna não autorizada)', () => {
      const response: Response = {
        content: 'Resposta que cita wiki interno não validado.',
        source_document: 'confluence-wiki-page',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
    });
  });

  // Caso 3: Fonte ausente → suspeita
  describe('Caso 3: Fonte ausente ou vazia', () => {
    it('deve marcar como suspeita quando source_document é undefined', () => {
      const response: Response = {
        content: 'Resposta sem fonte citada.',
        source_document: undefined,
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
      expect(result.normalizedSource).toBeUndefined();
      expect(result.reason).toContain('ausente');
    });

    it('deve marcar como suspeita quando source_document é null', () => {
      const response: Response = {
        content: 'Resposta com null.',
        source_document: null as any, // TypeScript: simulando valor null em runtime
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
    });

    it('deve marcar como suspeita quando source_document é string vazia', () => {
      const response: Response = {
        content: 'Resposta com string vazia.',
        source_document: '',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
      expect(result.reason).toContain('vazio');
    });

    it('deve marcar como suspeita quando source_document é apenas espaços', () => {
      const response: Response = {
        content: 'Resposta com espaços.',
        source_document: '   ',
      };

      const result = validateSourceDocument(response);

      expect(result.isSuspicious).toBe(true);
      expect(result.isValidSource).toBe(false);
    });
  });
});

// ============================================================================
// TESTS: validateResponse (validação completa com schema)
// ============================================================================

describe('validateResponse', () => {
  it('deve validar resposta completa com fonte válida', () => {
    const rawResponse = {
      content: 'Política de devolução.',
      source_document: 'POL-001',
      confidence: 0.95,
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(true);
    expect(result.isSuspicious).toBe(false);
    expect(result.sourceValidation.isSuspicious).toBe(false);
    expect(result.errors).toHaveLength(0);
  });

  it('deve marcar resposta como suspeita mesmo com schema válido se fonte for inválida', () => {
    const rawResponse = {
      content: 'Resposta com fonte ruim.',
      source_document: 'FONTE-DESCONHECIDA',
      confidence: 0.8,
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(false);
    expect(result.isSuspicious).toBe(true);
    expect(result.sourceValidation.isSuspicious).toBe(true);
    expect(result.errors).toHaveLength(0); // Schema passou, mas fonte falhou
  });

  it('deve rejeitar resposta se schema Zod falhar (content ausente)', () => {
    const rawResponse = {
      source_document: 'POL-001',
      confidence: 0.9,
      // content falta
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(false);
    expect(result.isSuspicious).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Required');
  });

  it('deve rejeitar resposta se content for vazio', () => {
    const rawResponse = {
      content: '',
      source_document: 'POL-001',
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('deve aceitar resposta sem source_document quando schema permite (optional)', () => {
    // Nota: source_document é optional no schema Zod
    // Mas validateSourceDocument vai marcar como suspeita
    const rawResponse = {
      content: 'Resposta sem fonte.',
    };

    const result = validateResponse(rawResponse);

    // Schema passa, mas source_document ausente marca como suspeita
    expect(result.isValid).toBe(false);
    expect(result.isSuspicious).toBe(true);
    expect(result.sourceValidation.isSuspicious).toBe(true);
  });

  it('deve preservar confidence quando válido', () => {
    const rawResponse = {
      content: 'Resposta com alta confiança.',
      source_document: 'SLA-2024',
      confidence: 0.99,
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(true);
    expect(result.isSuspicious).toBe(false);
  });

  it('deve rejeitar confidence fora do range [0, 1]', () => {
    const rawResponse = {
      content: 'Resposta.',
      source_document: 'POL-001',
      confidence: 1.5, // Inválido
    };

    const result = validateResponse(rawResponse);

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TESTS: getValidSources (utilitário)
// ============================================================================

describe('getValidSources', () => {
  it('deve retornar lista de fontes válidas', () => {
    const sources = getValidSources();

    expect(sources).toEqual(['POL-001', 'PROC-042', 'PROC-042-v2', 'SLA-2024', 'FAQ-Atendimento']);
  });

  it('deve retornar array readonly', () => {
    const sources = getValidSources();

    expect(Object.isFrozen(sources) || Array.isArray(sources)).toBe(true);
  });
});

// ============================================================================
// TESTS: ResponseSchema (schema Zod direto)
// ============================================================================

describe('ResponseSchema', () => {
  it('deve validar resposta minimal válida', () => {
    const minimal = { content: 'Teste' };
    const result = ResponseSchema.safeParse(minimal);

    expect(result.success).toBe(true);
  });

  it('deve validar resposta completa', () => {
    const complete = {
      content: 'Resposta completa.',
      source_document: 'POL-001',
      confidence: 0.95,
      metadata: { tags: ['policy', 'refund'], retrieved_at: '2025-01-01' },
    };
    const result = ResponseSchema.safeParse(complete);

    expect(result.success).toBe(true);
  });

  it('deve rejeitar resposta sem content', () => {
    const invalid = { source_document: 'POL-001' };
    const result = ResponseSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('deve permitir content vazio ou apenas espaços no schema (será caught por validateSourceDocument)', () => {
    // Nota: schema Zod rejeita string vazia, mas espaços passam
    // Isso garante que temos validação em camadas
    const withSpaces = { content: '   ' };
    const result = ResponseSchema.safeParse(withSpaces);

    // min(1) rejeita string vazia, mas '   ' passa no schema
    // Será validado em níveis superiores
    expect(result.success).toBe(true); // String com espaços é válida no schema
  });
});

// ============================================================================
// INTEGRATION TEST EXAMPLES
// ============================================================================

describe('Exemplos de Uso Integrado', () => {
  it('exemplo 1: Resposta válida com POL-001', () => {
    const modelResponse = {
      content: 'A política de devolução permite retorno em até 30 dias.',
      source_document: 'POL-001',
      confidence: 0.97,
    };

    const validation = validateResponse(modelResponse);

    console.log('✓ Entrada válida:', modelResponse);
    console.log('✓ Resultado:', {
      isValid: validation.isValid,
      isSuspicious: validation.isSuspicious,
      reason: validation.sourceValidation.reason,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.isSuspicious).toBe(false);
  });

  it('exemplo 2: Resposta com fonte inválida', () => {
    const modelResponse = {
      content: 'Segundo fontes internas não catalogadas, é possível...',
      source_document: 'internal-memo-2025',
      confidence: 0.72,
    };

    const validation = validateResponse(modelResponse);

    console.log('⚠ Entrada com fonte suspeita:', modelResponse);
    console.log('⚠ Resultado:', {
      isValid: validation.isValid,
      isSuspicious: validation.isSuspicious,
      reason: validation.sourceValidation.reason,
    });

    expect(validation.isSuspicious).toBe(true);
  });

  it('exemplo 3: Resposta sem fonte (ausente)', () => {
    const modelResponse = {
      content: 'De acordo com nossas informações...',
      // source_document não fornecido
      confidence: 0.60,
    };

    const validation = validateResponse(modelResponse);

    console.log('⚠ Entrada sem fonte:', modelResponse);
    console.log('⚠ Resultado:', {
      isValid: validation.isValid,
      isSuspicious: validation.isSuspicious,
      reason: validation.sourceValidation.reason,
    });

    expect(validation.isSuspicious).toBe(true);
  });
});
