# Evidências de Validação — Exercício 3.1

## Resumo de Execução

**Data:** 2025-01-06  
**Função:** `validateSourceDocument()` em `src/services/response-validator.ts`  
**Teste Suite:** `tests/unit/response-validator.spec.ts`  
**Resultado:** ✅ **30/30 testes passando**

---

## Casos de Teste Executados

### Caso 1: Fonte Válida (Whitelist) ✅

Todas as 7 variações de fonte válida foram aprovadas:

```typescript
// Teste 1: POL-001
Input:  { content: "...", source_document: "POL-001" }
Output: { isSuspicious: false, isValidSource: true, reason: "Fonte validada com sucesso" }
Status: ✅ PASS

// Teste 2: PROC-042
Input:  { content: "...", source_document: "PROC-042" }
Output: { isSuspicious: false, isValidSource: true }
Status: ✅ PASS

// Teste 3: PROC-042-v2
Input:  { content: "...", source_document: "PROC-042-v2" }
Output: { isSuspicious: false, isValidSource: true }
Status: ✅ PASS

// Teste 4: SLA-2024
Input:  { content: "...", source_document: "SLA-2024" }
Output: { isSuspicious: false, isValidSource: true }
Status: ✅ PASS

// Teste 5: FAQ-Atendimento
Input:  { content: "...", source_document: "FAQ-Atendimento" }
Output: { isSuspicious: false, isValidSource: true }
Status: ✅ PASS

// Teste 6: Normalização de casing (lowercase)
Input:  { content: "...", source_document: "pol-001" }
Output: { isSuspicious: false, normalizedSource: "POL-001" }
Status: ✅ PASS (trim + uppercase funcionando)

// Teste 7: Trim de espaços
Input:  { content: "...", source_document: "  POL-001  " }
Output: { isSuspicious: false, normalizedSource: "POL-001" }
Status: ✅ PASS (espaços removidos)
```

**Evidência:**
```
✓ Caso 1: Fonte válida (whitelist) (7)
  ✓ deve aceitar POL-001
  ✓ deve aceitar PROC-042
  ✓ deve aceitar PROC-042-v2
  ✓ deve aceitar SLA-2024
  ✓ deve aceitar FAQ-Atendimento
  ✓ deve normalizar casing: "pol-001" (lowercase) deve ser aceito
  ✓ deve trim espaços: "  POL-001  " deve ser aceito
```

---

### Caso 2: Fonte Inválida (Fora da Whitelist) ✅

Todas as 3 variações de fonte inválida foram marcadas como suspeita corretamente:

```typescript
// Teste 1: PROC-999 (inexistente)
Input:  { content: "Resposta com fonte não autorizada.", source_document: "PROC-999" }
Output: {
  isSuspicious: true,
  isValidSource: false,
  reason: "Fonte citada \"PROC-999\" não está na whitelist canônica. Possível alucinação..."
}
Status: ✅ PASS (alucinação detectada)

// Teste 2: DOC-DESCONHECIDO
Input:  { content: "Resposta com fonte desconhecida.", source_document: "DOC-DESCONHECIDO" }
Output: { isSuspicious: true, isValidSource: false }
Status: ✅ PASS (fonte não autorizada detectada)

// Teste 3: confluence-wiki-page (origem interna não autorizada)
Input:  { content: "Resposta que cita wiki interno...", source_document: "confluence-wiki-page" }
Output: { isSuspicious: true, isValidSource: false }
Status: ✅ PASS (origem não controlada detectada)
```

**Evidência:**
```
✓ Caso 2: Fonte inválida (não está na whitelist) (3)
  ✓ deve marcar como suspeita: "PROC-999" (inexistente)
  ✓ deve marcar como suspeita: "DOC-DESCONHECIDO"
  ✓ deve marcar como suspeita: "confluence-wiki-page" (origem interna não autorizada)
```

---

### Caso 3: Fonte Ausente ou Vazia ✅

Todas as 4 variações de ausência/vazio foram marcadas como suspeita corretamente:

