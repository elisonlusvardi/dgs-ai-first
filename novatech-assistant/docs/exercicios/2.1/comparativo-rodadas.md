# Comparativo objetivo — Exercício 2.1

| Critério | Rodada 1 | Rodada 2 | Resultado |
|---|---|---|---|
| Handler fino | Parcial | Sim | Melhorou |
| Zod input | Sim | Sim | Estável |
| Zod output | Não | Sim | Corrigido |
| Logging pino sem console | Parcial | Sim | Melhorou |
| Testes Vitest (3 cenários) | Parcial | Sim | Melhorou |
| Aderência ADR-0002/0003 | Parcial | Parcial/Sim (quando aplicável) | Melhorou |

Resumo:
- Rodada 2 apresentou melhora consistente após endurecimento do AGENTS v2.
- Principais ganhos: output schema obrigatório, checklist bloqueante e critérios de teste mínimos.
