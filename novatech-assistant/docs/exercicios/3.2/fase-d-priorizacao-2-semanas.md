# Exercício 3.2 — FASE D — Priorização para 2 Semanas

## Contexto de Decisão

**Prazo total:** 14 dias até demonstração para diretoria  
**Riscos consolidados:** 11 (3 críticos, 6 médios, 2 baixos)  
**Estratégia:** Mitigação de risco máximo em tempo mínimo

---

## Backlog Priorizado — Ordem de Execução

### Semana 1 (Dias 1-7)

#### **DIA 1: Confirmação de Escopo (Crítico)**

| Item | R2: Pipeline Scope Confirmation |
|---|---|
| **Tarefa** | Confirmar com Product: pipeline (ingestão → chunks) é go-live ou fase 2? |
| **Owner** | Tech Lead + Product Lead |
| **Prazo** | 1 dia (máximo dia 1, segunda-feira) |
| **Critério de Pronto** | Decisão documentada em DECISIONS.md: "Pipeline [go-live / fase 2] — justificativa" |
| **Impacto** | Define roadmap para dias 2-7; se go-live, R1 depende de R2 ser paralelo |
| **Ação alternativa** | Se indeciso: assumir "pipeline fase 2, usar corpus mock pré-carregado" |

---

#### **DIAS 1-2: AGENTS.md Auditoria (Crítico)**

| Item | R3: AGENTS.md Auditoria |
|---|---|
| **Tarefa** | Validar AGENTS.md para: 1) operacionalidade (não genérico), 2) contradições, 3) TODOs críticos |
| **Owner** | Tech Lead |
| **Prazo** | 1 dia (dias 1-2) |
| **Critério de Pronto** | Checklist: Nenhum TODO em seções críticas (Tech Lead, Coding Standards, Build & Deploy); TODOs em Product Rules / Testing / Project Management documentados como "Ex 2.3" |
| **Verificação** | Script: grep "TODO" AGENTS.md; manual: ler e validar 5 regras por persona |
| **Ação concreta** | Se houver contradição, abrir issue e resolver hoje |

**Saída:** AGENTS.md audited e aprovado, ou lista de correções identificadas

---

#### **DIAS 2-5: Query Endpoint + Dependências (Crítico)**

Executar **R5 + R6 + R7 + R1** como pacote integrado:

| Subtarefa | R5: Logger | R6: Errors | R7: Config | R1: Query Handler |
|---|---|---|---|---|
| **Tarefa** | Implementar pino logger + estruturado | Implementar AppError class | Implementar config centralizado | Implementar handler completo |
| **Owner** | Dev TypeScript | Dev TypeScript | Dev TypeScript + Infra | Tech Lead + Dev |
| **Prazo** | Dia 2 | Dia 2 | Dia 2 | Dias 3-5 |
| **Dependências** | — | — | — | Precisa R5, R6, R7 antes |
| **Critério de Pronto** | ✅ pino exportado, JSON format, 4+ fields | ✅ AppError class, 3+ cenários de erro | ✅ config.ts, .env.example, variáveis Azure | ✅ Handler 100+ linhas, Zod validation, logs, retrieval mock, response-validator |
| **Teste** | Unit + integration | Unit | Unit | Unit + E2E mock |
| **Estimativa** | 0.5 dia | 0.5 dia | 0.5 dia | 3 dias |

**Paralelo:** Enquanto Dev faz R5/R6/R7, Tech Lead planeja R1 em detalhes.

**Saída:** Query handler funcional com logs, errors, config integrados.

---

#### **DIAS 2-5: System-Prompt Rastreibilidade (Médio)**

| Item | R4: System-Prompt Changelog |
|---|---|
| **Tarefa** | Recuperar histórico de 6 iterações; ou documentar v1 base e começar changelog agora |
| **Owner** | Tech Lead + Product |
| **Prazo** | Paralelo, dias 2-5 (pode ser executado em paralelo com pacote query) |
| **Critério de Pronto** | ✅ prompt-changelog.md preenchido (6 iterações OU declaração de v1 base) ✅ system-prompt.md expandido com guardrails concretos (20+ linhas) |
| **Ação concreta** | Se histórico não existe, documentar: "v1 criada em Jan 2025, próximas versões rastreadas a partir de agora"; começar changelog |

**Saída:** Rastreibilidade de prompts estabelecida.

---

#### **DIAS 6-7: Testes E2E (Médio)**

