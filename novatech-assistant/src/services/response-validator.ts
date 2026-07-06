/**
 * Response Validator — Verificação determinística de confiabilidade
 * 
 * Responsabilidades:
 * - Validar estrutura de resposta do modelo (schema Zod)
 * - Verificar fonte citada contra whitelist canônica
 * - Marcar resposta como suspeita quando requisitos falham
 * - Registrar decisão em logs estruturados
 */

import { z } from 'zod';

// ============================================================================
// SCHEMAS & TYPES
// ============================================================================

/**
 * Whitelist canônica de fontes válidas da NovaTech
 * Atualizar apenas com aprovação de Product Specialist + Legal
 */
const VALID_SOURCES = [
  'POL-001',
  'PROC-042',
  'PROC-042-v2',
  'SLA-2024',
  'FAQ-Atendimento',
] as const;

/**
 * Schema de resposta obrigatório (structured output)
 * Contrato que todo modelo deve respeitar antes de verificação
 */
export const ResponseSchema = z.object({
  content: z.string().min(1, 'Conteúdo não pode estar vazio'),
  source_document: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  metadata: z.record(z.any()).optional(),
});

export type Response = z.infer<typeof ResponseSchema>;

/**
 * Resultado da validação de fonte
 * Indica se resposta deve ser marcada como suspeita e razão
 */
export interface SourceValidationResult {
  isSuspicious: boolean;
  reason: string;
  normalizedSource?: string;
  isValidSource?: boolean;
}

/**
 * Resultado completo de verificação de resposta
 */
export interface ValidationResult {
  isValid: boolean;
  isSuspicious: boolean;
  sourceValidation: SourceValidationResult;
  errors: string[];
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Normaliza valor de source_document
 * Remove espaços, padroniza casing para comparação
 * 
 * @param source Raw source_document value
 * @returns Normalized source or undefined se vazio
 */
function normalizeSource(source: string | undefined): string | undefined {
  if (!source) return undefined;
  return source.trim().toUpperCase();
}

/**
 * Verifica se source normalizado está na whitelist canônica
 * 
 * @param normalizedSource Normalized source string
 * @returns true se na whitelist, false caso contrário
 */
function isSourceInWhitelist(normalizedSource: string | undefined): boolean {
  if (!normalizedSource) return false;
  const upperSource = normalizedSource.toUpperCase();
  return VALID_SOURCES.some((validSource) => validSource.toUpperCase() === upperSource);
}

/**
 * Valida campo source_document contra whitelist canônica
 * 
 * Regras de decisão:
 * - source_document ausente → suspeita (sem fonte citada)
 * - source_document vazio → suspeita
 * - source_document fora da whitelist → suspeita (possível alucinação)
 * - source_document na whitelist → não suspeita
 * 
 * @param response Resposta do modelo
 * @returns SourceValidationResult com flag isSuspicious e motivo
 */
export function validateSourceDocument(response: Response): SourceValidationResult {
  // Caso 1: source_document não foi fornecido
  if (response.source_document === undefined || response.source_document === null) {
    return {
      isSuspicious: true,
      reason: 'Campo source_document está ausente. Resposta não cita fonte.',
      normalizedSource: undefined,
      isValidSource: false,
    };
  }

  // Normalizar para comparação (trim, uppercase)
  const normalized = normalizeSource(response.source_document);

  // Caso 2: source_document está vazio após normalização
  if (!normalized) {
    return {
      isSuspicious: true,
      reason: `Campo source_document está vazio. Valor bruto: "${response.source_document}"`,
      normalizedSource: undefined,
      isValidSource: false,
    };
  }

  // Caso 3: verificar contra whitelist
  const isValid = isSourceInWhitelist(normalized);

  if (!isValid) {
    return {
      isSuspicious: true,
      reason: `Fonte citada "${response.source_document}" não está na whitelist canônica. Possível alucinação ou fonte não importada. Whitelist válida: ${VALID_SOURCES.join(', ')}`,
      normalizedSource: normalized,
      isValidSource: false,
    };
  }

  // Caso 4: fonte na whitelist → resposta não suspeita
  return {
    isSuspicious: false,
    reason: `Fonte "${response.source_document}" validada com sucesso contra whitelist.`,
    normalizedSource: normalized,
    isValidSource: true,
  };
}

/**
 * Valida resposta completa: estrutura Zod + verificação de fonte
 * 
 * Pipeline:
 * 1. Validar schema Zod (structured output obrigatório)
 * 2. Chamar validateSourceDocument para check determinístico
 * 3. Retornar resultado consolidado
 * 
 * @param rawResponse Resposta bruta (pode não estar tipada)
 * @returns ValidationResult com erros estruturados e flags de suspeita
 */
export function validateResponse(rawResponse: unknown): ValidationResult {
  const errors: string[] = [];
  let response: Response | undefined;
  let sourceValidation: SourceValidationResult = {
    isSuspicious: true,
    reason: 'Validação de estrutura falhou. Sem schema validado.',
  };

  // Validar estrutura Zod
  const schemaValidation = ResponseSchema.safeParse(rawResponse);
  if (!schemaValidation.success) {
    const issues = schemaValidation.error.issues.map((issue) => issue.message);
    errors.push(...issues);
    return {
      isValid: false,
      isSuspicious: true,
      sourceValidation,
      errors,
    };
  }

  response = schemaValidation.data;

  // Validar source_document
  sourceValidation = validateSourceDocument(response);

  // Consolidar resultado
  const isSuspicious = sourceValidation.isSuspicious;

  return {
    isValid: schemaValidation.success && !isSuspicious,
    isSuspicious,
    sourceValidation,
    errors,
  };
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Retorna lista de fontes válidas
 * Útil para consumidor construir UI de seleção ou documentação
 */
export function getValidSources(): readonly string[] {
  return VALID_SOURCES;
}
