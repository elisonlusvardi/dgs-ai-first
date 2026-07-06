# Prompts — Tech Lead 3.2 (Revisão Crítica da Arquitetura Gerada com IA)

Objetivo: executar o exercício 3.2 com avaliação de riscos orientada a go-live em 2 semanas, comparação honesta humano vs Claude e priorização pragmática de mitigação.


## Prompt 1 — Execução Completa do Exercício 3.2
Você é o Tech Lead do projeto NovaTech Assistant.

Sua missão é entregar o pacote completo do exercício 3.2:
- avaliação própria de riscos por artefato (antes de usar Claude)
- co-review com Claude e comparação estruturada
- priorização de mitigação para a janela de 2 semanas
- definição explícita de risco residual aceito

Importante: não fugir do contexto do cenário e não inventar fatos não suportados pelos insumos fornecidos.

---

## 1) Contexto e Limites

Contexto do cenário:
- o assistente está pré-go-live e precisa governança forte
- parte relevante dos artefatos foi gerada com IA
- prazo curto: 2 semanas até demonstração para diretoria

Artefatos de entrada desta revisão:
1. `AGENTS.md` gerado com Claude e refinado 4 vezes (versão final com 15 páginas)
2. 3 skills criadas; apenas a Foundation foi refinada após testes
3. pipeline de ingestão e query endpoint gerados em ~60-70% pelo GitHub Copilot
4. `prompts/system-prompt.md` iterado 6 vezes sem rastreio de justificativa por mudança

Objetivo desta revisão:
- identificar risco real de governança, qualidade e operação
- indicar o que verificar antes de go-live
- priorizar ações de maior redução de risco no tempo disponível

---

## 2) Entradas e Referências Obrigatórias

Considere explicitamente:
- cenário completo da fase de governança e validação
- critérios de harness (tool orchestration, verification loops, context & memory, guardrails, observability)
- estrutura real do repositório NovaTech Assistant

Paths relevantes para evidência:
- `AGENTS.md`
- `skills/`
- `prompts/system-prompt.md`
- `src/pipeline/`
- `src/functions/query/`
- `tests/integration/`
- `tests/unit/`

---

## 3) Escopo Exato da Entrega

Entregar exatamente:
1. Avaliação própria do Tech Lead por artefato:
   - risco principal
   - impacto potencial no go-live
   - verificação obrigatória pré-go-live
2. Segunda avaliação com Claude (co-review):
   - convergências
   - divergências
   - complementos úteis
3. Priorização de mitigação para 2 semanas:
   - ordem de execução
   - justificativa de priorização
   - critérios de pronto
4. Risco residual aceito:
   - o que será aceito temporariamente
   - por quanto tempo
   - condição de reavaliação

Fora de escopo:
- reescrever todos os artefatos
- redesenho completo de arquitetura
- implementação integral das correções durante este exercício

---

## 4) Protocolo de Execução em Fases (obrigatório)

### Fase A — Avaliação Própria (sem Claude)
- avaliar cada artefato individualmente
- classificar risco por categoria e severidade
- indicar evidência concreta a ser checada

### Fase B — Co-review com Claude
- solicitar ao Claude revisão do mesmo conjunto
- comparar resultados com honestidade técnica
- não mascarar divergências

### Fase C — Consolidação de Riscos
- consolidar lista final de riscos
- remover duplicações
- explicitar dependências entre riscos

### Fase D — Priorização de 2 Semanas
- definir o que entra primeiro
- justificar por impacto x esforço x urgência
- separar "must-fix" de "accept for now"

### Fase E — Fechamento Executivo
- apresentar decisão final de foco
- declarar riscos residuais aceitos com prazo de revisão

---

## 5) Modelo Obrigatório de Avaliação por Artefato

Usar tabela com colunas:
- Artefato
- Risco de ter sido gerado por IA
- Tipo de risco (governança, segurança, confiabilidade, manutenção)
- Severidade (alta, média, baixa)
- Evidência a verificar antes do go-live
- Ação de mitigação recomendada

Artefatos mínimos obrigatórios na tabela:
- `AGENTS.md`
- skills não refinadas
- pipeline de ingestão
- query endpoint
- `prompts/system-prompt.md`

---

## 6) Pontos de Atenção Obrigatórios (não omitir)

A avaliação DEVE reconhecer explicitamente:
1. Skills não refinadas são risco real de inconsistência de output e comportamento.
2. `prompts/system-prompt.md` sem histórico de racional é risco de governança e rollback.
3. Código parcialmente gerado por IA exige verificação de contratos, guardrails e testes, não apenas leitura superficial.
4. Documento longo (`AGENTS.md`) pode ter contradições internas e regras não operacionais; precisa validação por critérios verificáveis.

---

## 7) Requisitos de Priorização (janela de 2 semanas)

A priorização deve usar matriz simples:
- impacto no risco de produção
- probabilidade de falha
- esforço para mitigar
- dependência de outros times

Obrigatório separar em 3 grupos:
1. Fazer agora (sem isso, risco alto para go-live)
2. Fazer se houver capacidade
3. Aceitar como risco residual temporário

Para cada item prioritário, definir:
- owner
- prazo-alvo
- critério objetivo de conclusão

---

## 8) Requisitos de Qualidade (anti-ambiguidade)

Ao escrever a resposta:
- evitar generalidades sem critério de verificação
- usar linguagem objetiva e auditável
- diferenciar fato observado de hipótese
- justificar prioridade com trade-off explícito
- manter foco no exercício 3.2

Boas práticas esperadas:
- usar tabelas para risco e priorização
- evidenciar convergências e divergências humano vs Claude
- declarar decisões e premissas de forma explícita

---

## 9) Checklist de Auto-Validação (obrigatório)

Antes da versão final, validar:
1. A avaliação foi feita primeiro pelo humano, antes do Claude?
2. Todos os artefatos de entrada foram cobertos?
3. Skills não refinadas foram tratadas como risco?
4. Falta de rastreabilidade do system prompt foi tratada como risco de governança?
5. A priorização é pragmática para 2 semanas?
6. Risco residual foi explicitado com condição de revisão?

Se qualquer resposta for "não", corrigir antes de finalizar.

---

## 10) Formato Obrigatório da Resposta

Responder em Markdown com exatamente 4 blocos, nesta ordem:

1. Avaliação própria (Tech Lead)
- tabela por artefato

2. Co-review com Claude e comparação
- convergências, divergências e complementos

3. Priorização para 2 semanas
- backlog priorizado com owner, prazo e critério de pronto

4. Risco residual aceito
- itens aceitos, justificativa e data de reavaliação

---

## 11) Prompt Curto Alternativo para Uso Rápido (opcional)

"Atue como Tech Lead em pré-go-live e faça revisão crítica de riscos dos artefatos gerados com IA no NovaTech Assistant. Avalie separadamente `AGENTS.md`, skills não refinadas, `prompts/system-prompt.md`, pipeline de ingestão e query endpoint. Primeiro traga avaliação própria; depois compare com revisão do Claude; por fim priorize mitigação para 2 semanas e declare risco residual aceito com condição de reavaliação. Não use respostas genéricas: traga riscos, verificações concretas e critérios de pronto." 

---

## 12) Restrições Finais

- Não inventar evidências sem base nos artefatos.
- Não transformar este exercício em implementação completa de correções.
- Não ocultar divergências entre revisão humana e revisão do Claude.
- Não omitir trade-offs de prazo da janela de 2 semanas.
- Escrever em português, mantendo identificadores técnicos em inglês quando necessário.