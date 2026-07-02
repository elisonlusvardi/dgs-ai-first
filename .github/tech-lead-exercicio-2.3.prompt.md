# Prompts — Tech Lead 2.3 (Criação e Teste de Skills Técnicas)

Objetivo: executar o exercício 2.3 com artefatos concretos e testáveis, focando na criação e iteração da skill Domain `azure-functions-endpoint` para melhorar a consistência dos outputs do GitHub Copilot.


## Prompt 1 — Execução Completa do Exercício 2.3
Você é o Tech Lead do projeto NovaTech Assistant.

Sua missão é entregar o pacote completo do exercício 2.3:
- SKILL.md v1 para `skills/domain/azure-functions-endpoint.md`
- prompt de teste para GitHub Copilot
- análise de aderência da primeira rodada
- SKILL.md v2 iterado
- critérios objetivos de maturidade da skill
- resumo das melhorias v1 -> v2

Importante: não fugir do contexto do exercício e não inventar escopo além do necessário.

---

## 1) Contexto e Limites

Contexto do projeto:
- NovaTech Assistant na fase de estruturação
- objetivo da skill: orientar geração de endpoints HTTP em Azure Functions v4
- foco em consistência: TypeScript strict, Zod, pino, estrutura de pastas, testabilidade

Árvore de skills de referência:

Foundation:
- typescript-conventions
- error-handling
- project-structure

Domain:
- azure-functions-endpoint
- azure-ai-search-integration
- react-components
- testing-patterns

Artifact:
- create-rag-endpoint
- create-integration-test
- create-react-card

Contexto real do repositório (obrigatório considerar):
1. Arquivos de skill existem e estão vazios:
- `skills/foundation/typescript-conventions.md`
- `skills/foundation/error-handling.md`
- `skills/foundation/project-structure.md`
- `skills/domain/azure-functions-endpoint.md`
- `skills/domain/testing-patterns.md`

2. Padrões-alvo já sinalizados:
- `tsconfig.json` com `strict: true`
- `package.json` com TypeScript, Vitest e build via `tsc`
- `src/functions/query/handler.ts` com expectativa explícita de Azure Functions v4, Zod, pino e sem `console.log`

3. Paths críticos para esta skill:
- `src/functions/`
- `src/functions/query/handler.ts`
- `src/functions/query/validator.ts`
- `src/services/`
- `src/shared/`
- `tests/unit/`
- `prompts/system-prompt.md`

Diretriz central:
- a skill Domain deve ser autocontida o suficiente para funcionar mesmo com skills Foundation ainda vazias
- não tentar cobrir todo o domínio RAG; manter foco no padrão de endpoint

---

## 2) Decisões Técnicas Obrigatórias (sem omissão)

A skill DEVE refletir explicitamente:
- TypeScript com `strict: true`
- Azure Functions v4 com HTTP triggers
- Zod para validação de input e output
- Vitest para testes
- pino para logging estruturado
- proibição de `console.log`
- separação entre handler, validator, services e shared
- aderência ao contexto do projeto
- respeito à ADR-0002 para montagem de contexto em endpoints de query
- respeito à ADR-0003 para vigência de documentos contraditórios quando aplicável

---

## 3) Escopo Exato da Entrega

Você deve produzir exatamente:
1. SKILL.md v1 completo para `skills/domain/azure-functions-endpoint.md`
2. Prompt de teste para GitHub Copilot
3. Análise da primeira rodada de aderência
4. SKILL.md v2 completo e iterado
5. Critérios de maturidade da skill
6. Resumo objetivo das melhorias v1 -> v2

---

## 4) Protocolo de Execução em Fases (obrigatório)

### Fase A — Alinhamento de Escopo
- resumir em 4-8 bullets o que será entregue
- explicitar o que está fora de escopo

### Fase B — Produção do SKILL.md v1
- escrever skill com linguagem prescritiva: MUST, MUST NOT, SHOULD, DO NOT, ALWAYS
- evitar texto genérico
- converter recomendações em regras verificáveis

### Fase C — Teste com Copilot
- criar prompt curto e acionável para gerar endpoint de teste
- exigir explicitamente os padrões técnicos obrigatórios

### Fase D — Análise de Aderência
- analisar gaps em tabela
- mapear ajuste necessário na skill para cada gap

### Fase E — Iteração v2
- reescrever SKILL.md com foco nos gaps observados
- cada mudança deve ter vínculo direto com um item da análise

### Fase F — Maturidade e Delta
- definir critérios mensuráveis de skill madura
- resumir mudanças concretas v1 -> v2

---

## 5) Requisitos Obrigatórios do SKILL.md

O SKILL.md deve ser completo, autocontido e prescritivo, com no mínimo:

1. Nome e propósito
- quando usar
- quando não usar

2. Frase(s) de ativação
- frases que disparem uso da skill
- exemplos de trigger em linguagem natural

3. Contexto e escopo
- tipo de tarefa coberta
- fronteiras do que não cobre

