# Design do Harness — 5 Camadas (Exercício 3.1)

## Resumo Executivo

Este documento apresenta o design de governança e confiabilidade do NovaTech Assistant em **5 camadas** conforme framework obrigatório do exercício 3.1. Para cada camada, incluímos **estado atual**, **gaps identificados**, **ação de fechamento** e **prioridade**.

---

## 1. TOOL ORCHESTRATION

| Aspecto | Já Implementado | Gap | Ação para Fechar | Prioridade | Responsável |
|---|---|---|---|---|---|
| **Fluxo ingestão → retrieval → geração** | Estrutura modular (pipeline/, services/) existe; contratos Zod em rascunho | Sem tipos concretos Zod para request/response de cada etapa | Implementar schemas Zod em src/shared/types.ts para input/output de: ingestão, reranking, geração, validação de resposta | Alta | Tech Lead |
| **Contratos entre componentes** | AGENTS.md define handler HTTP obrigatório em 5 passos; direcionário explícito | Sem tipos de contrato formalizados entre service e handler; sem validação de boundary | Implementar validação Zod em cada handler HTTP de `src/functions/` (query, feedback, health); deletar dados intermediários não-validados | Alta | Tech Lead |
| **Pontos de falha e fallback** | Error abstraction em src/shared/errors.ts (vazio); logger centralizado previsto | Sem catch-all typed; sem mapeamento HTTP consistente de erro; sem fallback definido por cenário | Implementar classe AppError extends Error com `code: string; statusCode: number; retryable: boolean`; documentar fallback: retry com backoff em falha transiente; fail-open em falha de retrieval (marca resposta como suspeita) | Alta | Tech Lead |

**Síntese:** Estrutura modular pronta, mas contratos de tipo ainda vacios. Prioridade: formalizar tipos Zod para cada boundary e adicionar tratamento tipado de erro.

---

## 2. VERIFICATION LOOPS

| Aspecto | Já Implementado | Gap | Ação para Fechar | Prioridade | Responsável |
|---|---|---|---|---|---|
| **Validação estrutural (structured output)** | Template de response-validator.ts existe; nenhum código | Sem schema Zod para saída do modelo; sem verificação de campo obrigatório (source_document, confidence) | Implementar ResponseSchema em src/shared/types.ts com campos: `content: string; source_document: string; confidence: number; metadata?: Record<string,any>` | Alta | Tech Lead |
| **Validação de fonte citada** | Nenhuma | Sem verificação determinística se source_document está em whitelist canônica | **Implementar função `validateSourceDocument()` em src/services/response-validator.ts** (ver Fase C); registrar suspeita em logs estruturados | **Alta** | **Tech Lead** |
| **Ação quando output falha verificação** | Nenhuma | Sem decisão definida: rejeitar/marcar/retry? | Implementar policy: se suspeita, marcar resposta com `isSuspicious: true; reason: string` e devolver via endpoint; não rejeitar silenciosamente; permitir consumidor tomar decisão | Média | Product Specialist |

**Síntese:** Camada crítica ainda vazia. Validação de fonte é focal point do exercício 3.1. Prioridade: implementar função `validateSourceDocument()` e adicionar schema obrigatório de resposta.

---

## 3. CONTEXT & MEMORY

| Aspecto | Já Implementado | Gap | Ação para Fechar | Prioridade | Responsável |
|---|---|---|---|---|---|
| **Aderência a ADR-0002** | ADR-0002 mencionada em AGENTS.md: 4K system + 8K chunks; estratégia ~5 chunks de 1.5K; histórico máx 3 turnos | Sem implementação: sem logic de seleção de chunks, sem contador de tokens, sem prune de histórico | Implementar `ContextBudgetManager` em src/services/ com: `allocateTokens(systemPromptLen, queryLen) => budgetForChunks`; função de reranking/seleção de chunks por relevância+recência | Alta | Tech Lead |
| **Controle de budget de contexto** | AGENTS.md texto; nenhum código | Sem verificação em runtime: pode haver overflow de tokens e custo incontrolado | Adicionar middleware/função validadora pré-LLM: verifica `sum(system + chunks + history) <= 12K`; registra em logs estruturados; rejeita se exceder | Alta | Tech Lead |
| **Critério de seleção de chunks e histórico** | Strategy definida em AGENTS.md (relevância+recência, máx 3 turnos) | Sem implementação de seleção: pipeline carrega chunks arbitrários sem scoring | Implementar `selectChunks(query, candidates, budget) => selected[]` com scoring por TF-IDF/BM25 simples + recency weight; preservar em contexto a data de cada chunk | Média | Tech Lead |
| **Estratégia para evitar estouro de contexto** | Não existe | Sem mecanismo de pruning ou fallback se overflow | Implementar compactação de histórico: resumir turnos antigos em bullet points; excluir turno mais antigo se `total > budget - 500` tokens (margem de segurança) | Média | Tech Lead |

