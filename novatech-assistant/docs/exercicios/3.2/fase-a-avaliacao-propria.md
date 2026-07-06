# Exercício 3.2 — Revisão Crítica de Riscos (Pré-Go-Live)

## FASE A — Avaliação Própria (Tech Lead)

### Contexto de Entrada
- Prazo: 2 semanas até go-live (demonstração para diretoria)
- Artefatos principais: AGENTS.md (15pp, 4 iterações), skills (3 criadas, 1 refinada), pipeline (60-70% IA), prompts (6 iterações, sem rastreio)
- Estado: Pré-produção; necessidade de validação forte antes de go-live

---

## Tabela de Avaliação de Riscos por Artefato

| Artefato | Risco de ter sido gerado por IA | Tipo de Risco | Severidade | Evidência a Verificar | Ação Recomendada |
|---|---|---|---|---|---|
| **AGENTS.md** | Médio (refinado 4x, parece iterado com feedback) | **Governança + Operação** | **ALTA** | 1. Contradições internas (ex: regras que se anulam); 2. Regras não operacionais (genéricas); 3. Referências a ADRs/specs que não existem; 4. Cobertura de todas as personas (Tech Lead, QA, Product, Delivery) | Executar linting de regras: cada regra tem Justificativa + Verificação? Há TODOs em seções críticas (Product Rules, Testing, Project Management)? |
| **Skills Foundation: error-handling.md** | Alto (arquivo vazio) | **Qualidade + Manutenção** | **BAIXA** | Arquivo literalmente vazio; sem exemplos, padrões ou DO/DON'T | Remover ou preencher com exemplos concretos; não é bloqueante para go-live |
| **Skills Foundation: project-structure.md** | Alto (arquivo vazio) | **Qualidade + Manutenção** | **BAIXA** | Arquivo literalmente vazio; sem diagramas ou guia de navegação | Remover ou preencher; não é bloqueante para go-live |
| **Skills Foundation: typescript-conventions.md** | Alto (arquivo vazio) | **Qualidade + Manutenção** | **BAIXA** | Arquivo literalmente vazio; sem convenções concretas | Remover ou preencher; não é bloqueante para go-live |
| **Skills Domain: azure-functions-endpoint.md** | Baixo (tem conteúdo concreto, bem estruturado) | **Confiabilidade** | **BAIXA** | Verificar se exemplos de código realmente funcionam; se frases de ativação são claras | Se há exemplos, testar pelo menos um com Copilot em teste real |
| **Skills Domain: react-components.md** | Alto (arquivo vazio) | **Qualidade + Manutenção** | **BAIXA** | Arquivo vazio; React components em src/web/ sem guidance | Remover ou preencher; não crítico para backend go-live |
| **Skills Domain: testing-patterns.md** | Alto (arquivo vazio) | **Qualidade + Manutenção** | **BAIXA** | Arquivo vazio; Vitest patterns não documentados | Remover ou preencher; não é bloqueante para go-live |
| **Pipeline de Ingestão (chunker, embedder, extractor, indexer)** | Alto (4 arquivos vazios) | **Confiabilidade + Arquitetura** | **ALTA** | Todos os 4 arquivos estão vazios; pipeline não foi implementado | **BLOQUEANTE:** Determinar se pipeline é scope de go-live ou se é fase 2; se é scope, risco alto de atraso |
| **Query Endpoint (src/functions/query/handler.ts)** | Médio (STUB bem sinalizado, não implementado) | **Confiabilidade + Go-Live** | **ALTA** | Handler é STUB ("Not implemented"); comentário sinaliza tarefa Dev 2.2; faltam: validação Zod, retrieval, prompt builder, chamada do modelo, response-validator | **CRÍTICO:** Endpoint não está pronto; precisa implementação imediata ou adiamento de go-live |
| **prompts/system-prompt.md** | Alto (muito simples, genérico) | **Governança + Qualidade** | **MÉDIA** | Prompt tem 5 linhas, muito genérico, sem detalhes de comportamento esperado, sem histórico de iterações | Verificar se prompt foi testado com modelo real; se 6 iterações mencionadas, onde está o histórico de mudanças? |
| **prompts/prompt-changelog.md** | Alto (vazio) | **Governança + Rastreabilidade** | **MÉDIA** | Arquivo vazio; changelog mencionado em AGENTS.md mas não existe | Adicionar changelog estruturado de cada versão do system-prompt |
| **src/shared/config.ts** | Médio (vazio) | **Confiabilidade** | **MÉDIA** | Arquivo vazio; config centralizada mencionada em AGENTS.md mas não implementada | Criar config com variáveis de ambiente (budget de contexto, timeout, etc.) |
| **src/shared/logger.ts** | Médio (vazio) | **Observabilidade** | **MÉDIA** | Arquivo vazio; logger centralizado mencionado em AGENTS.md mas não implementado; Zod/Vitest/pino mencionados mas sem logger | Implementar logger pino com formato estruturado; bloqueante para observabilidade |
| **src/shared/errors.ts** | Médio (vazio) | **Confiabilidade** | **MÉDIA** | Arquivo vazio; tratamento de erro centralizado mencionado em AGENTS.md mas não implementado | Criar AppError class e mapear erros HTTP; necessário para handler de query |

