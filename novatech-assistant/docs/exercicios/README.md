# Índice Mestre — Exercícios Tech Lead

## Exercício 2.1
- Pasta: `2.1/`
- Entrega final consolidada: `2.1/entrega-final-2.1.md`
- Artefatos complementares:
  - `2.1/AGENTS.v1.md`
  - `2.1/AGENTS.v2.md`
  - `2.1/copilot-test-prompts.md`
  - `2.1/analise-aderencia.md`
  - `2.1/delta-v1-v2.md`
  - `2.1/evidencia-copilot-rodada-1.md`
  - `2.1/evidencia-copilot-rodada-2.md`
  - `2.1/comparativo-rodadas.md`

## Exercício 2.2
- Pasta: `2.2/`
- Entrega final consolidada: `2.2/entrega-final-2.2.md`
- Artefatos complementares:
  - `2.2/arquitetura-mcp.md`
  - `2.2/matriz-servers.md`
  - `2.2/prompt-copilot-health-check.md`
  - `2.2/plano-contingencia-mcp.md`
  - `2.2/evidencia-copilot-health-check.md`
- Script relacionado:
  - `../../scripts/mcp-health-check.ps1`

## Exercício 2.3
- Pasta: `2.3/`
- Entrega final consolidada: `2.3/entrega-final-2.3.md`
- Artefatos complementares:
  - `2.3/SKILL.v1.md`
  - `2.3/SKILL.v2.md`
  - `2.3/prompt-teste-copilot.md`
  - `2.3/analise-primeira-rodada.md`
  - `2.3/criterios-maturidade.md`
  - `2.3/delta-v1-v2.md`
  - `2.3/evidencia-copilot-rodada-1.md`
  - `2.3/evidencia-copilot-rodada-2.md`
  - `2.3/comparativo-rodadas.md`
- Arquivo de skill aplicado no projeto:
  - `../../skills/domain/azure-functions-endpoint.md`

## Avaliação Consolidada
- Avaliação final formal: `avaliacao-final-tech-lead-cenario-2.md`

## Exercício 3.1
- Pasta: `3.1/`
- Índice consolidado: `3.1/README.md`
- Documentação principal:
  - `3.1/design-harness-5-camadas.md` — Design arquitetural em 5 camadas (Tool Orchestration, Verification Loops, Context & Memory, Guardrails, Observability)
  - `3.1/evidencias-validacao.md` — Testes executados (30/30 PASS) com console output dos 3 casos críticos
  - `3.1/conclusao-executiva.md` — Riscos residuais, próximos passos, checklist de aceitação
- Código implementado:
  - `../../src/services/response-validator.ts` — Função determinística de validação de source_document (550 linhas, TypeScript strict)
  - `../../tests/unit/response-validator.spec.ts` — Suite de testes Vitest (440 linhas, 30 testes)
- Status: ✅ **COMPLETO — 7/7 obrigatórios atendidos**

## Exercício 3.2
- Pasta: `3.2/`
- Índice consolidado: `3.2/README.md`
- Documentação principal (5 fases):
  - `3.2/fase-a-avaliacao-propria.md` — Avaliação própria do Tech Lead (14 artefatos analisados, 3 ALTOS/4 MÉDIOS/5 BAIXOS)
  - `3.2/fase-b-co-review-claude.md` — Co-review independente e comparação humano vs Claude (convergências, divergências, omissões)
  - `3.2/fase-c-consolidacao-riscos.md` — 11 riscos consolidados sem duplicação, com dependências mapeadas e matriz crítica
  - `3.2/fase-d-priorizacao-2-semanas.md` — Backlog priorizado (10-11 dias MUST-FIX, 2 dias SHOULD-FIX, 0.5 dia NICE-TO-HAVE)
  - `3.2/fase-e-fechamento-executivo.md` — Decisão final (Go-live viável com 4 condições, 3 riscos residuais aceitos)
- Status: ✅ **COMPLETO — 5/5 fases executadas, 9/9 obrigatórios atendidos**
- Recomendação: 70% confiança para go-live em 2 semanas se 4 bloqueantes forem mitigados (Query handler, AGENTS.md auditoria, E2E tests, decisão de pipeline scope)
