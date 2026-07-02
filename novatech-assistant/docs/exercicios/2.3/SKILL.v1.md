# SKILL.md v1 — skills/domain/azure-functions-endpoint.md

## Fase A — Alinhamento de Escopo
- Entregar uma Domain Skill autocontida para padronizar endpoint HTTP em Azure Functions v4.
- Cobrir regras obrigatórias de TypeScript strict, Zod, pino, separação de camadas e testabilidade.
- Incluir prompt curto de teste para rodada com GitHub Copilot.
- Incluir análise de aderência da primeira rodada com ajustes de melhoria.
- Entregar versão v2 iterada da skill com regras mais duras.
- Definir critérios mensuráveis de maturidade.
- Fora de escopo: detalhar pipeline RAG completo, criar novas skills Foundation, reescrever especificações de produto.

## 1) Nome e propósito
Nome: `azure-functions-endpoint`

Propósito:
- Padronizar geração de endpoint HTTP em Azure Functions v4 no projeto NovaTech Assistant.
- Garantir saída consistente com TypeScript strict, validação Zod, logging estruturado e separação de responsabilidades.

Quando usar:
- Ao criar novo endpoint em `src/functions/<feature>/handler.ts`.
- Ao refatorar endpoint existente para padrão do projeto.
- Ao gerar par `handler.ts` + `validator.ts` + service associado.

Quando NÃO usar:
- Para UI React (`src/web/`).
- Para jobs/pipeline sem gatilho HTTP.
- Para criar arquitetura RAG ponta a ponta fora do escopo do endpoint.

## 2) Frases de ativação
Frases de ativação (trigger):
- "criar endpoint Azure Function HTTP v4"
- "gerar handler e validator com Zod"
- "implementar endpoint strict-friendly sem console.log"
- "refatorar handler para ficar fino e testável"

Exemplos de trigger em linguagem natural:
- "Implemente `src/functions/feedback/handler.ts` com Azure Functions v4, Zod e pino."
- "Complete `src/functions/query/handler.ts` mantendo regra de negócio fora do handler."

## 3) Contexto e escopo
Tipo de tarefa coberta:
- Design e implementação de endpoint HTTP.
- Estrutura de validação e contrato de resposta.
- Definição de fronteira entre handler, validator, services e shared.

Fronteiras (não cobre):
- Modelagem de índices de busca.
- Estratégia de chunking/embedding completa.
- Regras de produto fora do endpoint.

## 4) Dependências
Skills Foundation relacionadas:
- `skills/foundation/typescript-conventions.md`
- `skills/foundation/error-handling.md`
- `skills/foundation/project-structure.md`

Nota de autonomia:
- Como as skills Foundation estão vazias, esta Domain Skill MUST repetir as regras essenciais para execução correta.

Regras essenciais embutidas:
- MUST manter compatibilidade com `strict: true`.
- MUST validar input e output com Zod.
- MUST usar logging estruturado com pino.
- MUST NOT usar `console.log` ou `console.error`.
- MUST separar handler de regra de negócio.

## 5) Regras prescritivas
1. O endpoint MUST existir em `src/functions/<feature>/handler.ts`.
2. A validação MUST existir em `src/functions/<feature>/validator.ts`.
3. O handler MUST ser fino: receber request, validar input, delegar para service, validar output, retornar resposta.
4. Regra de negócio MUST ficar em `src/services/`.
5. Tipos/utilitários compartilhados SHOULD ficar em `src/shared/`.
6. Input e output MUST usar schemas Zod explícitos.
7. Logging MUST usar pino (ou wrapper central equivalente do projeto).
8. Código MUST NOT conter `console.log`/`console.error`.
9. Código MUST compilar com TypeScript strict sem atalhos de tipo inseguros.
10. Endpoint MUST ser previsível e testável com Vitest em `tests/unit/`.
11. Para endpoint de query, MUST respeitar ADR-0002 (context budget e histórico curto).
12. Para documentos contraditórios/versionados, MUST respeitar ADR-0003 (vigência e recência).

## 6) Estrutura recomendada de endpoint
Responsabilidade de `handler.ts`:
- Traduzir request HTTP para contrato interno.
- Aplicar validação de entrada.
- Chamar service.
- Aplicar validação de saída.
- Mapear resposta HTTP e erro.

Responsabilidade de `validator.ts`:
- Definir `RequestSchema` e `ResponseSchema`.
- Exportar tipos derivados dos schemas quando necessário.

Responsabilidade do service:
- Implementar regra de negócio.
- Orquestrar chamadas para componentes externos/internos.
- Retornar payload em contrato estável.

Arquivo de teste correspondente:
- `tests/unit/<feature>-handler.test.ts` cobrindo sucesso, erro de validação e erro interno.

## 7) Exemplos DO / DON'T
DO:
- Manter handler fino e sem regra de negócio extensa.
- Definir schema Zod de request e response em arquivo dedicado.

DON'T:
- Fazer validação inline confusa no handler.
- Colocar regra de negócio no handler.
- Usar `console.log` ou `console.error`.
- Omitir separação entre handler/validator/service.

## 8) Anti-padrões comuns
- Concentrar toda lógica no handler.
- Validar apenas input e esquecer output.
- Introduzir `any` para contornar strict mode.
- Logar sem estrutura.
- Acoplar dependência externa direto no handler.
- Ignorar estrutura de diretórios do projeto.
- Produzir endpoint difícil de testar.

## 9) Checklist de saída
- [ ] Endpoint criado em `src/functions/<feature>/handler.ts`.
- [ ] Validator criado em `src/functions/<feature>/validator.ts`.
- [ ] Input validado com Zod.
- [ ] Output validado com Zod.
- [ ] Sem `console.log` e `console.error`.
- [ ] Regra de negócio em `src/services/`.
- [ ] Estritamente compatível com TypeScript strict.
- [ ] Teste unitário em `tests/unit/`.

## 10) Critérios de teste da skill
Prompt de teste sugerido:
- "Implemente `src/functions/feedback/handler.ts` e `src/functions/feedback/validator.ts` com Azure Functions v4, Zod, pino, sem console.log e com service separado em `src/services/`"

Verificações mínimas:
- Estrutura de arquivos correta.
- Uso de Zod para request e response.
- Logging estruturado sem console.
- Handler fino e service separado.
- Código testável com Vitest.

Sinais de skill fraca:
- saída mistura validação e negócio no handler.
- falta schema de output.
- presença de logs por console.
- código incompatível com strict.
