# Resolucao - Exercicio 1.3 (Tech Lead)

## Objetivo

Executar revisao critica de uma proposta de arquitetura RAG sob duas perspectivas (analise independente e revisao assistida por IA) e consolidar uma versao final pragmatica, implementavel e aderente ao contexto NovaTech.

---

## Etapa 1 - Revisao independente (sem IA)

A analise abaixo foi registrada antes de qualquer uso de IA, com base em:

- `.github/exercicio-fase-1-entendimento.md`
- `.github/anexo-a-documentacao-simulada-novatech.md`
- `.github/anexo-b-chunks-referencia-rag.md`

| Problema | Impacto operacional | Alternativa viavel | Severidade |
|---|---|---|---|
| Uso de embedding `ada-002` sem benchmark atual no dominio | Pode reduzir recall semantico em PT-BR tecnico e piorar recuperacao em perguntas ambiguas | Trocar para embedding atual da plataforma com benchmark offline (recall@k, MRR, nDCG) antes do go-live | Alto |
| "Indice unico" sem governanca de metadados | Mistura fonte normativa e FAQ informal; risco de citar fonte fraca como verdade | Aplicar metadados de confianca e vigencia (`isNormative`, `sourceTrust`, `validFrom`, `validTo`, `version`) e usar filtros no retrieval | Critico |
| Chunking fixo de 512 sem overlap | Quebra continuidade de regra + excecao, piorando precisao em perguntas condicionais | Chunking semantico por secao/tabela com overlap de 10% a 20% e estrategia por tipo de documento | Alto |
| Top-3 chunks fixo para toda query | Cobertura insuficiente para perguntas multi-dominio e aumento de omissao de regra critica | Retrieval dinamico (k=6 simples, k=8-10 multi-dominio) com reranking e diversidade de fontes | Critico |
| Ingestao manual "quando alguem lembra" | Base desatualizada e sem previsibilidade; risco direto em atendimento diario | Ingestao automatizada incremental (SharePoint, Confluence, pasta de rede), com monitoramento e retries | Critico |
| Sem politica de conflito documental (PROC-042 v1 x v2) | Pode gerar resposta com valor/prazo errado e impacto financeiro/compliance | Resolver no pipeline por vigencia; em conflito residual, explicitar divergencia e pedir confirmacao | Critico |
| GPT-4o escolhido sem criterio explicito | Risco de decisao por preferencia e nao por evidencias de custo/latencia/qualidade | Matriz objetiva de decisao para LLM e revisao apos dados reais de producao | Medio |

---

## Etapa 2 - Segunda revisao com Claude

### Prompt usado

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

### Sintese da revisao do Claude

Riscos especificos do projeto NovaTech:

1. Conflito de versao entre PROC-042 e PROC-042-v2 sem regra de precedencia (Critico).
2. FAQ informal competindo com documentos normativos no ranking (Alto).
3. Ingestao manual inviabilizando confiabilidade para 320 chamados/dia (Critico).
4. Perguntas sem cobertura formal induzindo alucinacao (Alto).

Riscos universais de RAG:

1. Top-k baixo degradando recall factual (Alto).
2. Chunking fixo sem overlap degradando contexto (Alto).
3. Falta de observabilidade por etapa (retrieval/reranking/geracao) (Medio).
4. Ausencia de fallback explicito para baixa cobertura (Critico).

Alternativas sugeridas:

- Filtro por vigencia e confianca de fonte no pipeline.
- Recuperacao em dois estagios com reranking.
- Fallback explicito "nao encontrei cobertura suficiente".
- Ingestao automatizada com monitoramento e fila de erro.

---

## Etapa 3 - Consolidacao e reescrita

### 1) Comparacao honesta

Pontos que ambos encontraram:

- ingestao manual como risco critico;
- top-k=3 insuficiente;
- chunking fixo sem overlap;
- ausencia de politica para documentos contraditorios.

Pontos que so a revisao independente destacou:

- risco de manter embedding legado (`ada-002`) sem benchmark atual;
- necessidade de justificar escolha de GPT-4o por matriz de decisao.

Pontos que so a revisao com Claude trouxe com mais forca:

- separar explicitamente riscos especificos NovaTech vs riscos universais de RAG;
- necessidade de observabilidade por fase do pipeline para depuracao.

### 2) Lista final sem duplicidade (ordenada por severidade)

1. Ingestao manual sem confiabilidade de atualizacao da base (Critico).
2. Ausencia de politica de vigencia/confianca para fontes contraditorias (Critico).
3. Recuperacao fixa de apenas 3 chunks (Critico).
4. Ausencia de fallback estrito em perguntas sem cobertura documental (Critico).
5. Chunking fixo sem overlap e sem estrategia por tipo de conteudo (Alto).
6. Embedding legado sem benchmark no dominio PT-BR (Alto).
7. Falta de observabilidade de retrieval/reranking/geracao (Medio).
8. Escolha de LLM sem matriz de decisao formal (Medio).

### 3) Proposta final reescrita (narrativa, objetiva e implementavel)

A arquitetura de RAG da NovaTech deve manter Azure AI Search e GPT-4o como base inicial por integracao natural ao ecossistema Microsoft ja contratado, mas com controles obrigatorios para reduzir risco operacional no prazo de 3 meses. O pipeline de ingestao deixa de ser manual e passa a ser automatizado, com coleta incremental diaria em SharePoint, Confluence e pasta de rede, monitoramento de falhas e reprocessamento controlado, com objetivo de disponibilizar atualizacoes em ate 24 horas. O processamento de documentos deve usar chunking semantico por secao e por tabela, com overlap de 10% a 20%, para preservar continuidade entre regras e excecoes e melhorar perguntas condicionais. A recuperacao de contexto nao deve ser fixa em 3 chunks; ela deve ser adaptativa por tipo de pergunta, com reranking e diversidade de fontes, usando menos chunks para consultas simples e mais para consultas multi-dominio. O tratamento de contradicoes documentais deve ser resolvido no pipeline por metadados de vigencia e confianca, especialmente para PROC-042 v1 e v2, priorizando a versao valida para a data do chamado e, em caso de ambiguidade residual, exibindo o conflito de forma explicita sem inventar conciliacao. Quando nao houver cobertura formal suficiente, o assistente deve responder explicitamente que nao encontrou base oficial para aquela resposta e orientar escalonamento. A permanencia do GPT-4o deve ser mantida com revisao orientada por metricas de qualidade, latencia e custo por chamado apos o primeiro ciclo operacional.

---

## Entregaveis

- [x] Revisao inicial sem IA (Etapa 1).
- [x] Revisao tecnica do Claude (Etapa 2).
- [x] Comparacao entre revisoes (Etapa 3).
- [x] Proposta reescrita final (Etapa 3).
- [x] Registro completo em `historico-conversas.md`.

---

## Checklist final

- [x] A revisao inicial foi feita antes do uso de IA.
- [x] Ha pelo menos 4 riscos concretos com impacto operacional.
- [x] A versao final e aderente ao prazo e ao time disponivel.
- [x] A proposta resolve conflito documental e atualizacao de base.

---

## Validacao final com skills de avaliacao

Base utilizada:

- `.github/skills/avaliacao/cenario-1-avaliacao-tech-lead.md`
- `.github/skills/avaliacao/cenario-1-prompt-avaliacao.md`

### Itens atendidos

- 4+ problemas reais identificados com impacto e alternativa.
- Analise propria registrada antes do uso de IA.
- Comparacao honesta entre revisoes (coincidencias e lacunas).
- Proposta final sem overengineering, com foco em implementacao em 3 meses.
- Tratamento explicito de chunking, retrieval, contradicoes, ingestao e escolha de LLM.

### Itens pendentes

- Nenhum pendente bloqueante para a entrega do exercicio.
- Como melhoria futura, incluir plano de metricas de qualidade (precision@k e taxa de fallback util) com meta por sprint.

### Ajustes realizados apos validacao

- Reforco explicito de fallback para perguntas sem cobertura formal.
- Inclusao de separacao entre risco universal de RAG e risco especifico da NovaTech.
- Amarracao da escolha do LLM a matriz de decisao e revisao por metricas reais.