| Item | R8: E2E Tests Pipeline → Query |
|---|---|
| **Tarefa** | Criar teste E2E: ingerir corpus mock → query → resposta com source_document |
| **Owner** | QA + Dev |
| **Prazo** | Dias 6-7 (depende de R1 estar funcional) |
| **Critério de Pronto** | ✅ Teste em tests/integration/ ou tests/e2e/ ✅ Corpus mock pré-carregado ou mock retrieval ✅ Teste PASS |
| **Escopo mínimo** | 1 query, 1 documento mock (ex: "Qual é a política de devolução?") → resposta com POL-001 como source |

**Saída:** Integração validada fim-a-fim.

---

### Semana 2 (Dias 8-14)

#### **DIAS 8-14: Contingências e Otimização**

Dependendo de decisão do Dia 1 (pipeline scope):

---

#### **Cenário A: Pipeline é Go-Live**

| Item | R2: Pipeline Implementation |
|---|---|
| **Tarefa** | Implementar chunker → extractor → embedder → indexer |
| **Owner** | Dev Data Pipeline + Dev TypeScript |
| **Prazo** | Dias 8-14 (paralelo com refinamentos de query handler) |
| **Dependências** | R7 (config da Azure OpenAI embeddings) |
| **Critério de Pronto** | ✅ chunker.ts implementado, suporta markdown/txt ✅ extractor.ts extrai texto ✅ embedder.ts (peut être mock) ✅ indexer.ts persiste em corpus ✅ Teste: ingerir POL-001, recuperar chunks |
| **Escopo mínimo** | 4 arquivos TypeScript, 300+ linhas total, teste simples |

**Saída:** Pipeline operacional para ingestão de primeira batch.

---

#### **Cenário B: Pipeline é Fase 2**

| Item | R2 Defer: Usar Corpus Mock |
|---|---|
| **Tarefa** | Pré-carregar corpus mock em data/retrieval-corpus/ para demonstração |
| **Owner** | Tech Lead + QA |
| **Prazo** | Dias 8-10 (fallback rápido se scenario 1 atrasou) |
| **Critério de Pronto** | ✅ 5+ documentos mock em data/retrieval-corpus/ ✅ Query endpoint consegue recuperar chunks ✅ Demonstração funcional |

**Saída:** Fallback de corpus pronto se pipeline não entra.

---

#### **DIAS 10-12: Automatização de Governança (Médio)**

| Item | R9: Linting + Gates |
|---|---|
| **Tarefa** | Configurar eslint para enforçar AGENTS.md rules: console.log proibido, any implícito, naming, etc. |
| **Owner** | Tech Lead + DevOps |
| **Prazo** | Dias 10-12 |
| **Critério de Pronto** | ✅ .eslintrc.json configurado ✅ npm run lint detecta violations ✅ CI gate falha se violations |

**Saída:** Governança automatizada.

---

#### **DIAS 12-14: Skills Cleanup (Baixo, se houver tempo)**

| Item | R10 + R11: Skills Ambiguity |
|---|---|
| **Tarefa** | Remover skills vazias ou preencher minimamente; decidir: "TODO" vs remover |
| **Owner** | Tech Lead |
| **Prazo** | Dias 12-14 (ÚLTMA PRIORIDADE, apenas se houver tempo) |
| **Critério de Pronto** | ✅ Decisão documentada ✅ Sem arquivos vazios (ou comentário <!-- TODO --> interno) |

**Saída:** Repositório limpo, sem ambiguidade.

---

## Matriz de Priorização (MoSCoW)

### **MUST-FIX (Sem isto, go-live falha)**

| Item | Prazo | Owner | Impacto se não fizer |
|---|---|---|---|
| **D1: Confirmação Escopo** | Dia 1 | Tech Lead + Product | Roadmap inviável; equipe paralisa |
| **R3: AGENTS.md Auditoria** | Dias 1-2 | Tech Lead | Vácuo de decisão; comportamento inconsistente |
| **R5/R6/R7: Logger/Errors/Config** | Dia 2 | Dev | R1 não consegue ser implementado |
| **R1: Query Handler** | Dias 3-5 | Tech Lead + Dev | Nenhum endpoint; demonstração impossível |
| **R8: E2E Tests** | Dias 6-7 | QA | Go-live sem validação de integração |
| **R2: Pipeline** (se go-live) | Dias 8-14 | Dev Data | Sem corpus real; assistente não funciona |

**Total MUST-FIX:** ~10-11 dias de esforço de 1-2 devs.

---

### **SHOULD-FIX (Melhora confiabilidade/observabilidade)**

| Item | Prazo | Owner | Impacto se não fizer |
|---|---|---|---|
| **R4: System-Prompt Changelog** | Dias 2-5 | Tech Lead | Governança perdida; rollback difícil |
| **R9: Automatização Governança** | Dias 10-12 | Tech Lead + DevOps | Risco de drift de regras; sem gates |