**Síntese:** ADR-0002 está definido, mas não materializado em código. Risco: queries futuras podem ultrapassar budget sem aviso. Prioridade: implementar ContextBudgetManager com validação pré-LLM.

---

## 4. GUARDRAILS

| Aspecto | Já Implementado | Gap | Ação para Fechar | Prioridade | Responsável |
|---|---|---|---|---|---|
| **Limite probabilístico via prompt** | AGENTS.md v2 inclui regras em seção "Product Rules & Guardrails"; seção vazia no arquivo real | Sem guardrails de produto concretizados no system prompt | **Ação:** Product Specialist deve preencher seção em AGENTS.md com 3-5 regras do cenário 1 (ex: "evitar recomendações sem fonte", "sinalizar conflito documental") | **Média** | **Product Specialist** |
| **Limite determinístico via código** | Nenhum | Sem check em código de règras de negócio (ex: nunca devolver resposta sem source_document) | Implementar guardrails em `src/services/response-validator.ts`: se `source_document` ausente/inválido, marcar `isSuspicious: true`; adicionar outras regras conforme Product Specialist definir | **Alta** | **Tech Lead** |
| **Structured outputs como contrato obrigatório** | Esboço: AGENTS.md menciona "Contrato obrigatório de handler HTTP v4"; schema vazio | Sem schema Zod para resposta; sem validação pós-modelo | Implementar ResponseSchema Zod obrigatória em handler HTTP de query; rejeitar respostas que não passem parse; documentar contrato em spec de endpoint | Alta | Tech Lead |
| **Ponto concreto de HITL (Human-in-the-Loop)** | Nenhum | Sem mecanismo de encaminhamento de respostas suspeitas para revisão humana | Implementar flag `requiresHumanReview: boolean` em resposta; quando `isSuspicious: true`, copiar para fila de revisão em logging estruturado; roteiro futuro: UI/dashboard de revisão | Baixa | Product Specialist / QA |

**Síntese:** Limite probabilístico ainda texto; determinístico é focal da Fase C. Ponto de HITL é rascunho. Prioridade: materializar guardrails em código e adicionar regras de produto em AGENTS.md.

---

## 5. OBSERVABILITY

| Aspecto | Já Implementado | Gap | Ação para Fechar | Prioridade | Responsável |
|---|---|---|---|---|---|
| **Logs estruturados** | Logger centralizado previsto (src/shared/logger.ts); arquivo vazio | Sem implementação: sem pino config, sem formato JSON, sem níveis de severidade | Implementar logger em src/shared/logger.ts: `logger.info() / .warn() / .error()` com campos obrigatórios `{ timestamp, level, context, message, metadata }`; export função global | Alta | Tech Lead |
| **Métricas minimas de qualidade e erro** | Nenhuma | Sem coleta de eventos: taxa de fonte suspeita, taxa de erro de validação, latência por etapa | Adicionar eventos estruturados: `logValidationResult(source, isSuspicious, reason)`, `logRequestLatency(etapa, ms)`, `logErrorByCode(errorCode)` em key decision points | Média | Observability Lead |
| **Alertas práticos para incidentes** | Nenhum | Sem definição de threshold ou regra de alerting | Documentar em `docs/exercicios/3.1/alertas-propostos.md`: ex. "se taxa de fonte suspeita > 10% em 5min, alertar escalation"; implementar query em futura plataforma de observação (DataDog, App Insights) | Baixa | Observability Lead |
| **Trilha de auditoria para governança** | Nenhuma | Sem registro imutável de decisões (qual chunk foi selecionado, por que fonte foi suspeita, quem validou) | Implementar audit logger separado: `auditLog(action, actor, resource, decision, timestamp)` para decisões críticas (seleção de versão documental, validação de fonte, HITL); armazenar em log estruturado com retenção 90 dias | Média | Compliance / Tech Lead |

