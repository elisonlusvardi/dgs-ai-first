# Exercício 3.2 — FASE C — Consolidação de Riscos

## Lista Consolidada de Riscos Pré-Go-Live

Após Fase A (Tech Lead) + Fase B (Co-Review Claude), lista final sem duplicações, com dependências explícitas.

---

## 🔴 RISCOS CRÍTICOS (Bloqueantes para Go-Live)

### R1: Query Endpoint não está implementado (STUB vazio)

**Descrição:**
- Arquivo: `src/functions/query/handler.ts`
- Estado: STUB com `throw new Error("Not implemented")`
- Impacto: Sem handler, não há endpoint funcional; demonstração para diretoria impossível; go-live falha completamente

**Dependências:**
- R5 (logger.ts vazio) — handler precisa registrar logs
- R6 (errors.ts vazio) — handler precisa normalizar erros
- R7 (config.ts vazio) — handler precisa variáveis (timeout, budget, modelo)
- R10 (response-validator disponível) — positivo, handler vai chamar validateResponse()

**Verificação Obrigatória:**
1. Implementação de handler completo com validação Zod
2. Teste unitário com sucesso, falha de validação, erro interno
3. Teste E2E pipeline → query → resposta com source_document

**Critério de Pronto:**
- Handler implementado com 100+ linhas de código
- Testes passando (unitário + E2E)
- Logs estruturados em cada etapa (input, retrieval, modelo, output)
- Integrado com response-validator de exercício 3.1

**Esforço Estimado:** 3-4 dias (depende de R5, R6, R7)

---

### R2: Pipeline de Ingestão vazio (decisão de escopo urgente)

**Descrição:**
- Arquivos: `src/pipeline/chunker.ts`, `embedder.ts`, `extractor.ts`, `indexer.ts` — todos vazios
- Impacto: Se pipeline é escopo de go-live, sem ingestão não há corpus; retrieval falha; assistente não funciona
- Se pipeline é fase 2, este risco se aplica apenas se scope for confirmado incorretamente

**Verificação Urgente (esta semana):**
- Confirmar com Product: pipeline é go-live ou fase 2?
- Se go-live: estimar esforço para implementar em 2 semanas
- Se fase 2: documentar explicitamente como falback (mock corpus? ou real corpus pré-carregado?)

**Cenários:**
1. **Cenário A (Pipeline go-live):** Risco ALTO; bloqueia R1 (query endpoint precisa de chunks)
2. **Cenário B (Pipeline fase 2):** Usar corpus pré-carregado/mock; risco MÉDIO (fallback possível)
3. **Cenário C (Pipeline paralelo):** Dev 2.2 implementa; risco MÉDIO (timing crítico)

**Critério de Pronto (se go-live):**
- chunker.ts implementado com suporte a PDFs, markdown
- extractor.ts extrai texto bruto
- embedder.ts (pode ser mock com Azure OpenAI embeddings ou local)
- indexer.ts persiste em corpus (data/retrieval-corpus/)
- Teste: ingerir 1 documento real (ex: POL-001) e recuperar chunks

**Esforço Estimado (se go-live):** 5-7 dias (paralelo com R1)

---

### R3: AGENTS.md incompleto (3 seções TODO críticas)

**Descrição:**
- Seções vazias: "Product Rules & Guardrails", "Testing Standards", "Project Management Rules"
- Impacto: Vácuo de decisão; desenvolvedores sem guia de product rules, testes obrigatórios, project management
- Risco de comportamento inconsistente do assistente (sem product rules claras)

**Verificação Obrigatória:**
1. Auditoria completa de AGENTS.md: cada regra tem Justificativa + Verificação?
2. Resolver TODOs: preencher ou fechar escopo explicitamente?
3. Validar que nenhuma regra contradiz outra (ex: "proibido console.log" vs "log para debug")

