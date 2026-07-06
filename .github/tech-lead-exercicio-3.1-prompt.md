# Prompts — Tech Lead 3.1 (Design do Harness do Projeto)

Objetivo: executar o exercício 3.1 com artefatos concretos e verificáveis, cobrindo as 5 camadas do harness e implementando uma verificação determinística de fonte no fluxo de verification loops.


## Prompt 1 — Execução Completa do Exercício 3.1
Você é o Tech Lead do projeto NovaTech Assistant.

Sua missão é entregar o pacote completo do exercício 3.1:
- design do harness nas 5 camadas
- diagnóstico do estado atual (o que já existe, o que falta)
- plano de fechamento de gap por camada
- implementação de uma função de verificação de `source_document`
- validação objetiva da função implementada

Importante: não fugir do contexto do exercício, não inventar escopo fora do cenário e não propor mudanças não solicitadas para esta entrega.

---

## 1) Contexto e Limites

Contexto do cenário:
- o assistente NovaTech já possui pipeline RAG funcional, endpoint de query e bot em staging
- houve problemas de confiabilidade (respostas incorretas, fonte ausente, documentos inadequados)
- o projeto está na fase de governança e validação antes do go-live

Framework obrigatório do harness (5 camadas):
1. Tool orchestration
2. Verification loops
3. Context & memory
4. Guardrails
5. Observability

Diretrizes obrigatórias deste exercício:
- conectar `Context & memory` ao context budget da ADR-0002
- mencionar structured outputs e HITL na camada de guardrails
- implementar somente uma verificação simples em código: validar `source_document`
- usar lista curta de documentos válidos da NovaTech com identificadores canônicos

Lista canônica de fontes válidas para a função:
- `POL-001`
- `PROC-042`
- `PROC-042-v2`
- `SLA-2024`
- `FAQ-Atendimento`

Regra central da verificação:
- se `source_document` não estiver na lista, a resposta deve ser marcada como suspeita

---

## 2) Entradas e Referências Obrigatórias

Considere explicitamente:
- cenário completo da fase de governança
- estrutura real do repositório
- padrões técnicos já adotados no projeto (TypeScript strict, validação e logging estruturado)

Paths reais a usar (não inventar paths):
- `src/services/`
- `src/services/response-validator.ts`
- `src/shared/`
- `tests/unit/`
- `docs/adr/`

Referências de arquitetura e governança:
- ADR-0002 para contexto e budget
- guardrails de produto definidos no cenário anterior (DEVE / NAO DEVE / QUANDO EM DUVIDA)

---

## 3) Escopo Exato da Entrega

Entregar exatamente:
1. Design do harness em 5 camadas, com:
   - estado atual (ja implementado)
   - gaps
   - plano de fechamento de gap
   - prioridade (alta, media, baixa)
2. Função de verification loop para `source_document`:
   - recebe a resposta do modelo
   - valida a fonte contra lista canônica
   - retorna status de suspeita quando fonte for invalida ou ausente
3. Evidencia de funcionamento com exemplos de entrada/saida
4. Resumo final com riscos residuais

Fora de escopo:
- redesign completo da arquitetura
- criação de novos endpoints
- alteração de infraestrutura
- implementação de fluxo completo de HITL em produção

---

## 4) Protocolo de Execução em Fases (obrigatório)

### Fase A — Alinhamento
- resumir em 4-8 bullets o que sera entregue
- declarar suposicoes minimas e restricoes

### Fase B — Design do Harness (Claude)
- cobrir as 5 camadas em profundidade pratica
- para cada camada, apresentar:
  - objetivo da camada
  - o que ja existe no contexto atual
  - o que falta para producao
  - acao concreta para fechar gap
  - dono sugerido (papel responsavel)

### Fase C — Verification Loop em Codigo (GitHub Copilot)
- implementar funcao simples de validacao de fonte citada
- usar tipagem explicita
- evitar `any`
- manter comportamento deterministico

### Fase D — Verificacao da Implementacao
- mostrar casos minimos:
  - fonte valida
  - fonte invalida
  - fonte ausente
- confirmar que resposta suspeita e sinalizada corretamente

### Fase E — Fechamento
- consolidar entrega final
- listar riscos residuais e proximos passos recomendados

---

## 5) Requisitos Obrigatórios do Design (5 Camadas)

