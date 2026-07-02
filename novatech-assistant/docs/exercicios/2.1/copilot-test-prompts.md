# Prompts de teste para GitHub Copilot

## Prompt A (endpoint)
Você está no repositório NovaTech Assistant.
Implemente endpoint HTTP de query com Azure Functions v4 e contratos Zod, sem sair da estrutura existente.

Tarefas:
1. Editar src/functions/query/handler.ts para criar um handler HTTP fino (recebe request, valida input, chama service, valida output, retorna response).
2. Editar src/functions/query/validator.ts para definir schemas Zod de input e output.
3. Implementar lógica de orquestração em src/services/search.ts e/ou src/services/completion.ts, mantendo regra de negócio fora do handler.
4. Usar logger estruturado central em src/shared/logger.ts.
5. Tratar erros via src/shared/errors.ts.
6. NÃO usar console.log ou console.error.
7. Preservar TypeScript strict.
8. Respeitar ADR-0002 no desenho do contexto: system prompt ~4K, chunks ~8K, preferir ~5 chunks de ~1.5K, histórico máximo 3 turnos relevantes.
9. Em conflito documental, sinalizar conflito e priorizar documento mais recente (ex.: PROC-042-v2), sem apagar histórico de versões.

Critérios de aceitação:
- Handler separado de service.
- Input e output validados com Zod.
- Código compilável com npm run build.
- Sem console.*.

## Prompt B (teste)
Você está no repositório NovaTech Assistant.
Crie testes Vitest para o endpoint de query respeitando arquitetura do projeto.

Tarefas:
1. Criar arquivo de teste unitário dentro de tests/unit para cobrir o handler de src/functions/query/handler.ts.
2. Cobrir cenário feliz com input válido e output validado por Zod.
3. Cobrir cenário de input inválido (erro de validação).
4. Cobrir cenário de erro interno no service com mapeamento de erro esperado.
5. Garantir que logs usem camada de logger e que não exista dependência de console.*.
6. Se necessário, usar fixtures de tests/fixtures.

Critérios de aceitação:
- Testes executam com npm run test.
- Casos principais cobertos: sucesso, validação, erro interno.
- Testes reforçam separação handler vs service.
- Sem dependência de implementação fora da estrutura atual.
