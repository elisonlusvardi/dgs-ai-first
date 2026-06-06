# Prompt — Tech Lead | Exercício 1.3 — Revisão Crítica de Arquitetura RAG

## Objetivo

Executar uma revisão técnica de proposta arquitetural com duas perspectivas:
1. avaliação independente do Tech Lead;
2. revisão assistida por IA para ampliar cobertura.

O resultado final deve ser uma proposta corrigida, pragmática e pronta para implementação.

## Referências obrigatórias

Use o cenário do repositório como base:
- `exercicio-fase-1-entendimento.md`
- `anexo-a-documentacao-simulada-novatech.md`
- `anexo-b-chunks-referencia-rag.md`

## Proposta a revisar

"Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serão indexados num único índice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geração. O pipeline de ingestão roda manualmente quando alguém lembra de atualizar."

---

## Etapa 1 — Revisão independente (sem IA)

Antes de abrir o Claude, registre sua análise inicial em `historico-conversas.md`.

Requisito mínimo:
- identificar ao menos 4 problemas reais;
- para cada problema, descrever impacto e proposta de correção;
- classificar severidade (Crítico, Alto, Médio).

Formato sugerido:
| Problema | Impacto | Alternativa | Severidade |
|---|---|---|---|

---

## Etapa 2 — Segunda revisão com Claude

### Prompt sugerido para o Claude

```text
Faça uma revisão técnica detalhada desta proposta de RAG, considerando o cenário da NovaTech.

Tarefas:
1) Liste riscos concretos da proposta para este contexto.
2) Para cada risco, proponha uma alternativa viável.
3) Classifique severidade (Crítico, Alto, Médio).
4) Diferencie riscos específicos deste projeto de riscos universais de RAG.

Proposta a revisar:
"Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serão indexados num único índice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geração. O pipeline de ingestão roda manualmente quando alguém lembra de atualizar."
```

Saída esperada: revisão estruturada e rastreável.

---

## Etapa 3 — Consolidação e reescrita

Após a resposta do Claude, peça uma consolidação com os dois pontos de vista.

### Prompt sugerido para o Claude

```text
Agora consolide minha revisão inicial com a sua revisão.

Quero:
1) comparação honesta (o que ambos pegaram, o que só um lado viu);
2) lista final sem duplicidade, ordenada por severidade;
3) proposta reescrita em formato narrativo (não em bullets), objetiva e implementável.

A proposta final deve tratar explicitamente:
- estratégia de chunking;
- quantidade/estratégia de recuperação de chunks;
- tratamento de documentos contraditórios (PROC-042 v1 e v2);
- ingestão automatizada com atualização confiável;
- escolha de LLM justificada para este cliente.
```

Saída esperada: proposta final corrigida, sem overengineering.

---

## Entregáveis

- [ ] Revisão inicial sem IA (Etapa 1).
- [ ] Revisão técnica do Claude (Etapa 2).
- [ ] Comparação entre revisões (Etapa 3).
- [ ] Proposta reescrita final (Etapa 3).
- [ ] Registro completo em `historico-conversas.md`.

Salvar a consolidação final das evidências do exercício em `exercicios/1.3/resolucao.md`.

## Checklist final

- [ ] A revisão inicial foi feita antes do uso de IA.
- [ ] Há pelo menos 4 riscos concretos com impacto operacional.
- [ ] A versão final é aderente ao prazo e ao time disponível.
- [ ] A proposta resolve conflito documental e atualização de base.

## Validação final com skills de avaliação

Antes de concluir, valide a entrega usando as skills em `.github/skills/avaliacao`, com foco em:
- `cenario-1-avaliacao-tech-lead.md`
- `cenario-1-prompt-avaliacao.md`

Registre no final de `exercicios/1.3/resolucao.md` o resultado da validação (itens atendidos, itens pendentes e ajustes realizados).
