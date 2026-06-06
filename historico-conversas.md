# Historico de Conversas - Exercicio 1.2 (Tech Lead)

## Parte 1 - Governanca de Prompts (Claude)

### Prompt usado

Estou definindo a governanca de prompts para um assistente RAG de atendimento em logistica.
Preciso de uma proposta objetiva cobrindo:
1) Estrutura de pastas e convencao de nomes para prompts.
2) Estrategia de versionamento (acoplado ao codigo ou nao).
3) Processo de revisao e aprovacao antes de producao.
4) Testes minimos para detectar regressao de prompt.
5) Relacao entre mudancas de prompt e release da aplicacao.

Contexto operacional: equipe pequena (3 devs + 1 TL), prazo curto, sem MLOps dedicado.

### Consolidacao da resposta

- Estrutura proposta: `prompts/system`, `prompts/templates`, `prompts/policies`, `prompts/tests`.
- Convencao de nomes: `<dominio>-<finalidade>-v<major>.<minor>.md`.
- Versionamento acoplado ao repositorio (Git) com changelog por prompt e tag de release da app.
- Fluxo de aprovacao minimo: autor -> review tecnico (1 dev) -> aprovacao TL -> merge.
- Testes minimos obrigatorios no PR: cobertura de citacao de fonte, fallback sem cobertura, idioma pt-BR, limite de tamanho e termos proibidos.
- Regra de release:
  - Patch de prompt (vX.Y+1): pode sair em hotfix sem alterar app, com smoke tests.
  - Mudanca estrutural (vX+1.0): exige release conjunta app + prompt + reteste de regressao.

### Decisoes finais registradas

- Politica "prompt como codigo" adotada.
- Sem repositorio separado para prompt (complexidade desnecessaria para time pequeno).
- Pipeline de CI deve bloquear merge sem testes de prompt.

---

## Parte 2 - Anatomia de Contexto (Claude)

### Prompt usado

Quero documentar a anatomia de contexto de uma query do assistente RAG.

System prompt base:
"Voce e o assistente de atendimento da NovaTech, empresa de logistica.
Responda perguntas sobre procedimentos, SLAs e regras de frete.
Use apenas as informacoes dos documentos fornecidos.
Cite a fonte. Se nao souber, diga que nao sabe."

Guardrails obrigatorios:
- citar fonte (documento e secao)
- nao inventar prazos/valores
- quando faltar dado, explicitar e sugerir escalonamento
- responder em portugues formal e claro
- em conflito de versoes, mostrar ambas e sinalizar a mais recente

Tarefas:
1) Reescrever o system prompt com esses guardrails.
2) Montar tabela de componentes de contexto (estatico/dinamico), tamanho estimado e prioridade de corte.
3) Propor orcamento total de tokens e politica de overflow.
4) Explicar como mitigar context rot em sessoes longas no Teams.

### Consolidacao da resposta

- System prompt v2 definido com guardrails explicitos, exigindo citacao e fallback com escalonamento.
- Componentes de contexto separados em:
  - Estaticos: system prompt, politica de resposta, formato de saida.
  - Dinamicos: metadados da sessao, pergunta atual, chunks recuperados, historico recente.
- Orcamento operacional adotado: 12k tokens/query.
  - 1.2k system + politicas.
  - 0.8k metadados e instrucoes dinamicas.
  - 7.5k chunks RAG (prioridade maxima).
  - 2.5k historico compactado.
- Politica de overflow:
  - 1) remover historico antigo.
  - 2) comprimir historico em sumario estruturado.
  - 3) reduzir chunks por relevancia (top-k com corte por score).
  - 4) nunca cortar system prompt e guardrails.
- Mitigacao de context rot no Teams:
  - resumo persistente a cada 5 interacoes;
  - reset semantico quando trocar de dominio (SLA -> frete);
  - re-hidratacao de contexto apenas com fatos validados + ultima pergunta.

---

## Parte 3 - Script de teste de prompt (GitHub Copilot)

### Solicitacao executada

Criar `test_prompt.py` com:
- mock local de LLM (sem chamada externa);
- entrada: prompt + casos de teste;
- validacoes: citacao de fonte, termos proibidos, idioma, tamanho e fallback;
- relatorio por caso e por criterio.

### Casos implementados

1. Prazo de devolucao.
2. SLA cliente Gold.
3. Frete especial para Norte.
4. Tier inexistente (fallback).
5. Tentativa de forcar resposta em ingles.

### Resultado

- Script criado em `test_prompt.py`.
- Estrutura inclui funcoes de validacao deterministicas e mock de resposta por regra.
- Relatorio final mostra taxa de aprovacao agregada e detalhes por criterio.

---

## Parte 4 - Enforcement probabilistico vs deterministico (Claude)

