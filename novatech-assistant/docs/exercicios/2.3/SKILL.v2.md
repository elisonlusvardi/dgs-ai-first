# SKILL.md v2 — skills/domain/azure-functions-endpoint.md

## 1) Nome e propósito
Nome: `azure-functions-endpoint`

Propósito:
- Padronizar endpoints HTTP em Azure Functions v4 no NovaTech Assistant com alta aderência técnica.
- Produzir código strict-friendly, validado com Zod, com logging estruturado e separação de responsabilidades.

Quando usar:
- Criar/refatorar endpoint em `src/functions/<feature>/handler.ts`.
- Criar `validator.ts` e service relacionado para fluxo HTTP.

Quando NÃO usar:
- UI React e componentes de `src/web/`.
- pipeline sem gatilho HTTP.
- desenho completo de RAG além da fronteira do endpoint.

## 2) Frases de ativação
Ativar esta skill quando a solicitação mencionar:
- "Azure Functions v4 HTTP endpoint"
- "handler + validator + service"
- "Zod input/output"
- "strict-friendly sem console.log"

Exemplos de trigger:
- "Implemente `src/functions/query/handler.ts` usando Zod e pino."
- "Crie endpoint HTTP em Azure Functions v4 com testes Vitest."

## 3) Contexto e escopo
Cobertura:
- endpoint HTTP, validação de contrato, separação de camadas, testabilidade.

Fora de escopo:
- design de produto, UX, pipelines de ingestão completos.
- criação de novas convenções globais fora dos paths existentes.

Contexto obrigatório do projeto:
- `tsconfig.json` com `strict: true`.
- `package.json` com `build` via `tsc`, `test` via `vitest`.
- `src/functions/query/handler.ts` define expectativa de Azure Functions v4, Zod, pino, sem console.

## 4) Dependências
Skills Foundation relacionadas:
- `skills/foundation/typescript-conventions.md`
- `skills/foundation/error-handling.md`
- `skills/foundation/project-structure.md`

Regra de autonomia:
- Esta Domain Skill MUST funcionar sem depender de conteúdo das Foundation skills (atualmente vazias).
- Portanto, todas as regras críticas MUST estar explícitas aqui.

## 5) Regras prescritivas
Regras estruturais:
1. Endpoint HTTP MUST ficar em `src/functions/<feature>/handler.ts`.
2. Validação MUST ficar em `src/functions/<feature>/validator.ts`.
3. Regra de negócio MUST ficar em `src/services/`.
4. Tipos/utilitários compartilhados SHOULD ficar em `src/shared/`.

Regras de contrato e qualidade:
5. Handler MUST validar input com Zod antes de chamar service.
6. Handler MUST validar output com Zod antes de responder.
7. Handler MUST NOT conter regra de negócio extensa.
8. Logging MUST usar pino (ou logger central do projeto).
9. Código MUST NOT usar `console.log` e `console.error`.
10. Código MUST ser compatível com TypeScript strict (`strict: true`) sem `any` implícito.
11. Código MUST ser testável e ter testes Vitest em `tests/unit/` com cenários mínimos.

Regras de contexto NovaTech:
12. Em endpoint de query, ALWAYS respeitar ADR-0002:
- orçamento aproximado de `~4K` para system prompt
- orçamento aproximado de `~8K` para chunks por query
- preferência por `~5` chunks de `~1.5K`
- histórico máximo de 3 turnos relevantes
- DO NOT anexar documento inteiro quando chunk resolve
13. Em documentos contraditórios/versionados, ALWAYS respeitar ADR-0003:
- informar conflito
- priorizar versão mais recente/vigente
- preservar histórico e rastreabilidade

Gate verificável de aceitação (bloqueante):
- Falha se não houver schema de output.
- Falha se houver `console.log` ou `console.error`.
- Falha se handler concentrar regra de negócio.
- Falha se não existir teste unitário com sucesso/validação/erro interno.

## 6) Estrutura recomendada de endpoint
`handler.ts` MUST:
- parse input (Zod)
- chamar service
- parse output (Zod)
- mapear resposta HTTP
- mapear erro por abstração comum do projeto

`validator.ts` MUST:
- declarar `RequestSchema` e `ResponseSchema`
- exportar tipos derivados quando necessário

Service MUST:
- conter regra de negócio
- não depender de objeto HTTP diretamente

Teste correspondente MUST:
- existir em `tests/unit/<feature>-handler.test.ts`
- cobrir sucesso, validação inválida e erro interno

## 7) Exemplos DO / DON'T
DO:
- DO manter handler fino (validar, delegar, responder).
- DO definir schemas Zod de request e response em `validator.ts`.
- DO mover regra de negócio para `src/services/`.

DON'T:
- DON'T validar parcialmente (somente input) e ignorar output.
- DON'T escrever regra de negócio no handler.
- DON'T usar `console.log`/`console.error`.
- DON'T acoplar diretamente cliente externo no handler.

## 8) Anti-padrões comuns
- Tudo no handler (validação, regra de negócio, integração externa).
- Esquecer schema de output.
- Introduzir `any` para “resolver rápido”.
- Logs sem contexto estruturado.
- Quebrar padrão de diretórios do projeto.
- Endpoint sem cenários mínimos de teste.
- Ignorar ADR-0002/0003 em endpoint de query.

## 9) Checklist de saída
- [ ] Arquivos em paths corretos (`handler.ts`, `validator.ts`, service, teste).
- [ ] Input e output validados com Zod.
- [ ] Handler fino e service separado.
- [ ] Logging por pino/logger central.
- [ ] Sem `console.log`/`console.error`.
- [ ] Compatível com strict mode.
- [ ] Testes Vitest com 3 cenários mínimos.
- [ ] Quando query endpoint, ADR-0002 aplicado.
- [ ] Quando documentos versionados, ADR-0003 aplicado.

## 10) Critérios de teste da skill
Prompt padrão de rodada:
- "Implemente `src/functions/feedback/handler.ts` e `src/functions/feedback/validator.ts` com Azure Functions v4, Zod input/output, pino, sem console, service separado em `src/services/` e teste Vitest em `tests/unit/`."

O que verificar:
- estrutura de pastas correta
- handler fino
- Zod input e output
- pino sem console
- strict-friendly
- testabilidade com 3 cenários
- aderência ao contexto do projeto

Sinais de skill fraca:
- recorrência de correção no mesmo ponto (ex.: output schema ausente)
- dependência de explicação oral adicional para uso correto
- variação frequente de estrutura entre endpoints
