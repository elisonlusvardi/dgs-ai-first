# Evidência de teste real com Copilot — Exercício 2.3 (Rodada 1)

## Contexto
- Ferramenta: GitHub Copilot Chat
- Modelo: GPT-5.3-Codex
- Objetivo: validar SKILL v1 `azure-functions-endpoint`
- Data: 2026-07-02

## Prompt utilizado
Prompt de `prompt-teste-copilot.md`.

## Saída bruta observada (resumo)
```typescript
export async function feedbackHandler(body: unknown) {
  const input = FeedbackRequestSchema.parse(body);
  const result = await createFeedback(input);
  return { status: 200, body: result };
}
```

## O que seguiu
- Estrutura de paths correta.
- Input com Zod.
- Separação inicial handler/service.

## O que ignorou
- Response schema nem sempre presente.
- Logging pino sem padronização completa.
- Cobertura de testes nem sempre com 3 cenários.

## Conclusão
A skill v1 orienta bem o baseline, mas ainda permite ambiguidades em itens críticos que precisaram ser endurecidos na v2.