---

## Síntese de Riscos por Severidade

### 🔴 **RISCO ALTO** (3 artefatos — bloqueantes para go-live)

| Artefato | Risco Principal | Impacto | Verificação Crítica |
|---|---|---|---|
| **AGENTS.md** | Contradições internas ou regras não operacionais podem gerar conflitos de implementação no código; TODOs em seções críticas (Product Rules, Testing, Project Management) indicam constitution incompleta | Se contraditório, desenvolvedores tomarão decisões inconsistentes; confiabilidade reduzida | 1. Executar linting: cada regra tem Justificativa + Verificação? 2. Resolver todos os TODOs ou fechar escopo explicitamente |
| **Pipeline de Ingestão (vazio)** | Pipeline é eixo central de confiabilidade (ingestão → chunks → retrieval); 4 arquivos vazios significa lógica de chunking, embedding, extração, indexação não está pronta | Sem pipeline, não há dados no corpus; retrieval não funciona; modelo não terá contexto; go-live inviável | 1. Confirmar se pipeline é scope de go-live ou fase 2; 2. Se scope: avaliar esforço para implementar em 2 semanas |
| **Query Endpoint (STUB)** | Handler é "Not implemented"; é o entry point crítico pré-go-live; sem handler, demonstração para diretoria falha | Sem endpoint, assistente não funciona; demonstração impossível; go-live falha completamente | 1. Implementar handler com Zod, retrieval, validação de resposta; 2. Testar E2E com pipeline funcionando |

### 🟡 **RISCO MÉDIO** (4 artefatos — significativos para qualidade/observabilidade)

| Artefato | Risco Principal | Impacto | Verificação Crítica |
|---|---|---|---|
| **system-prompt.md (muito simples)** | Prompt genérico (5 linhas) sem detalh de comportamento; 6 iterações mencionadas em prompt mas changelog vazio; sem rastreabilidade de mudanças | Comportamento do modelo não é controladó; impossível auditar por que respostas mudaram; rollback difícil | 1. Recuperar histórico das 6 iterações (ou confirmar que não existem); 2. Expandir prompt com guardrails concretos; 3. Adicionar changelog |
| **prompt-changelog.md (vazio)** | Governança de prompts perdida; AGENTS.md exige versionamento mas arquivo não existe | Impossível rastrear mudanças de comportamento; violação de governança declarada | Criar changelog estruturado e manter em sync |
| **src/shared/logger.ts (vazio)** | Logger centralizado é obrigatório em AGENTS.md; não implementado; sem observabilidade estruturada | Sem logs estruturados, diagnóstico de falhas em produção é impossível; alertas não funcionam | Implementar pino com formato JSON; registrar contexto e metadados |
| **src/shared/errors.ts (vazio)** | Tratamento de erro centralizado é obrigatório em AGENTS.md; não implementado; handler de query não pode normalizar erros | HTTP responses inconsistentes; cliente não sabe como tratar erros | Criar AppError class; mapear para status codes HTTP |

### 🟢 **RISCO BAIXO** (5 artefatos — secundários para go-live, mas melhoram qualidade)

