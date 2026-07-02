# Prompts — Tech Lead 2.1 (Construção e Teste do AGENTS.md)

Objetivo: executar o exercício 2.1 com evidência real de teste com Copilot, iteração v1 -> v2, e aderência completa aos critérios de avaliação.


## Prompt 1 — Execução Completa do Exercício 2.1
Você é o Tech Lead do projeto NovaTech Assistant.

Sua missão é entregar o pacote completo do exercício 2.1:
- AGENTS.md v1
- prompts de teste para GitHub Copilot (endpoint + teste)
- análise do que foi seguido e ignorado
- AGENTS.md v2 iterado
- resumo objetivo das melhorias v1 -> v2

Importante: este prompt deve permanecer estritamente no contexto do exercício. Não invente escopo adicional.

---

## 1) Contexto e Limites

Contexto do projeto:
- Repositório local: novatech-assistant
- O AGENTS.md já existe com placeholders
- Estamos na fase de estruturação (antes de implementação completa)

Estrutura relevante do repositório:
- novatech-assistant/AGENTS.md
- novatech-assistant/package.json
- novatech-assistant/README.md
- novatech-assistant/prompts/system-prompt.md
- novatech-assistant/docs/adr/
- novatech-assistant/docs/novatech/
- novatech-assistant/specs/
- novatech-assistant/skills/
- novatech-assistant/src/functions/query/handler.ts
- novatech-assistant/src/functions/query/validator.ts
- novatech-assistant/src/functions/feedback/
- novatech-assistant/src/functions/health/
- novatech-assistant/src/services/
- novatech-assistant/src/shared/
- novatech-assistant/tests/unit/
- novatech-assistant/tests/integration/
- novatech-assistant/tests/fixtures/

Sinais já observados:
- AGENTS.md contém seções de múltiplos papéis
- package.json confirma TypeScript, Vitest, build com tsc, lint com eslint
- src/functions/query/handler.ts já indica Azure Functions v4, Zod, pino, sem console.log

---

## 2) Decisões Técnicas Obrigatórias (sem omissão)

Você DEVE incorporar explicitamente no AGENTS.md:
- TypeScript com strict mode
- Azure Functions v4 com HTTP triggers
- Zod para validação de input e output
- Vitest para testes
- pino para logging estruturado (nunca console.log)
- Conventional Commits
- Branch strategy: feature branch + PR obrigatório para main
- ADR-0002: budget aproximado de 4K tokens (system prompt) + 8K tokens (chunks por query)
- ADR-0002: limite de chunks e histórico curto/controlado
- ADR-0003: documentos contraditórios com metadado de vigência; priorizar versão mais recente, sem apagar histórico

---

## 3) Escopo Exato do AGENTS.md

Preencher completamente apenas:
1. Project Overview
2. Tech Stack & Architecture
3. Coding Standards
4. Build & Deploy

NÃO preencher conteúdo funcional destas seções (apenas manter heading + placeholder explícito):
- Product Rules & Guardrails (Product Specialist)
- Testing Standards (QA)
- Project Management Rules (Delivery Manager)

---

## 4) Protocolo de Execução em Fases (obrigatório)

### Fase A — Alinhamento de Escopo
- Reafirme, em 3-6 bullets, o que será produzido e o que NÃO será produzido.
- Se houver incerteza, declare suposições mínimas e siga.

### Fase B — Produção do AGENTS.md v1
- Escreva AGENTS.md v1 com linguagem prescritiva: MUST, MUST NOT, SHOULD, DO NOT, ALWAYS.
- Evite texto descritivo genérico.
- Converta diretrizes em regras verificáveis.

### Fase C — Planejamento de Teste com Copilot
- Gere 2 prompts de teste:
  - Prompt A: geração de endpoint Azure Function
  - Prompt B: geração de teste Vitest
- Ambos devem usar caminhos reais do repositório.

### Fase D — Análise Crítica Estruturada
- Gere tabela com:
  - Item avaliado
  - Copilot seguiu?
  - Evidência esperada no output
  - Ajuste necessário no AGENTS.md
- Avalie obrigatoriamente os 9 itens mínimos (ver seção 7).

### Fase E — Iteração v2
- Reescreva AGENTS.md v2 com foco em reduzir falhas observadas.
- Regra: todo ajuste deve atacar um gap real da tabela.

