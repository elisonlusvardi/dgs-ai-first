# Análise de aderência esperada — primeira rodada

| Item avaliado | Copilot seguiu? | Evidência esperada | Ajuste necessário na skill |
|---|---|---|---|
| 1. estrutura de pastas correta | Sim | arquivos em `src/functions/<feature>/handler.ts` e `validator.ts` | manter regra e reforçar checklist final |
| 2. handler fino | Parcial | handler apenas valida/delega/responde | explicitar limite operacional do handler e proibir regra de negócio inline |
| 3. Zod para input | Sim | schema de request aplicado antes do service | manter requisito como MUST |
| 4. Zod para output | Parcial | schema de response aplicado após retorno do service | endurecer regra: ausência de output schema invalida entrega |
| 5. uso de pino | Parcial | logger estruturado por contexto/operação | exigir logger central e campos mínimos de contexto |
| 6. ausência de `console.log` | Não | zero ocorrência de `console.log`/`console.error` | adicionar gate de bloqueio explícito no checklist |
| 7. compatibilidade com strict mode | Parcial | sem `any` implícito e sem cast inseguro injustificado | tornar bloqueante e pedir evidência de compilação |
| 8. testabilidade | Parcial | testes Vitest cobrindo sucesso/validação/erro interno | especificar cenários mínimos obrigatórios |
| 9. separação clara com service | Parcial | service contém regra de negócio e handler só orquestra | adicionar DO/DON'T mais objetivo |
| 10. aderência ao contexto do projeto | Parcial | respeita `src/functions`, `src/services`, `src/shared`, ADR-0002/0003 quando aplicável | reforçar seção de fronteira e contexto com critérios verificáveis |
