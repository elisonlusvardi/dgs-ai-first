# Prompt — Tech Lead | Exercício 1.1 — ADRs de Arquitetura

## Finalidade

Você vai atuar como Tech Lead e documentar decisões estruturantes do assistente RAG da NovaTech.
Use como fonte principal o cenário e os requisitos já definidos no projeto, especialmente o material do exercício de entendimento.

## Escopo

Entregar 4 ADRs independentes, uma para cada decisão abaixo:
1. Modelo de LLM.
2. Estratégia de contexto.
3. Documentos contraditórios.
4. Build vs buy do pipeline RAG.

## Referências do projeto

Baseie as respostas nos artefatos locais quando necessário:
- `exercicio-fase-1-entendimento.md`
- `anexo-a-documentacao-simulada-novatech.md`
- `anexo-b-chunks-referencia-rag.md`
- `POL-001-politica-devolucao.md`
- `PROC-042-frete-especial-v1.md`
- `PROC-042-v2-frete-especial-revisado.md`
- `SLA-2024-tabela-sla-clientes.md`

## Formato obrigatório de cada ADR

```markdown
# ADR-NNNN: [Título]

## Status
[Proposto | Aceito | Depreciado]

## Contexto
[Problema, restrições e forças em conflito]

## Decisão
[Escolha feita e recorte da solução]

## Consequências
### Positivas
- ...
### Negativas / Trade-offs
- ...

## Alternativas consideradas
| Alternativa | Motivo de descarte |
|-------------|--------------------|
| ... | ... |
```

## Instruções de execução

1. Escreva as ADRs uma por vez.
2. Em cada ADR, inclua trade-offs reais, não preferências pessoais de tecnologia.
3. Quando houver número (custo, volume, tokens), explicite a conta e a premissa.
4. Se houver ambiguidade de dados, declare isso na própria ADR.
5. Feche cada ADR com uma seção curta chamada **Riscos de Implementação**.

## Decisões a cobrir

### ADR-0001 — Modelo de LLM

Compare Azure OpenAI (GPT-4o), Claude via API e alternativa open-source local.
Considere:
- custo para o volume estimado do projeto;
- janela de contexto necessária;
- risco de alucinação;
- aderência ao ecossistema Azure/Teams/SharePoint;
- soberania e sensibilidade dos dados.

### ADR-0002 — Gerenciamento de contexto

Defina como o contexto será montado em cada pergunta.
Considere:
- orçamento entre prompt base, metadados, chunks, pergunta e histórico;
- política de recuperação (top-k, limiar, híbrido);
- perguntas multi-domínio (SLA + devolução + frete);
- degradação por conversa longa no Teams (context rot).

### ADR-0003 — Contradição documental

Defina a política para coexistência de versões conflitantes (ex.: PROC-042 v1 vs v2).
Avalie pelo menos:
- manter só a versão mais recente;
- manter ambas com metadado de vigência;
- delegar identificação ao LLM.

Exija uma regra implementável no pipeline (não apenas instrução no prompt).

### ADR-0004 — Build vs buy

Compare stack open-source vs stack gerenciada Azure.
Considere:
- TCO com o contexto do cliente;
- esforço operacional pós go-live;
- flexibilidade para OCR/chunking customizado;
- prazo de 3 meses;
- risco de lock-in e custo de migração.

Inclua proposta para horizonte de 3 meses e 12 meses.

## Devil's advocate

Depois da primeira versão das 4 ADRs, rode uma crítica adversarial em pelo menos 2 delas.
Para cada ADR criticada:
1. argumente contra a própria decisão;
2. descreva um cenário onde ela seria um erro grave;
3. defina o gatilho que invalidaria a decisão.

Em seguida, revise o que for necessário e registre o que mudou.

## Entregável

Gerar o material no arquivo `exercicios/1.1/resolucao.md` com:
1. Resumo executivo.
2. ADR-0001.
3. ADR-0002.
4. ADR-0003.
5. ADR-0004.
6. Premissas e lacunas.
7. Registro das revisões após devil's advocate.

Todos os artefatos e evidências deste exercício devem ser consolidados nesse mesmo arquivo.

## Checklist final

- [ ] As 4 ADRs seguem o formato definido.
- [ ] Cada ADR tem ao menos 2 alternativas descartadas.
- [ ] Há cálculo explícito em custo/contexto quando aplicável.
- [ ] A regra de conflito documental é executável.
- [ ] As revisões pós-crítica estão registradas.

## Validação final com skills de avaliação

Antes de concluir, valide sua entrega usando as skills em `.github/skills/avaliacao`, com foco em:
- `cenario-1-avaliacao-tech-lead.md`
- `cenario-1-prompt-avaliacao.md`

Registre no final de `exercicios/1.1/resolucao.md` o resultado da validação (itens atendidos, itens pendentes e ajustes realizados).