### Fase F — Delta v1 -> v2
- Liste apenas mudanças concretas e impacto esperado na aderência do Copilot.

---

## 5) Requisitos Mínimos por Seção

### Tech Stack & Architecture
Deve conter, no mínimo:
- Stack por camada:
  - backend: TypeScript + Azure Functions v4
  - validation: Zod
  - testing: Vitest
  - logging: pino
  - IaC: Bicep
  - bot: Bot Framework / Teams
  - web panel: React
- Responsabilidade por diretório
- Separação entre handlers, validators, services e shared
- Regra de prompts versionados em prompts/
- Regra de vigência para documentos contraditórios (ADR-0003)
- Regras de context management (ADR-0002):
  - system prompt ~4K
  - chunks ~8K
  - preferir ~5 chunks de ~1.5K sem ultrapassar budget
  - histórico máximo de 3 turnos relevantes
  - não anexar documento inteiro se chunk resolve
  - priorizar relevância + recência
  - informar conflito documental e priorizar vigente

### Coding Standards
Deve conter, no mínimo:
- strict mode obrigatório
- proibição de any implícito e cast inseguro sem justificativa
- padrão de naming para arquivos, funções e tipos
- validação de input e output com Zod
- logging estruturado com pino
- proibição explícita de console.log / console.error
- tratamento de erro via abstrações em src/shared/
- handler HTTP fino; regra de negócio em services
- exigência de código testável
- Conventional Commits
- proibição de criar código fora da estrutura prevista
- preferência por mudanças pequenas e alinhadas às ADRs/specs

### Build & Deploy
Deve conter, no mínimo:
- comandos de qualidade:
  - npm run build
  - npm run test
  - npm run lint
- branch/PR policy:
  - feature branch obrigatória
  - PR obrigatório para main
  - merge direto em main proibido
- critérios mínimos antes de code review
- relação entre código, teste e validação
- referência à infraestrutura em infra/
- exigência de compatibilidade com CI/CD e IaC

---

## 6) Regra de Qualidade do Prompt (anti-ambiguidade)

Ao escrever os artefatos:
- Não use linguagem vaga como "seguir boas práticas" sem critério verificável.
- Sempre que possível, usar formato de decisão:
  - Regra
  - Justificativa curta
  - Critério de verificação
- Evitar "spec bloat":
  - priorizar contratos e regras sobre texto longo explicativo
  - incluir exemplos DO / DO NOT apenas quando melhorarem obediência do agente
- Não produzir conteúdo de outros papéis para "completar" o documento.

---

## 7) Itens Mínimos da Análise de Aderência

A tabela da análise DEVE cobrir, no mínimo:
1. TypeScript strict-friendly
2. Azure Functions v4
3. Zod
4. pino
5. ausência de console.log
6. separação handler vs service
7. Vitest
8. aderência a caminhos reais do repositório
9. regras de contexto (ADR-0002) e vigência documental (ADR-0003), quando aplicável

---

## 8) Checklist de Auto-Validação (obrigatório)

Antes de responder, valide internamente:
1. Todas as decisões de ADR foram incorporadas?
2. O AGENTS.md está prescritivo e machine-readable?
3. As seções de outros papéis ficaram apenas com placeholders?
4. Os prompts de teste usam caminhos reais?
5. A análise cobre os 9 itens mínimos?
6. A v2 corrige gaps reais da análise?
7. O delta v1 -> v2 está concreto e mensurável?

Se qualquer resposta for "não", corrija antes de finalizar.

---

## 9) Formato Obrigatório da Resposta

Responda em Markdown com exatamente 5 blocos, nesta ordem:

1. AGENTS.md v1
- conteúdo completo pronto para colar em novatech-assistant/AGENTS.md

2. Prompts de teste para GitHub Copilot
- Prompt A (endpoint)
- Prompt B (teste)

3. Análise de aderência esperada
- tabela com os 4 campos obrigatórios

4. AGENTS.md v2
- conteúdo completo iterado

5. Mudanças v1 -> v2
- lista objetiva de mudanças concretas e respectivo impacto

---

## 10) Restrições Finais

- Não inventar serviços fora do cenário.
- Não preencher conteúdo funcional de Product/QA/Delivery.
- Não desviar do exercício.
- Não ser genérico.
- Escrever em português, mantendo termos técnicos, paths e identificadores em inglês quando necessário.
