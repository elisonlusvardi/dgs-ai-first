# 1. SKILL.md v1

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

# 2. Prompt de teste para GitHub Copilot

Implemente um endpoint HTTP Azure Functions v4 para feedback usando caminhos reais do projeto:
- `src/functions/feedback/handler.ts`
- `src/functions/feedback/validator.ts`
- `src/services/` para regra de negócio

Requisitos obrigatórios:
- TypeScript strict-friendly (sem `any` implícito)
- validação de input e output com Zod
- logging estruturado com pino
- proibição total de `console.log` e `console.error`
- separação clara entre handler, validator e service
- código testável com Vitest em `tests/unit/`
- seguir ADR-0002 em endpoints de query e ADR-0003 quando houver documentos contraditórios/versionados

# 3. Análise de aderência esperada

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

# 4. SKILL.md v2

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

# 5. Critérios de maturidade

1. Aderência mínima >= 90% nos 10 itens da análise em 2 rodadas consecutivas.
2. Zero recorrência de `console.log`/`console.error` em 2 rodadas consecutivas.
3. Zero ausência de schema de output em 2 rodadas consecutivas.
4. Máximo de 1 correção estrutural por rodada (handler vs service vs validator).
5. 100% dos endpoints gerados com teste unitário Vitest cobrindo sucesso, validação inválida e erro interno.
6. Skill utilizável por outro dev sem explicação oral adicional (apenas lendo o arquivo).
7. Aderência explícita a ADR-0002/0003 quando aplicável ao endpoint gerado.
8. Nenhum path fora da estrutura do projeto (`src/functions`, `src/services`, `src/shared`, `tests/unit`).

# 6. Resumo das melhorias v1 -> v2

1. Endurecimento de validação de output Zod como critério bloqueante.
Impacto: reduz respostas parcialmente corretas com contrato de saída inconsistente.

2. Inclusão de gate explícito de reprovação para `console.log`/`console.error`.
Impacto: reforça observabilidade padronizada com pino.

3. Regras de handler fino tornadas objetivas (validar, delegar, responder).
Impacto: diminui acoplamento e aumenta testabilidade.

4. Checklist refinado com itens verificáveis e foco em paths reais.
Impacto: melhora consistência de estrutura entre endpoints gerados.

5. Critérios de teste da skill com rodada-padrão e sinais claros de fraqueza.
Impacto: facilita iteração contínua da skill com base em evidência.

6. Inclusão explícita de contexto local do projeto e requisitos de ADR-0002/0003.
Impacto: reduz desvios de escopo e respostas desalinhadas do cenário NovaTech.