```typescript
// Teste 1: source_document === undefined
Input:  { content: "Resposta sem fonte citada.", source_document: undefined }
Output: {
  isSuspicious: true,
  isValidSource: false,
  normalizedSource: undefined,
  reason: "Campo source_document está ausente. Resposta não cita fonte."
}
Status: ✅ PASS (ausência detectada)

// Teste 2: source_document === null
Input:  { content: "Resposta com null.", source_document: null }
Output: { isSuspicious: true, isValidSource: false }
Status: ✅ PASS (null tratado como ausente)

// Teste 3: source_document === "" (string vazia)
Input:  { content: "Resposta com string vazia.", source_document: "" }
Output: {
  isSuspicious: true,
  reason: "Campo source_document está vazio."
}
Status: ✅ PASS (vazio detectado após trim)

// Teste 4: source_document === "   " (apenas espaços)
Input:  { content: "Resposta com espaços.", source_document: "   " }
Output: { isSuspicious: true }
Status: ✅ PASS (espaços normalizados para vazio)
```

**Evidência:**
```
✓ Caso 3: Fonte ausente ou vazia (4)
  ✓ deve marcar como suspeita quando source_document é undefined
  ✓ deve marcar como suspeita quando source_document é null
  ✓ deve marcar como suspeita quando source_document é string vazia
  ✓ deve marcar como suspeita quando source_document é apenas espaços
```

---

## Testes de Validação Completa (Schema + Fonte)

### `validateResponse()` — Pipeline Completo ✅

```typescript
// Teste 1: Resposta válida (schema + fonte ok)
Input:  { content: "Política de devolução.", source_document: "POL-001", confidence: 0.95 }
Output: { isValid: true, isSuspicious: false, errors: [] }
Status: ✅ PASS

// Teste 2: Resposta suspeita (schema ok, fonte inválida)
Input:  { content: "Resposta com fonte ruim.", source_document: "FONTE-DESCONHECIDA", confidence: 0.8 }
Output: { isValid: false, isSuspicious: true, sourceValidation.isSuspicious: true }
Status: ✅ PASS (even though schema validated, source validation flagged suspicious)

// Teste 3: Resposta inválida (schema falha — content ausente)
Input:  { source_document: "POL-001", confidence: 0.9 }
Output: { isValid: false, isSuspicious: true, errors: ["Required"] }
Status: ✅ PASS (schema Zod catch missing field)

// Teste 4: Confidence fora do range
Input:  { content: "Resposta.", source_document: "POL-001", confidence: 1.5 }
Output: { isValid: false, errors: [error about confidence] }
Status: ✅ PASS (schema validação de range funcionando)
```

**Evidência:**
```
✓ validateResponse (7)
  ✓ deve validar resposta completa com fonte válida
  ✓ deve marcar resposta como suspeita mesmo com schema válido se fonte for inválida
  ✓ deve rejeitar resposta se schema Zod falhar (content ausente)
  ✓ deve rejeitar resposta se content for vazio
  ✓ deve aceitar resposta sem source_document quando schema permite (optional)
  ✓ deve preservar confidence quando válido
  ✓ deve rejeitar confidence fora do range [0, 1]
```

---

## Exemplos de Uso Integrado (Console Output)

### Exemplo 1: Resposta Válida com POL-001 ✓

```
Input:
{
  content: "A política de devolução permite retorno em até 30 dias.",
  source_document: "POL-001",
  confidence: 0.97
}

Output (console log):
✓ Entrada válida: {...}
✓ Resultado: {
  isValid: true,
  isSuspicious: false,
  reason: "Fonte \"POL-001\" validada com sucesso contra whitelist."
}

Status: ✅ PASS — Resposta confiável e rastreável
```

### Exemplo 2: Resposta com Fonte Inválida ⚠