**Total SHOULD-FIX:** ~2 dias.

---

### **NICE-TO-HAVE (Melhora UX de dev)**

| Item | Prazo | Owner |
|---|---|---|
| **R10/R11: Skills Cleanup** | Dias 12-14 | Tech Lead |

**Total NICE-TO-HAVE:** ~0.5 dia.

---

## Cronograma Visual

```
SEMANA 1:
┌──────────────────────────────────────────────────────┐
│ Dia 1  │ D1: Scope Decision (4h) + R3 Auditoria start (4h) │
├──────────────────────────────────────────────────────┤
│ Dia 2  │ R5/R6/R7 Implementation (paralelo)                 │
│        │ R4: Changelog start                                │
├──────────────────────────────────────────────────────┤
│ Dia 3  │ R5/R6/R7 integration + R1 Handler start            │
│ Dia 4  │ R1 Handler implementation (paralelo)               │
│ Dia 5  │ R1 Handler + first tests                           │
├──────────────────────────────────────────────────────┤
│ Dia 6  │ R8: E2E Tests (depende de R1 pronto)              │
│ Dia 7  │ Refinamentos + buffer (atraso contingency)         │
└──────────────────────────────────────────────────────┘

SEMANA 2:
┌──────────────────────────────────────────────────────┐
│ Dia 8-14 │ R2 Pipeline (se go-live) OU R2 Mock (se fase 2) │
│          │ + R9 Automatização Governança (paralelo)         │
│          │ + Buffer para contingências                       │
└──────────────────────────────────────────────────────┘
```

---

## Análise de Risco: O que pode dar errado?

### Cenário 1: Decision Delay (Pipeline Scope)
- **Risco:** Tech Lead + Product não decidem dia 1
- **Impacto:** Equipe espera, dias 2-7 perdidos
- **Mitigação:** Reunião de 2h no primeiro dia; decisão por mayoría ou escalação ao CTO

### Cenário 2: R1 (Query Handler) Atrasa
- **Risco:** Integração com Azure OpenAI leva mais tempo que esperado
- **Impacto:** E2E tests não conseguem rodar dias 6-7
- **Mitigação:** Mock do modelo pronto dia 3; depois integrar real

### Cenário 3: Pipeline Scope Mudança Meio-Caminho
- **Risco:** Começa go-live, depois descobre que deve ser fase 2
- **Impacto:** Dev paraliza; repositório em estado inconsistente
- **Mitigação:** Confirmação de escopo é **DECISÃO #1**, irrevogável para este exercício

### Cenário 4: Testes E2E Descobrem Problemas Sérios
- **Risco:** Dias 6-7, testes falham por razão imprevista
- **Impacto:** Não há tempo para fix antes de go-live
- **Mitigação:** Executar E2E mock desde dia 4, não esperar dia 6

---

## Checklist de Viabilidade (2 Semanas)

| Item | Viável? | Justificativa |
|---|---|---|
| D1 Scope + R3 Auditoria | ✅ | 2 dias, sim |
| R5/R6/R7 Implementação | ✅ | 1.5 dias, sím |
| R1 Handler Completo | ✅ | 3 dias, sim (com buffer) |
| R8 E2E Tests | ✅ | 2 dias, sim (dias 6-7) |
| R4 Changelog | ✅ | 1 dia paralelo, sim |
| R2 Pipeline (se go-live) | ⚠️ | 5-7 dias apertado; necessário paralelismo Day 1 |
| R2 Mock Fallback | ✅ | 2 dias, yes |
| R9 Automatização | ⚠️ | 1 dia, sim se prioridade low |
| R10/R11 Skills Cleanup | ✅ | 0.5 dia, sim se houver tempo |

**Viabilidade Geral:** 70% confiança para MUST-FIX; 85% se há 2 devs.

---

## Recomendações Finais do Tech Lead

1. **Decisão de escopo é crítica (Dia 1):** Sem isto, tudo falha. Priorize reunião executiva.

2. **Paralelismo máximo:** Não há margem para sequential. R5/R6/R7 são paralelos desde Dia 2; R1 começa Dia 3 enquanto Dev ainda ajusta dependências.

3. **Mock-driven development:** Começar R1 com mock de retrieval + modelo; depois integrar real. Isto acelera testes.

4. **Buffer de 2 dias:** Dias 5 e 14 são buffer para contingências; sem ele, qualquer delay causa atraso.

5. **Escalação clara:** Se algo ficar para trás dia 7, escalação ao CTO é obrigatória.

---

**Status Fase D:** ✅ COMPLETO — Backlog priorizado para 2 semanas com 11 riscos mapeados a tarefas, prazos, owners e critérios de pronto.