**Síntese:** Infraestrutura de observação é rascunho. Logs estruturados são baseline. Métricas e alertas são secundários neste exercício. Prioridade: implementar logger centralizado com formato estruturado.

---

## Tabela de Síntese por Camada

| Camada | Ja Implementado | Gap Principal | Ação Crítica | Prioridade |
|---|---|---|---|---|
| **1. Tool Orchestration** | Estrutura modular | Sem tipos Zod de contrato | Formalizar schemas de boundary | Alta |
| **2. Verification Loops** | Template vazio | **Sem validação de fonte** | **Implementar `validateSourceDocument()`** | **Alta** |
| **3. Context & Memory** | ADR-0002 texto | Sem implementação de budget | Implementar ContextBudgetManager | Alta |
| **4. Guardrails** | Menção em AGENTS.md | Sem regras de código | Guardrails determinísticos em código | Alta |
| **5. Observability** | Previsto | Sem logs estruturados | Implementar logger centralizado | Média |

---

## Sequência Recomendada de Entrega

1. **Imediato (Fase C):** Implementar `validateSourceDocument()` — focal point do exercício
2. **Paralelo:** Formalizar tipos Zod (ResponseSchema, ErrorSchema)
3. **Paralelo:** Implementar logger centralizado
4. **Seguinte:** ContextBudgetManager com validação pré-LLM
5. **Refinamento:** Guardrails de produto (Product Specialist)
6. **Avançado:** HITL e alertas (fora de escopo 3.1)

---

## Riscos Residuais & Próximos Passos

### Riscos Identificados

| Risco | Impacto | Mitigação |
|---|---|---|
| Fonte suspeita não é sinalizada pq validação está vazia | Alto | ✅ Implementar função determinística em Fase C |
| Budget de contexto é excedido silenciosamente | Alto | Implementar contador de tokens pré-LLM; fail-safe a 12K |
| Resposta suspeita é devolvida sem marcar flag | Alto | Estrutura obrigatória `isSuspicious: boolean` em contrato |
| Não há trilha de auditoria de decisões críticas | Médio | Logs estruturados com contexto completo |
| Erro é devolvido sem tipagem; cliente não sabe como tratar | Médio | Schema de erro Zod obrigatório; mapeamento HTTP consistente |

### Próximos Passos Pós-3.1

1. **Implementar HITL:** Dashboard de respostas suspeitas para revisão manual (Exercício 3.2 ou Sprint seguinte)
2. **Integrar telemetria:** Enviar métricas de validação para plataforma de observação (DataDog/App Insights)
3. **Expandir guardrails:** Adicionar regras de conflito documental (ADR-0003), confidencialidade, etc.
4. **Teste com dados reais:** Executar função em produção com corpus completo da NovaTech para calibrar whitelist
5. **Refinar ContextBudgetManager:** Testar com queries complexas; ajustar estratégia de reranking

---

## Checklist de Auto-Validação ✓

- ✅ As 5 camadas foram cobertas sem lacunas?
- ✅ Cada camada tem "já implementado", "gap" e "ação"?
- ✅ Context & memory cita ADR-0002 de forma concreta?
- ✅ Guardrails menciona structured outputs e HITL?
- ✅ Entrega evita escopo extra não solicitado?

**Status:** Todas validadas ✓

---

## Referências Obrigatórias

- AGENTS.md — Constitution do projeto
- ADR-0002 — Context budget: 4K system + 8K chunks
- ADR-0003 — Vigência documental (não abordado em 3.1, mencionado para contexto)
- Specs em `novatech-assistant/specs/query-endpoint/` — Contract de endpoint de query