```
Input:
{
  content: "Segundo fontes internas não catalogadas, é possível...",
  source_document: "internal-memo-2025",
  confidence: 0.72
}

Output (console log):
⚠ Entrada com fonte suspeita: {...}
⚠ Resultado: {
  isValid: false,
  isSuspicious: true,
  reason: "Fonte citada \"internal-memo-2025\" não está na whitelist canônica. 
           Possível alucinação ou fonte não importada. 
           Whitelist válida: POL-001, PROC-042, PROC-042-v2, SLA-2024, FAQ-Atendimento"
}

Status: ⚠ FLAGGED — Resposta deve ser revisada antes de retornar ao cliente
```

### Exemplo 3: Resposta sem Fonte (Ausente) ⚠

```
Input:
{
  content: "De acordo com nossas informações...",
  confidence: 0.6
  // source_document not provided
}

Output (console log):
⚠ Entrada sem fonte: {...}
⚠ Resultado: {
  isValid: false,
  isSuspicious: true,
  reason: "Campo source_document está ausente. Resposta não cita fonte."
}

Status: ⚠ FLAGGED — Resposta não é rastreável. Marca para revisão manual (HITL).
```

---

## Estatísticas de Cobertura

| Métrica | Valor |
|---|---|
| **Test Files** | 1 passado |
| **Total Tests** | 30 passados |
| **Success Rate** | 100% ✅ |
| **Coverage Grupos** | 5 suites (validateSourceDocument, validateResponse, getValidSources, ResponseSchema, Exemplos Integrados) |
| **Casos Críticos** | 3 cobertos (Válido, Inválido, Ausente) |
| **Edge Cases** | 7+ (casing, espaços, null, vazio, schema errors, etc.) |
| **Tempo Execução** | ~9.92s |

---

## Checklist de Validação ✅

- ✅ Fonte válida (POL-001, PROC-042, etc.) → não suspeita
- ✅ Fonte inválida (PROC-999, internal-memo) → suspeita com motivo
- ✅ Fonte ausente (undefined/null) → suspeita com motivo claro
- ✅ Fonte vazia (string vazia, espaços) → suspeita
- ✅ Normalização funciona (lowercase, trim)
- ✅ Schema Zod valida estrutura obrigatória
- ✅ Campos opcionais (confidence, metadata) validados quando presentes
- ✅ Logging estruturado com razão clara em cada caso
- ✅ Função determinística (sem IA, sem randomness)
- ✅ TypeScript strict, sem `any` implícito

---

## Próximas Etapas de Integração

### Integração em Handler HTTP de Query

```typescript
// pseudocode: src/functions/query/index.ts
import { validateResponse } from '../../services/response-validator';

export async function queryHandler(req: HttpRequest): Promise<HttpResponse> {
  // 1. Parse input com Zod
  const input = parseQueryInput(req.body);
  
  // 2. Chamar modelo LLM
  const modelResponse = await llm.complete(input);
  
  // 3. Validar resposta com nossa função
  const validation = validateResponse(modelResponse);
  
  // 4. Registrar em logs estruturados
  logger.info('query_response_validated', {
    isSuspicious: validation.isSuspicious,
    reason: validation.sourceValidation.reason,
    source: validation.sourceValidation.normalizedSource,
  });
  
  // 5. Retornar resposta com flag de suspeita
  return {
    status: 200,
    body: {
      content: modelResponse.content,
      source_document: modelResponse.source_document,
      isSuspicious: validation.isSuspicious, // ← FLAG CRÍTICA
      requiresHumanReview: validation.isSuspicious, // ← Para HITL
    },
  };
}
```

---

## Referências

- **Implementação:** [response-validator.ts](../../src/services/response-validator.ts)
- **Testes:** [response-validator.spec.ts](../../tests/unit/response-validator.spec.ts)
- **Design do Harness:** [design-harness-5-camadas.md](./design-harness-5-camadas.md)
- **AGENTS.md:** Constitution do projeto com regras obrigatórias
- **ADR-0002:** Context budget (~4K system + ~8K chunks)

---

**Status Final Fase D:** ✅ **VALIDADO — Função determinística de verificação de source_document está operacional com 30/30 testes passando.**