### Prompt usado

Classifique os guardrails do assistente em dois grupos:
1) probabilistico (pode ficar no prompt)
2) deterministico (deve ter validacao no codigo/harness)

Para cada guardrail deterministico, detalhe:
- regra de validacao objetiva;
- acao na falha (bloquear, fallback, log);
- motivo tecnico para nao confiar so no prompt.

Inclua um cenario realista em que o modelo "parece obedecer" o prompt, mas ainda entrega algo inaceitavel que so o harness detecta.

### Consolidacao da resposta

- Probabilistico (prompt): tom formal, clareza textual, ordem da explicacao.
- Deterministico (harness): citacao obrigatoria, blacklist de termos proibidos, idioma pt-BR, limite de tamanho, fallback em ausencia de cobertura, deteccao de conflito de versao sem sinalizacao.
- Acoes de falha:
  - Bloquear resposta sem fonte ou com numero nao rastreavel.
  - Forcar fallback em ausencia de cobertura.
  - Registrar log estruturado para auditoria.
- Cenario realista detectado pelo harness:
  - Pergunta sobre frete Norte retorna valor 1.8 (v2), mas cita apenas PROC-042 v1.
  - Texto parece correto, porem a citacao esta inconsistente com o valor.
  - Prompt sozinho nao garante coerencia entre numero e fonte; validador deterministico detecta mismatch e bloqueia resposta.

---

# Historico de Conversas - Exercicio 1.3 (Tech Lead)

## Etapa 1 - Revisao independente (sem IA)

### Momento da analise

- Analise feita antes de qualquer consulta ao Claude.
- Base utilizada: `exercicio-fase-1-entendimento.md`, `anexo-a-documentacao-simulada-novatech.md`, `anexo-b-chunks-referencia-rag.md`.

### Revisao inicial registrada

| Problema | Impacto | Alternativa | Severidade |
|---|---|---|---|
| Embeddings `text-embedding-ada-002` desatualizado para cenario atual | Menor qualidade semantica em PT-BR tecnico e pior recuperacao em perguntas ambiguas/multi-dominio; aumenta risco de resposta parcial | Migrar para modelo de embedding atual da plataforma Azure/OpenAI com melhor desempenho multilingual e manter benchmark offline de recall@k antes de go-live | Alto |
| Indice unico para todos os documentos sem metadado de vigencia e confianca | Mistura fonte normativa (POL/SLA/PROC) com FAQ informal; chance alta de citar FAQ como verdade e combinar PROC-042 v1/v2 no mesmo contexto | Manter indice logico unico com filtros obrigatorios por metadado (`documentType`, `isNormative`, `validFrom`, `validTo`, `version`, `sourceTrust`) e politica de ranking por confianca | Critico |
| Chunking fixo de 512 tokens sem overlap | Perde continuidade de regras e excecoes (ex.: prazo geral + excecao de carga perigosa), reduz precisao em perguntas com condicional | Adotar chunking semantico por estrutura (titulo/secao/tabela), com overlap de 10% a 20% e limites diferentes por tipo de documento | Alto |
| Recuperar apenas 3 chunks similares | Cobertura insuficiente para perguntas multi-dominio (devolucao + SLA + frete); aumenta omissao de regra critica e resposta incompleta | Retrieval dinamico por tipo de pergunta (k=6 simples, k=8-10 multi-dominio), com reranking e diversidade de fonte | Critico |
| Ingestao manual "quando alguem lembra" | Base desatualizada, sem previsibilidade operacional e sem SLO de atualizacao; inviabiliza confianca do atendimento | Pipeline automatizado de ingestao incremental (SharePoint/Confluence/rede), com agendamento diario e gatilho por evento + monitoramento de falha | Critico |
| Nao ha regra explicita para documentos contraditorios (PROC-042 v1 x v2) | Assistente pode responder valor incorreto de frete/prazo e gerar impacto financeiro e de compliance | Resolver conflito no pipeline: filtro por vigencia/data do chamado, priorizar versao ativa e, em conflito residual, responder com comparacao e alerta | Critico |
| Escolha de GPT-4o sem justificativa de custo/latencia/qualidade para este cliente | Risco de decisao por preferencia e nao por criterio; pode comprometer custo e prazo | Formalizar ADR leve com matriz de decisao (qualidade, custo, latencia, integracao Azure, operacao time de 6 pessoas) | Medio |

---

## Etapa 2 - Segunda revisao com Claude

### Prompt enviado ao Claude

```text
Faça uma revisao tecnica detalhada desta proposta de RAG, considerando o cenario da NovaTech.

Tarefas:
1) Liste riscos concretos da proposta para este contexto.
2) Para cada risco, proponha uma alternativa viavel.
3) Classifique severidade (Critico, Alto, Medio).
4) Diferencie riscos especificos deste projeto de riscos universais de RAG.

Proposta a revisar:
"Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serao indexados num unico indice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geracao. O pipeline de ingestao roda manualmente quando alguem lembra de atualizar."
```