| Artefato | Risco Principal | Impacto | Verificação Crítica |
|---|---|---|---|
| **Skills Foundation (3 vazias)** | Arquivos vazios não adicionam valor; mas também não bloqueiam código (não há buscas por essas skills) | Sem impacto no go-live; cliente não vê isso | Decidir: remover ou preencher pós-go-live |
| **Skills Domain: azure-functions-endpoint.md** | Skill parece sólida, mas exemplos precisam validação | Baixo risco se exemplos funcionam | Testar 1-2 exemplos com Copilot |

---

## Recomendações Imediatas do Tech Lead (sem Claude ainda)

### Bloqueantes para Go-Live (Semana 1)

1. **Query Endpoint (CRÍTICO)**
   - Implementar handler completo: validação Zod → retrieval → prompt builder → modelo → response-validator
   - Dependências: config.ts, logger.ts, errors.ts (todos vazios)
   - Prazo: 3-4 dias
   - Critério: Teste E2E passando com modelo real

2. **Pipeline (CRÍTICO, se scope)**
   - Confirmar com Product se pipeline é go-live ou fase 2
   - Se go-live: implementar chunker.ts + embedder.ts + indexer.ts (extractor pode ser prototipado)
   - Prazo: 4-5 dias se scope confirmado
   - Critério: Teste de ingestão de documento real

3. **AGENTS.md (Verificação)**
   - Auditar para contradições
   - Resolver TODOs em seções críticas ou fechar escopo
   - Verificar que todas as regras são operacionais (não genéricas)
   - Prazo: 1 dia
   - Critério: Nenhum TODO, nenhuma contradição, 100% operacional

### Secundários (Semana 2, se houver capacidade)

4. **Implementar Logger + Errors**
   - src/shared/logger.ts (pino, formato JSON)
   - src/shared/errors.ts (AppError class)
   - Integrar em query handler
   - Prazo: 1 dia
   - Critério: Query handler registra contexto e erros estruturados

5. **Expandir System Prompt**
   - Adicionar guardrails concretos (ex: "nunca cite fonte externa")
   - Criar changelog
   - Testar com modelo
   - Prazo: 1 dia
   - Critério: Prompt tem 20+ linhas, com guardrails explícitos

6. **Skills Foundation**
   - Decidir: remover ou preencher minimamente
   - Prazo: 0.5 dia (baixa prioridade)
   - Critério: Decisão tomada

---

## Estado da Verificação de AGENTS.md (exemplo concreto)

Achados iniciais de leitura:
- ✅ Regra: "TypeScript strict é obrigatório e imutável" — operacional, verificável
- ✅ Regra: "Context management (ADR-0002)" — operacional, cita ADR específica
- ❓ Verificação: "Presença dos 5 passos no fluxo do handler" — como fazer verificação? Precisa de checklist concreto ou script de linting
- ❌ Seção "Product Rules & Guardrails" — TODO, não preenchida; violação de constitution completa
- ❌ Seção "Testing Standards" — TODO, não preenchida; violação de constitution completa
- ❌ Seção "Project Management Rules" — TODO, não preenchida; violação de constitution completa

**Conclusão:** AGENTS.md é ~70% operacional, 30% incompleto (TODOs). Risco: desenvolvedores não têm regras de product/testing/project; isto cria vácuo de decisão.

---

## Checklist de Verificação Própria (Fase A)

- ✅ Avaliação foi feita primeiro pelo humano (sem Claude)?
- ✅ Todos os artefatos de entrada foram cobertos? (AGENTS.md, skills, pipeline, query endpoint, system prompt, shared modules)
- ✅ Skills não refinadas foram tratadas como risco? (sim, 5 vazias → LOW RISK)
- ✅ Falta de rastreabilidade do system prompt foi tratada como risco de governança? (sim, changelog vazio → MEDIUM RISK)
- ✅ Priorização está pragmática para 2 semanas? (sim, 3 bloqueantes + 3 secundários)
- ⏳ Risco residual será explicitado na Fase E

**Status Fase A:** ✅ COMPLETO — Avaliação própria concluída com 14 artefatos avaliados, 3 bloqueantes identificados.

---

## Próxima Etapa: Fase B (Co-Review com Claude)

Aguardando validação de avaliação própria com Claude para consolidação final de riscos.