Para cada camada, usar tabela com colunas:
- Camada
- Ja implementado
- Gap
- Acao para fechar
- Prioridade
- Responsavel

### 5.1 Tool orchestration
Deve cobrir:
- fluxo ingestao -> retrieval -> geracao
- contratos entre componentes
- pontos de falha e fallback minimo

### 5.2 Verification loops
Deve cobrir:
- validacao estrutural da resposta (structured output)
- validacao de fonte citada
- acao quando output nao passa na verificacao

### 5.3 Context & memory
Deve cobrir:
- aderencia a ADR-0002
- controle de budget de contexto
- criterio de selecao de chunks e historico
- estrategia para evitar estouro de contexto

### 5.4 Guardrails
Deve cobrir obrigatoriamente:
- limite probabilistico via prompt
- limite deterministico via codigo
- structured outputs como contrato obrigatorio
- pelo menos um ponto concreto de HITL

### 5.5 Observability
Deve cobrir:
- logs estruturados
- metricas minimas de qualidade e erro
- alertas praticos para incidentes
- trilha de auditoria para governanca

---

## 6) Requisitos Obrigatórios da Função de Verificação

Especificacao minima da funcao:
- entrada: objeto de resposta do modelo com campo `source_document`
- processamento:
  - normalizar valor recebido (trim basico)
  - comparar com conjunto de fontes validas
- saida:
  - `isSuspicious: boolean`
  - `reason: string`
  - `normalizedSource?: string`

Regras de decisao:
- `source_document` ausente: suspeita
- `source_document` vazio: suspeita
- `source_document` fora da whitelist: suspeita
- `source_document` na whitelist: nao suspeita

Lista de fontes permitidas (fixa neste exercicio):
- `POL-001`
- `PROC-042`
- `PROC-042-v2`
- `SLA-2024`
- `FAQ-Atendimento`

---

## 7) Requisitos de Qualidade (anti-ambiguidade)

Ao produzir a resposta:
- usar linguagem prescritiva e verificavel
- evitar frases vagas como "melhorar qualidade" sem criterio
- separar claramente estado atual, gap e acao
- nao confundir plano conceitual com implementacao tecnica
- manter escopo estrito do exercicio 3.1

Boas praticas de resposta:
- priorizar tabelas para comparativos
- trazer exemplos concretos
- declarar explicitamente premissas
- indicar o que NAO foi implementado e por que

---

## 8) Checklist de Auto-Validação (obrigatório)

Antes de finalizar, validar:
1. As 5 camadas foram cobertas sem lacunas?
2. Cada camada tem "ja implementado", "gap" e "acao"?
3. Context & memory cita ADR-0002 de forma concreta?
4. Guardrails menciona structured outputs e HITL?
5. A funcao verifica `source_document` contra a lista canonica?
6. Casos invalido/ausente sao marcados como suspeitos?
7. A entrega evita escopo extra nao solicitado?

Se qualquer resposta for "nao", corrigir antes da versao final.

---

## 9) Formato Obrigatório da Resposta

Responder em Markdown com exatamente 4 blocos, nesta ordem:

1. Design do harness (5 camadas)
- tabela completa por camada

2. Implementação da verificação de fonte
- código da função
- path do arquivo

3. Evidências de validação
- casos de teste de entrada/saida

4. Conclusão executiva
- status da entrega
- riscos residuais
- próximos passos

---

## 10) Prompt Curto Alternativo para Uso Rápido no Copilot (opcional)

"Implemente em TypeScript, no arquivo `src/services/response-validator.ts`, uma função determinística que valide o campo `source_document` de uma resposta de modelo contra a whitelist: `POL-001`, `PROC-042`, `PROC-042-v2`, `SLA-2024`, `FAQ-Atendimento`. A função deve retornar `{ isSuspicious, reason, normalizedSource }`, marcando como suspeita fonte ausente, vazia ou fora da lista. Inclua 3 exemplos de uso (válido, inválido, ausente)."

---

## 11) Restrições Finais

- Não inventar documentos fora da whitelist definida.
- Não substituir ADR-0002 por regra nova de contexto.
- Não tratar este exercício como redesign completo do sistema.
- Não omitir a distinção entre controle probabilístico (prompt) e determinístico (código).
- Escrever em português, mantendo identificadores técnicos em inglês.