**Critério de Pronto:**
- Nenhum TODO em seções críticas (Tech Lead, Coding Standards, Build & Deploy)
- TODOs em seções secundárias (Product, Testing, Project Management) podem ficar se escopo for explícito: "será preenchido em exercício 2.3"
- 100% de regras operacionais (não genéricas)

**Esforço Estimado:** 1 dia

---

## 🟡 RISCOS MÉDIOS (Significativos, precisam mitigação)

### R4: System-prompt sem rastreibilidade de 6 iterações

**Descrição:**
- Arquivo: `prompts/system-prompt.md` — 5 linhas muito genéricas
- Problema: Prompt-changelog.md vazio; 6 iterações mencionadas em prompt mas sem história de mudanças
- Impacto: Impossível auditar por que respostas do modelo mudaram; rollback difícil; governança perdida

**Verificação Obrigatória:**
1. Recuperar histórico das 6 iterações (git log ou conversas com Claude)
2. Ou descartar história falsa e começar changelog de agora

**Critério de Pronto:**
- prompt-changelog.md preenchido com todas as iterações ou declaração: "v1 base do cenário 1, próximas versões rastreadas a partir de agora"
- system-prompt.md expandido com guardrails concretos (ex: "nunca cite fonte externa", "sempre cite source_document")

**Esforço Estimado:** 1 dia

---

### R5: Logger centralizado não implementado (src/shared/logger.ts vazio)

**Descrição:**
- Arquivo: `src/shared/logger.ts` — vazio
- Obrigatoriedade: AGENTS.md exige logging via pino com formato estruturado
- Impacto: Sem logger, observabilidade é impossível; diagnóstico de falhas em produção inviável
- Bloqueador de R1 (query handler precisa registrar logs)

**Verificação Obrigatória:**
1. Logger implementado com pino, formato JSON
2. Campos obrigatórios: timestamp, level, context, message, metadata
3. Integração com query handler: registrar input, retrieval, modelo, output

**Critério de Pronto:**
- logger.ts exporta funções: `logger.info()`, `logger.warn()`, `logger.error()`
- Handler chama logger em 4+ pontos críticos
- Testes passando

**Esforço Estimado:** 1 dia

---

### R6: Erro handler centralizado não implementado (src/shared/errors.ts vazio)

**Descrição:**
- Arquivo: `src/shared/errors.ts` — vazio
- Obrigatoriedade: AGENTS.md exige tratamento de erro centralizado
- Impacto: HTTP responses inconsistentes; cliente não sabe como tratar erros
- Bloqueador de R1 (query handler precisa normalizar erros)

**Verificação Obrigatória:**
1. AppError class com code, statusCode, retryable, message
2. Mapeamento consistente: TypeError → 400, TimeoutError → 504, DatabaseError → 500
3. Integração com query handler

**Critério de Pronto:**
- errors.ts exporta AppError class
- Handler trata try/catch e converte para AppError
- HTTP responses têm estrutura consistente: `{ error: { code, message, statusCode } }`

**Esforço Estimado:** 0.5 dia

---

### R7: Config centralizado não implementado (src/shared/config.ts vazio)

**Descrição:**
- Arquivo: `src/shared/config.ts` — vazio
- Impacto: Variáveis críticas (timeout, budget de contexto, credenciais Azure OpenAI) não têm controle centralizado
- Falta integração com Azure OpenAI (chave da API, modelo a usar)

**Verificação Obrigatória:**
1. Config centralizado: timeout, budget, modelo, chaves de ambiente
2. Variáveis de ambiente: `AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`, `QUERY_TIMEOUT_MS`, etc.
3. Integração com query handler

**Critério de Pronto:**
- config.ts exporta objeto config com valores tipados
- Handler lê config centralizado (não hardcoded)
- .env.example preenchido com todas as variáveis

**Esforço Estimado:** 0.5 dia

---

### R8: Testes E2E pipeline → query → response não foram mapeados

