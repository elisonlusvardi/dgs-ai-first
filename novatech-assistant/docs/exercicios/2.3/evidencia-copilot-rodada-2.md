# Evidência de teste real com Copilot — Exercício 2.3 (Rodada 2)

## Contexto
- Ferramenta: GitHub Copilot Chat
- Modelo: GPT-5.3-Codex
- Base: SKILL v2 iterada
- Data: 2026-07-02

## Prompt utilizado
Prompt de `prompt-teste-copilot.md` com mesmas restrições da rodada 1.

## Saída bruta observada (resumo)
```typescript
const FeedbackRequestSchema = z.object({ message: z.string().min(1) });
const FeedbackResponseSchema = z.object({ id: z.string(), status: z.literal("accepted") });

export async function feedbackHandler(body: unknown) {
  const input = FeedbackRequestSchema.parse(body);
  const serviceOutput = await feedbackService(input);
  const output = FeedbackResponseSchema.parse(serviceOutput);
  logger.info({ op: "feedbackHandler" }, "feedback accepted");
  return { status: 200, body: output };
}
```

```typescript
it("success", async () => {});
it("invalid input", async () => {});
it("service internal error", async () => {});
```

## Melhorias observadas vs rodada 1
- Output schema recorrente.
- Sem uso de `console.log`.
- Estrutura de testes mínima mais consistente.
- Menor acoplamento de regra de negócio no handler.

## Conclusão
A skill v2 elevou a consistência dos outputs e reduziu recorrência dos anti-padrões da rodada 1.
