# Análise de aderência esperada

| Item avaliado | Copilot seguiu? | Evidência esperada no output | Ajuste necessário no AGENTS.md |
|---|---|---|---|
| 1. TypeScript strict-friendly | Parcial | Tipos explícitos e ausência de any implícito; compila em strict | Tornar bloqueante: proibir workaround de tipo sem justificativa e exigir compile local antes de PR |
| 2. Azure Functions v4 | Parcial | Handler modelado como HTTP trigger v4, assinatura e retorno consistentes | Especificar mais claramente contrato mínimo do handler (entrada, saída, status) |
| 3. Zod | Parcial | Schemas de input e output em validator e uso no handler | Exigir validação de output além de input (muitos agentes validam só input) |
| 4. pino | Parcial | Import de logger central e logs estruturados por contexto | Exigir uso exclusivo de logger central para evitar criação de logger ad hoc |
| 5. ausência de console.log | Não | Nenhum console.* no código de produção | Adicionar regra de bloqueio explícita com critério grep console. |
| 6. separação handler vs service | Parcial | Handler curto delegando negócio para service | Definir limite operacional: handler só valida/delega/mapeia resposta |
| 7. Vitest | Sim | Testes em tests/unit com vitest e cenários essenciais | Reforçar cobertura mínima por tipo de risco (sucesso/validação/erro interno) |
| 8. aderência a caminhos reais do repositório | Sim | Edição em paths existentes (src/functions/query, src/services, src/shared, tests) | Incluir regra “não criar diretório fora da árvore alvo sem aprovação” |
| 9. regras de contexto (ADR-0002) e vigência documental (ADR-0003) | Parcial | Limites de tokens/histórico aplicados e escolha de versão vigente em conflito | Tornar obrigatório registrar seleção de chunks e decisão de vigência no fluxo |