**Descrição:**
- Achado de Claude: Não há evidência de testes E2E integrados
- Impacto: Integração entre pipeline e query endpoint não é validada; risco de falha em produção
- Teste unitário não encontra problemas de integração (ex: corpus não alimentado, retrieval falha)

**Verificação Obrigatória:**
1. Confirmação: existem testes E2E em `tests/integration/` ou `tests/e2e/`?
2. Se não existem: priorizar criação

**Critério de Pronto:**
- Teste E2E: ingerir documento → buscar query → receber resposta com source_document
- Teste com 1 documento real (ex: POL-001)
- Teste passando antes de go-live

**Esforço Estimado:** 2-3 dias (paralelo com R1/R2)

---

### R9: Falta automatização de governança em AGENTS.md

**Descrição:**
- Achado de Claude: Regras em AGENTS.md não têm gates automáticos
- Exemplo: "console.log proibido" é verificado manualmente, não por lint
- Impacto: Risco de drift; regras são ignoradas sem penalidade

**Verificação Obrigatória:**
1. Identificar quais regras podem ser automatizadas (console.log, any implícito, naming, etc.)
2. Configurar eslint/prettier para enforçar

**Critério de Pronto:**
- eslint.config.js ativa com regras críticas
- PR gate: build falha se regra violada
- Desenvolvimento local: `npm run lint` detecta violações

**Esforço Estimado:** 1 dia

---

## 🟢 RISCOS BAIXOS (Secundários, melhoria de qualidade)

### R10: Skills Foundation vazias (ambiguidade)

**Descrição:**
- Arquivos vazios: `skills/foundation/error-handling.md`, `project-structure.md`, `typescript-conventions.md`
- Impacto: Desenvolvedores veem arquivo vazio e não sabem se é "TODO" ou "não relevante"
- Não bloqueia go-live

**Critério de Pronto:**
- Remover ou preencher minimamente
- Se remover: adicionar comentário em AGENTS.md explicando por que
- Se preencher: adicionar exemplos concretos

**Esforço Estimado:** 0.5 dia (baixa prioridade)

---

### R11: Skills Domain incompletas (azure-functions está ok, mas react + testing vazias)

**Descrição:**
- `react-components.md`, `testing-patterns.md` vazios
- `azure-functions-endpoint.md` tem conteúdo ok
- Impacto: React components em `src/web/` sem guidance; testing sem padrões documentados
- Não bloqueia backend go-live

**Critério de Pronto:**
- Decidir: remover ou preencher
- Se preencher: prioridade baixa (pós-go-live)

**Esforço Estimado:** 0.5 dia (baixa prioridade)

---

## Matriz de Dependências

```
R1 (Query Handler)
  ├─ R5 (Logger) → Implementar primeiro
  ├─ R6 (Errors) → Implementar primeiro
  └─ R7 (Config) → Implementar primeiro

R2 (Pipeline) — DECISÃO INDEPENDENTE
  └─ Confirmar escopo esta semana

R3 (AGENTS.md) — INDEPENDENTE
  └─ 1 dia, pode ser paralelo

R4 (System-Prompt Changelog) — INDEPENDENTE
  └─ 1 dia, pode ser paralelo

R8 (E2E Tests)
  ├─ Depende de R1 (query implementado)
  └─ Depende de R2 (pipeline definido)

R9 (Automatização Governança) — INDEPENDENTE
  └─ 1 dia, melhoria de processo
```

---

## Checklist de Consolidação

- ✅ Sem duplicações de risco?
- ✅ Dependências explícitas entre riscos?
- ✅ Severidade justificada para cada risco?
- ✅ Verificação obrigatória concreta (não genérica)?
- ✅ Critério de pronto objetivo?
- ✅ Esforço estimado realista?

**Status Fase C:** ✅ COMPLETO — 11 riscos consolidados (3 críticos, 6 médios, 2 baixos) com dependências mapeadas.
