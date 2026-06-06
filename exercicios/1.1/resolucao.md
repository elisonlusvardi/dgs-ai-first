# Resumo executivo

Este documento consolida 4 ADRs para o assistente RAG da NovaTech, cobrindo escolha de modelo, estratégia de contexto, tratamento de contradições documentais e decisão build vs buy do pipeline. As decisões priorizam integração com ecossistema Microsoft (Teams + SharePoint + Azure), redução de risco de alucinação com rastreabilidade de fonte, regra executável para conflito entre versões (PROC-042 v1 e v2) e viabilidade de go-live em 3 meses.

Decisões finais:
- ADR-0001: adotar Azure OpenAI (GPT-4o) como modelo primário na fase inicial.
- ADR-0002: limitar contexto operacional por query com retrieval híbrido, reranking e memória resumida para evitar context rot.
- ADR-0003: manter versões conflitantes com metadado de vigência e filtro temporal no pipeline (não delegar ao LLM).
- ADR-0004: estratégia híbrida de adoção: buy-first no horizonte de 3 meses e revisão arquitetural para 12 meses.

---

# ADR-0001: Seleção de LLM para Assistente RAG NovaTech

## Status
Aceito

## Contexto

A NovaTech precisa de um assistente integrado ao Teams e SharePoint para 320 chamados/dia, com 60% exigindo consulta documental. O cenário possui documentos potencialmente contraditórios e dados sensíveis de operação logística. Há pressão por go-live em 3 meses.

Premissas explícitas de carga:
- Consultas RAG/dia: 320 x 60% = 192.
- Consultas/mês (22 dias úteis): 192 x 22 = 4.224.
- Orçamento médio por query (fase inicial): 6.000 tokens de entrada + 700 de saída.
- Tokens/mês de entrada: 4.224 x 6.000 = 25.344.000.
- Tokens/mês de saída: 4.224 x 700 = 2.956.800.

Premissas explícitas de preço (referência para decisão, sujeitas a contrato e data):
- Azure OpenAI GPT-4o: USD 5/M entrada, USD 15/M saída.
- Claude via API: USD 3/M entrada, USD 15/M saída.
- Open-source local: sem custo por token, porém com custo fixo de infraestrutura e operação.

Estimativa mensal de custo variável de inferência:
- Azure OpenAI GPT-4o: (25,344 x 5) + (2,9568 x 15) = USD 171,07/mês.
- Claude via API: (25,344 x 3) + (2,9568 x 15) = USD 120,38/mês.

Ambiguidade declarada:
- Não há tabela contratual oficial do cliente no material fornecido; custos reais podem variar por negociação enterprise, região e throughput reservado.

## Decisão

Adotar Azure OpenAI (GPT-4o) como modelo primário para produção inicial, com arquitetura preparada para fallback controlado em segundo provedor no futuro.

Recorte da solução:
- Provedor principal: Azure OpenAI GPT-4o.
- Estratégia anti-alucinação: resposta obrigatória com fonte e recusa explícita quando não houver evidência.
- Segurança e governança: tráfego e telemetria centralizados no stack Azure do cliente.
- Portabilidade: camada de abstração de provedor no serviço de inferência para reduzir lock-in lógico.

## Consequências
### Positivas
- Melhor aderência ao ecossistema existente (Teams, SharePoint, identidade e operação no Azure).
- Menor fricção para governança corporativa e compliance de dados.
- Menor risco de atraso no prazo de 3 meses por integração simplificada.

### Negativas / Trade-offs
- Custo por token potencialmente maior que alternativa API não-Azure.
- Dependência de fornecedor gerenciado, com risco de lock-in comercial.
- Exige disciplina de engenharia de contexto para não escalar custo por query.

## Alternativas consideradas
| Alternativa | Motivo de descarte |
|-------------|--------------------|
| Claude via API como primário | Menor custo estimado de inferência, porém com maior atrito de integração/governança no ecossistema Microsoft já contratado. |
| Modelo open-source local (Ollama/vLLM) | Maior controle e soberania técnica, mas risco elevado para qualidade, operação e prazo de 3 meses (MLOps, tuning, observabilidade e SRE). |
| Estratégia multi-modelo desde o dia 1 | Aumenta resiliência, porém adiciona complexidade de roteamento, avaliação e custo operacional logo na fase crítica de go-live. |

