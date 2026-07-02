# Evidência de teste real com Copilot — Exercício 2.1 (Rodada 1)

## Contexto
- Ferramenta: GitHub Copilot Chat
- Modelo: GPT-5.3-Codex
- Objetivo: validar aderência ao AGENTS v1
- Data: 2026-07-02

## Prompt utilizado
Prompt A e Prompt B de `copilot-test-prompts.md`.

## Saída bruta observada (resumo)

### Endpoint (resumo de output)
```typescript
// handler.ts
export async function queryHandler(body: unknown) {
  const parsed = QueryRequestSchema.parse(body);
  const result = await executeQuery(parsed.query);
  return { status: 200, body: result };
}
```

```typescript
// validator.ts
export const QueryRequestSchema = z.object({ query: z.string().min(1) });
// faltou schema de output nesta rodada
```

### Teste (resumo de output)
```typescript
// tests/unit/query-handler.test.ts
it("returns 200 for valid payload", async () => {
  // cenário feliz
});
```

## O que seguiu
- Estrutura básica `handler.ts` + `validator.ts`.
- Validação de input com Zod.
- Separação inicial entre handler e service.

## O que ignorou
- Ausência de schema Zod de output.
- Logging pino não consolidado em logger central.
- Cobertura de teste incompleta (faltou erro interno e validação inválida detalhada).

## Conclusão
Rodada 1 confirmou necessidade de endurecer regras no AGENTS, especialmente output schema obrigatório e bloqueio explícito para desvios recorrentes.
