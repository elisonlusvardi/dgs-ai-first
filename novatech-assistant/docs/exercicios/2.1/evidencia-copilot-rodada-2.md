# Evidência de teste real com Copilot — Exercício 2.1 (Rodada 2)

## Contexto
- Ferramenta: GitHub Copilot Chat
- Modelo: GPT-5.3-Codex
- Base: AGENTS v2 (iterado)
- Data: 2026-07-02

## Prompt utilizado
Prompt A e Prompt B de `copilot-test-prompts.md`, sem alterar caminhos.

## Saída bruta observada (resumo)

### Endpoint (resumo de output)
```typescript
const QueryRequestSchema = z.object({ query: z.string().min(1) });
const QueryResponseSchema = z.object({ answer: z.string(), sourceDocument: z.string() });

export async function queryHandler(body: unknown) {
  const input = QueryRequestSchema.parse(body);
  const serviceOutput = await queryService(input.query);
  const output = QueryResponseSchema.parse(serviceOutput);
  logger.info({ op: "queryHandler" }, "query handled");
  return { status: 200, body: output };
}
```

### Teste (resumo de output)
```typescript
it("success", async () => {});
it("invalid input", async () => {});
it("service internal error", async () => {});
```

## Melhorias observadas vs rodada 1
- Output schema Zod presente.
- Fluxo do handler mais fino e previsível.
- Três cenários de teste explicitados.
- Logging estruturado sem `console.log`.

## Limitações ainda observadas
- Dependendo da formulação do prompt, o logger central pode não ser reutilizado automaticamente.
- Em alguns outputs, o mapeamento de erros para contrato HTTP ainda precisa refinamento manual.

## Conclusão
A iteração v1->v2 aumentou aderência de forma prática e verificável, reduzindo gaps recorrentes da primeira rodada.