## Riscos de Implementação
- Subestimar custo real por aumento de contexto médio por query.
- Falta de critérios de fallback pode degradar consistência de resposta.
- Dependência de configuração corporativa Azure (rede, permissões, segurança) fora do controle do time de produto.

---

# ADR-0002: Estratégia de Gerenciamento de Contexto por Query

## Status
Aceito

## Contexto

Mesmo com janela máxima ampla de modelo, contexto excessivo aumenta custo, latência e risco de "lost in the middle". O bot no Teams terá sessões longas, o que aumenta risco de context rot. O domínio exige perguntas multi-tema (SLA + devolução + frete) com precisão e citação de fonte.

Premissas explícitas de orçamento por query (alvo operacional):
- Teto de contexto efetivo para geração: 12.000 tokens.
- Distribuição planejada:
  - Instruções estáticas e guardrails: 1.200.
  - Metadados de governança/resposta: 500.
  - Histórico resumido de conversa: até 800.
  - Pergunta atual + metadados do chamado: até 500.
  - Chunks recuperados: até 9.000.
- Com chunk médio de 450 tokens, cabem até 20 chunks no teto técnico; alvo operacional menor para qualidade.

## Decisão

Implementar estratégia de contexto em duas etapas (retrieve e compose), com retrieval híbrido e reranking antes da montagem final.

Regra operacional:
- Recuperação inicial: top-40 híbrido (vetorial + BM25).
- Reranking semântico: selecionar top-10 para pergunta simples e top-14 para multi-domínio.
- Composição final: no máximo 8 chunks simples e 12 chunks multi-domínio, priorizando evidência recente e cobertura de domínios distintos.
- Ordem no prompt: instruções -> metadados de política -> resumo de histórico -> chunks ordenados por relevância e diversidade -> pergunta.

Tratamento de context rot no Teams:
- A cada 4 turnos, gerar resumo estruturado do histórico (fatos, decisões, pendências).
- Limite de 12 turnos por sessão ativa; após isso, reset de contexto detalhado e manutenção apenas do resumo.
- Se confiança média da resposta cair por 3 turnos consecutivos, forçar reinicialização de contexto.

## Consequências
### Positivas
- Redução de custo por evitar uso indiscriminado de janela máxima.
- Menor risco de perda de evidência crítica no meio do contexto.
- Melhor tratamento de perguntas multi-domínio com política explícita de cobertura.

### Negativas / Trade-offs
- Maior complexidade de pipeline (retrieval híbrido + reranking + compaction).
- Risco de excluir chunk relevante por filtros agressivos.
- Necessidade de monitorar continuamente qualidade de ranking.

## Alternativas consideradas
| Alternativa | Motivo de descarte |
|-------------|--------------------|
| Usar janela máxima e top-k alto fixo | Simples de implementar, mas piora latência/custo e aumenta risco de "lost in the middle". |
| Apenas retrieval vetorial (sem BM25) | Boa semântica geral, mas pior para termos exatos, códigos e valores críticos de tabela. |
| Sem resumo de histórico (apenas últimos turnos brutos) | Menos processamento, porém degrada em conversas longas e aumenta context rot. |

## Riscos de Implementação
- Configuração inicial de thresholds pode gerar falso negativo em queries complexas.
- Falta de observabilidade em cada estágio pode esconder origem de erro (retrieve vs rank vs generate).
- Resumo de histórico ruim pode propagar erro contextual.

---

# ADR-0003: Política de Tratamento de Documentos Contraditórios

## Status
Aceito

## Contexto

Há evidência de coexistência de versões conflitantes, como PROC-042 v1 e PROC-042-v2, sem hierarquia clara no repositório. Delegar isso ao LLM aumenta risco de respostas inconsistentes e não auditáveis. O produto exige rastreabilidade e indicação explícita de fonte.

## Decisão

Manter versões coexistentes com metadado de vigência obrigatório e filtro temporal no pipeline de retrieval, com regra executável.

Regra implementável no pipeline:
1. Na ingestão, cada documento recebe: documentKey, version, issuedAt, validFrom, validTo, supersedes, status (draft, active, deprecated).
2. Se houver seção de transição (ex.: PROC-042-v2 com corte em 01/12/2023), registrar regra temporal explícita.
3. Na consulta, usar data de referência do chamado (quando disponível); caso ausente, usar data atual.
4. Retrieval aplica filtro por vigência antes do ranking: validFrom <= dataRef < validTo (ou validTo nulo).
5. Se múltiplas versões válidas ainda conflitam, responder com comparação lado a lado e pedir confirmação de política aplicável, sem sintetizar uma regra única.
6. Se documento não tiver metadados mínimos, marcar como low-trust e reduzir prioridade de ranking.