### Consolidacao da resposta do Claude

Riscos especificos da NovaTech destacados pelo Claude:

1. Conflito de versoes PROC-042 x PROC-042-v2 sem politica de vigencia (Critico).
2. FAQ informal competindo com documentos normativos no ranking (Alto).
3. Fluxo de ingestao manual quebrando confiabilidade para atendimento de 320 chamados/dia (Critico).
4. Cobertura insuficiente para perguntas sem documento formal (frete < 500kg e carga danificada) com risco de alucinacao (Alto).

Riscos universais de RAG destacados pelo Claude:

1. Top-k baixo pode degradar recall factual (Alto).
2. Chunking fixo sem overlap pode quebrar semantica (Alto).
3. Falta de observabilidade de retrieval e geracao dificulta diagnostico de erro (Medio).
4. Falta de fallback explicito em ausencia de evidencias (Critico).

Alternativas sugeridas pelo Claude (resumo):

- Politica de precedencia por metadado de vigencia e confianca de fonte.
- Retrieval em dois estagios (candidate retrieval + reranking).
- Guardrail de "nao encontrei cobertura" como comportamento padrao quando faltarem evidencias.
- Pipeline automatizado com delta ingest, dead-letter e alertas.

---

## Etapa 3 - Consolidacao (analise propria + Claude)

### Comparacao honesta

Pontos que ambos identificaram:

- ingestao manual como risco critico;
- top-k=3 insuficiente;
- chunking fixo sem overlap;
- ausencia de politica para conflito PROC-042 v1/v2.

Pontos que eu trouxe e o Claude nao enfatizou:

- risco de manter `ada-002` (desatualizacao de embedding) no contexto atual;
- necessidade de justificar GPT-4o por matriz de decisao (nao por preferencia).

Pontos que o Claude trouxe e eu nao tinha detalhado:

- importancia de classificar explicitamente risco "especifico NovaTech" vs "universal RAG" no documento final;
- necessidade de observabilidade separada de retrieval e geracao para depuracao de erro.

### Lista final sem duplicidade (ordenada por severidade)

1. Ingestao manual sem SLO de atualizacao (Critico).
2. Ausencia de politica de vigencia para PROC-042 v1/v2 e fontes de baixa confianca (Critico).
3. Top-k fixo em 3 chunks para qualquer pergunta (Critico).
4. Ausencia de fallback estrito para perguntas sem cobertura documental formal (Critico).
5. Chunking fixo de 512 sem overlap e sem segmentacao por estrutura (Alto).
6. Uso de embedding legado (`ada-002`) sem benchmark atual no dominio PT-BR (Alto).
7. Falta de observabilidade de retrieval/reranking/geracao (Medio).
8. Escolha de LLM sem matriz de decisao explicita para custo/latencia/qualidade (Medio).

### Proposta final reescrita (narrativa)

A arquitetura de RAG da NovaTech deve manter Azure AI Search e GPT-4o como base inicial por aderencia ao ecossistema Microsoft, mas com governanca tecnica objetiva para reduzir risco operacional no prazo de 3 meses. A ingestao deixa de ser manual e passa a ser automatizada com processamento incremental diario e gatilhos por atualizacao de SharePoint e Confluence, com monitoramento de falhas e reprocessamento controlado; o objetivo operacional e manter documentos novos ou alterados disponiveis em no maximo 24 horas. No processamento, o chunking deixa de ser fixo e passa a ser semantico por secao/tabela, com overlap de 10% a 20% para preservar continuidade de regras e excecoes. Na recuperacao, o pipeline adota estrategia dinamica: queries simples usam menor volume de contexto e queries multi-dominio usam mais chunks (com reranking e diversidade de fontes), evitando a fragilidade de sempre usar apenas 3 trechos. Para tratar documentos contraditorios, cada chunk recebe metadados de vigencia e confianca; no caso especifico de PROC-042 v1 e v2, a versao ativa para data do chamado e priorizada e, se houver ambiguidade residual, a resposta deve explicitar o conflito e solicitar confirmacao ao Comercial/Operacoes, sem sintetizar regra unica nao comprovada. Quando nao houver cobertura formal suficiente, o assistente deve responder "nao encontrei informacao suficiente na base oficial" e orientar escalonamento, em vez de completar lacunas com conhecimento geral. A escolha de GPT-4o fica condicionada a uma matriz de decisao simples (qualidade em PT-BR tecnico, latencia, custo por chamado e integracao Azure), revisada apos periodo inicial de operacao com metricas reais.