4. Dependências
- citar Foundation skills relacionadas
- resumir regras essenciais dentro da própria Domain skill, pois Foundation está vazia

5. Regras prescritivas
No mínimo:
- endpoint HTTP em `src/functions/<feature>/handler.ts`
- validação em `src/functions/<feature>/validator.ts`
- regra de negócio fora do handler
- reutilização em `src/services/`
- tipos/utilitários em `src/shared/`
- validação Zod para input e output
- logging com pino
- proibição de `console.log`/`console.error`
- compatibilidade com strict mode
- resposta previsível e testável
- quando query endpoint: observar ADR-0002
- quando documentos versionados: observar ADR-0003

6. Estrutura recomendada de endpoint
- responsabilidade de `handler.ts`
- responsabilidade de `validator.ts`
- responsabilidade do service
- arquivo de teste correspondente

7. Exemplos DO / DON'T
Obrigatório incluir:
- DO: handler fino
- DO: schema Zod de request/response
- DON'T: validação inline confusa
- DON'T: regra de negócio no handler
- DON'T: uso de `console.log`
- DON'T: ausência de separação de responsabilidades

8. Anti-padrões comuns
Exemplos esperados:
- concentrar tudo no handler
- validar apenas input e esquecer output
- uso de `any`
- logs sem estrutura
- acoplamento direto com dependências externas no handler
- ignorar estrutura de diretórios
- endpoint difícil de testar

9. Checklist de saída
- checklist curta para revisar aderência do endpoint gerado

10. Critérios de teste da skill
- qual prompt executar
- o que verificar
- sinais de que a skill está fraca

---

## 6) Requisitos do Prompt de Teste para Copilot

Gerar um prompt curto para pedir endpoint de teste em caminho real, por exemplo:
- `src/functions/feedback/handler.ts` + `validator.ts`
ou
- implementação do stub em `src/functions/query/handler.ts`

O prompt de teste deve exigir explicitamente:
- Azure Functions v4
- Zod
- pino
- sem `console.log`
- separação handler/validator/service
- TypeScript strict-friendly

---

## 7) Requisitos da Análise da Primeira Rodada

A análise deve ser tabela com colunas:
- Item avaliado
- Copilot seguiu?
- Evidência esperada
- Ajuste necessário na skill

Cobertura mínima obrigatória:
1. estrutura de pastas correta
2. handler fino
3. Zod para input
4. Zod para output
5. uso de pino
6. ausência de `console.log`
7. compatibilidade com strict mode
8. testabilidade
9. separação clara com service
10. aderência ao contexto do projeto

---

## 8) Iteração v2 e Critérios de Maturidade

### Regras da iteração v2
A v2 deve:
- endurecer regras ignoradas na v1
- transformar linguagem vaga em critério verificável
- melhorar DO / DON'T quando necessário
- refinar frase de ativação e checklist para elevar aderência

### Critérios de skill madura (obrigatório definir)
Devem ser práticos e mensuráveis, por exemplo:
- taxa mínima de aderência em 2 rodadas consecutivas
- limite máximo de correções recorrentes por rodada
- habilidade de uso por outro dev sem explicação oral
- cobertura explícita dos anti-padrões mais frequentes

---

## 9) Regras de Qualidade (anti-ambiguidade)

Ao escrever os artefatos:
- não usar teoria genérica sobre skills
- não assumir que Foundation já está pronta
- não gerar exemplos abstratos
- não inventar caminhos fora do repositório
- não ignorar que arquivos-base estão vazios
- usar português no texto geral e manter termos técnicos/paths/símbolos em inglês quando necessário

---

## 10) Checklist de Auto-Validação (obrigatório)

Antes de finalizar, validar:
1. O SKILL.md v1 cobre as 10 seções obrigatórias?
2. As regras técnicas obrigatórias foram incluídas sem omissão?
3. O prompt de teste usa caminho real?
4. A análise cobre os 10 itens mínimos?
5. A v2 corrige gaps concretos da análise?
6. Os critérios de maturidade são mensuráveis?
7. O delta v1 -> v2 está objetivo e útil?

Se qualquer resposta for "não", corrigir antes de responder.

---

## 11) Formato Obrigatório da Resposta

Responder em Markdown com exatamente 6 blocos, nesta ordem:

1. SKILL.md v1
- conteúdo completo pronto para salvar em `skills/domain/azure-functions-endpoint.md`

2. Prompt de teste para GitHub Copilot
- prompt curto e objetivo

3. Análise de aderência esperada
- tabela da primeira rodada

4. SKILL.md v2
- conteúdo completo iterado

5. Critérios de maturidade
- critérios objetivos e mensuráveis

6. Resumo das melhorias v1 -> v2
- mudanças concretas e impacto na aderência

---

## 12) Restrições Finais

- Não sair do contexto do exercício 2.3.
- Não adicionar escopo que pertença a outras skills/papéis.
- Não ser genérico.
- Não entregar apenas explicação teórica.
- Entregar artefatos prontos para uso.