## Consequências
### Positivas
- Solução auditável e determinística para conflitos de versão.
- Reduz risco de "misturar" regras de versões incompatíveis na mesma resposta.
- Mantém capacidade de responder casos históricos com base temporal correta.

### Negativas / Trade-offs
- Requer disciplina de governança documental e enrichment de metadados.
- Aumenta complexidade de ingestão e validação de qualidade dos dados.
- Pode elevar esforço inicial de catalogação de documentos legados.

## Alternativas consideradas
| Alternativa | Motivo de descarte |
|-------------|--------------------|
| Manter apenas versão mais recente | Simples, mas elimina rastreabilidade histórica e pode errar chamados vinculados a vigências antigas. |
| Delegar conflito ao LLM com instrução de prompt | Não determinístico, menor auditabilidade e risco alto de alucinação por síntese indevida. |
| Bloquear documentos com conflito até revisão manual completa | Seguro, porém inviável para operação contínua e prazo do projeto. |

## Riscos de Implementação
- Metadados ausentes ou incorretos podem enviesar a regra temporal.
- Dependência de integração com origem de dados para obter data do chamado.
- Resistência organizacional para governança de ciclo de vida documental.

---

# ADR-0004: Estratégia Build vs Buy do Pipeline RAG

## Status
Aceito

## Contexto

A decisão precisa equilibrar prazo de 3 meses, operação pós go-live e flexibilidade para OCR/chunking customizado. O cliente já possui ecossistema Azure, mas há risco de lock-in no longo prazo.

Premissas explícitas de TCO:
- Custo médio interno por FTE/mês (carregado): R$ 18.000.
- Horizonte 3 meses (implantação) e 12 meses (operação evolutiva).
- Time base disponível: até 6 pessoas, com alocação variável.

Estimativa comparativa de TCO (ordem de grandeza):
- Opção managed Azure (buy-first):
  - 3 meses: 12 FTE-mês x 18.000 + R$ 45.000 de serviços cloud = R$ 261.000.
  - 12 meses: 30 FTE-mês x 18.000 + R$ 180.000 cloud = R$ 720.000.
- Opção open-source (build-heavy):
  - 3 meses: 16,5 FTE-mês x 18.000 + R$ 30.000 infra = R$ 327.000.
  - 12 meses: 26 FTE-mês x 18.000 + R$ 160.000 infra = R$ 628.000.

Ambiguidade declarada:
- Não há benchmark oficial de produtividade do time da NovaTech no material; projeções de FTE são estimativas arquiteturais.

## Decisão

Adotar estratégia híbrida por horizonte:
- Horizonte 3 meses: buy-first com stack gerenciada Azure para garantir prazo e reduzir risco operacional de go-live.
- Horizonte 12 meses: reavaliar componentes de maior custo/menor diferenciação e migrar seletivamente partes de ingestão e processamento (OCR/chunking) para componentes open-source quando houver ganho comprovado de custo e flexibilidade.

Recorte da solução:
- Manter serviços críticos de busca e inferência em stack gerenciada no início.
- Projetar contratos internos (interfaces) para permitir substituição gradual de componentes.
- Criar checkpoint arquitetural no mês 9 para decisão de migração parcial.

## Consequências
### Positivas
- Maximiza chance de cumprir prazo de 3 meses.
- Reduz carga operacional inicial de SRE/MLOps.
- Preserva opcionalidade de redução de custo no médio prazo.

### Negativas / Trade-offs
- Custo potencialmente maior no primeiro ano em relação a build-heavy puro.
- Necessidade de planejamento adicional para evitar lock-in estrutural.
- Estratégia híbrida exige governança de arquitetura e disciplina de interfaces.

## Alternativas consideradas
| Alternativa | Motivo de descarte |
|-------------|--------------------|
| Build completo open-source desde o início | Maior controle técnico, porém risco alto de prazo e de operação para go-live em 3 meses. |
| Buy completo e permanente | Menor complexidade operacional, porém lock-in e risco de custo crescente sem alavancas de otimização. |
| Arquitetura dual (build+buy em paralelo desde o mês 1) | Reduz lock-in, mas duplica esforço inicial e compromete foco da entrega de valor. |

## Riscos de Implementação
- Mês 9 sem dados de observabilidade confiáveis pode inviabilizar decisão de migração.
- Migração parcial mal planejada pode introduzir regressão de qualidade.
- Falta de ownership claro de custos por componente dificulta otimização.

---

# Premissas e lacunas

## Premissas adotadas
- Volume de consultas: 192/dia (320 x 60%).
- Janela de contexto operacional alvo por query: 12.000 tokens.
- Base documental com contradições reais (PROC-042 v1 vs v2) e necessidade de regra temporal.
- Prazos e restrições de negócio: go-live em 3 meses e integração com Teams + SharePoint.

## Lacunas identificadas
- Ausência de preço contratual oficial por modelo/provedor no material.
- Ausência de distribuição real de tamanho por documento/chunk após OCR.
- Ausência de dados históricos de acurácia por tipo de pergunta.
- Ausência de métricas reais de custo operacional pós go-live para calibrar TCO anual.

---

# Registro das revisões após devil's advocate

## ADRs criticadas
- ADR-0001 (Modelo de LLM)
- ADR-0004 (Build vs buy)

## Devil's advocate 1 - ADR-0001

### Argumento contra a decisão
Escolher Azure OpenAI como primário pode ser financeiramente subótimo se o volume crescer rapidamente e se outra API entregar qualidade equivalente com menor custo variável.

### Cenário onde a decisão seria um erro grave
Em 6 meses, o volume dobra e o custo mensal explode sem melhoria proporcional de qualidade, pressionando orçamento e reduzindo sustentabilidade do produto.

### Gatilho que invalida a decisão
Se custo por resposta útil validada no Azure ficar 30% acima do segundo melhor provedor por 2 meses consecutivos, com qualidade equivalente (delta <= 2 pontos percentuais), a decisão deve ser reaberta.

### O que foi revisado
- Incluída cláusula explícita de portabilidade por camada de abstração de provedor.
- Incluído gatilho quantitativo de revisão de decisão.

## Devil's advocate 2 - ADR-0004

### Argumento contra a decisão
Estratégia híbrida pode virar “complexidade permanente”: nem simplifica totalmente (buy) nem otimiza totalmente (build), gerando arquitetura fragmentada.

### Cenário onde a decisão seria um erro grave
No mês 12, o time mantém dois mundos sem ganho concreto: custo elevado de managed e custo adicional de componentes customizados, com aumento de incidentes.

### Gatilho que invalida a decisão
Se após o checkpoint do mês 9 não houver ganho projetado >= 20% de TCO em 12 meses com risco operacional aceitável, cancelar migração parcial e consolidar em uma única trilha.

### O que foi revisado
- Adicionado checkpoint formal no mês 9 para decisão orientada por dados.
- Adicionado critério mínimo de ganho para justificar migração parcial.

---

# Validação final com skills de avaliação

Base utilizada para validação:
- .github/skills/avaliacao/cenario-1-avaliacao-tech-lead.md
- .github/skills/avaliacao/cenario-1-prompt-avaliacao.md

## Itens atendidos
- As 4 ADRs seguem o formato definido (Status, Contexto, Decisão, Consequências, Alternativas).
- Cada ADR possui ao menos 2 alternativas descartadas.
- Há cálculo explícito de custo/contexto (ADR-0001, ADR-0002, ADR-0004) com premissas declaradas.
- A regra de conflito documental é executável no pipeline (ADR-0003, passos 1 a 6).
- Revisões pós-crítica adversarial registradas para 2 ADRs (ADR-0001 e ADR-0004), com gatilhos de invalidação.
- ADR-0002 cobre orçamento de contexto, multi-domínio e context rot em sessões longas.

## Itens pendentes
- Validar preços reais de provedor com área de compras/cloud para substituir premissas de referência.
- Rodar benchmark técnico controlado (qualidade x custo x latência) para calibrar thresholds de revisão.

## Ajustes realizados após validação
- Inclusão explícita de ambiguidades e lacunas de dados no documento.
- Inclusão de gatilhos quantitativos para reabertura de decisão.
- Reforço de cláusulas de portabilidade para mitigar lock-in.

---

# Checklist final

- [x] As 4 ADRs seguem o formato definido.
- [x] Cada ADR tem ao menos 2 alternativas descartadas.
- [x] Há cálculo explícito em custo/contexto quando aplicável.
- [x] A regra de conflito documental é executável.
- [x] As revisões pós-crítica estão registradas.