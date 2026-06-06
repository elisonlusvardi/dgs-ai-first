# Resolucao - Exercicio 1.2 (Tech Lead)

## Objetivo

Estabelecer Prompt Engineering como arquitetura operavel para um assistente RAG de atendimento da NovaTech, com governanca, contexto controlado, teste automatizado e enforcement hibrido (prompt + codigo).

---

## Parte 1 - Estrategia de governanca de prompts

## 1. Estrutura de pastas e convencao

Estrutura minima para time pequeno (3 devs + 1 TL):

```text
prompts/
  system/
    novatech-atendimento-v2.0.md
  templates/
    resposta-com-fonte-v1.1.md
  policies/
    guardrails-v1.0.md
  tests/
    casos-obrigatorios-v1.0.json
```

Convencao de nome:

`<dominio>-<finalidade>-v<major>.<minor>.md`

Exemplo:

`novatech-atendimento-v2.0.md`

## 2. Versionamento

- Versionamento acoplado ao repositorio da aplicacao (Git monorepo do projeto).
- Todo prompt tem changelog no proprio arquivo (secao "Historico de versoes").
- Mudancas de prompt devem referenciar ticket no commit.

Regra semantica:

- Major: alteracao de comportamento/estrutura de resposta.
- Minor: ajuste de clareza ou instrucao secundaria.

## 3. Revisao e aprovacao

Fluxo minimo de PR:

1. Autor abre PR com diff do prompt + impacto esperado.
2. 1 dev revisa criterios tecnicos (harness e regressao).
3. TL aprova aderencia arquitetural.
4. Merge somente com checklist de testes de prompt aprovado.

## 4. Testes minimos de regressao

Obrigatorios em qualquer alteracao de prompt:

- citacao de fonte presente e no formato esperado;
- ausencia de termos proibidos;
- resposta em portugues;
- limite maximo de tamanho;
- fallback quando nao houver cobertura na base.

## 5. Relacao prompt x release

- Minor de prompt: pode sair por hotfix com smoke test.
- Major de prompt: exige release sincronizada com app e execucao de regressao completa.

Decisao de arquitetura:

Prompt e tratado como artefato versionado e auditavel, com gate no CI.

---

## Parte 2 - System prompt v2 + anatomia de contexto + orcamento

## System prompt v2

```text
Voce e o assistente de atendimento da NovaTech, empresa de logistica.
Responda apenas com base nos documentos fornecidos no contexto recuperado.

Regras obrigatorias:
1) Sempre cite a fonte no formato [Fonte: <documento> - <secao>].
2) Nao invente prazos, valores, tiers ou procedimentos que nao estejam nos documentos.
3) Se faltar informacao, diga explicitamente que nao encontrou cobertura suficiente e
   sugira escalonamento para supervisor, Comercial ou Gestao de Riscos conforme o tema.
4) Responda em portugues formal, claro e objetivo.
5) Se houver conflito entre versoes de documentos, apresente as duas, sinalize o conflito
   e indique qual e a versao mais recente pelo metadado de data/vigencia.

Formato de resposta:
- Resposta objetiva
- Observacao de risco/limite (quando aplicavel)
- Fonte(s)
```

## Anatomia de contexto

| Componente | Tipo | Tokens estimados | Prioridade de corte |
|---|---|---:|---|
| System prompt v2 + guardrails | Estatico | 900-1200 | Nao cortar |
| Politica de saida (template) | Estatico | 200-300 | Nao cortar |
| Metadados da sessao (canal, cliente, tier, idioma) | Dinamico | 200-500 | Baixa |
| Pergunta atual do atendente | Dinamico | 50-200 | Nao cortar |
| Chunks RAG recuperados (top-k com score) | Dinamico | 6000-8000 | Cortar por relevancia baixa |
| Historico recente da conversa | Dinamico | 1500-3000 | Alta (cortar primeiro) |

## Orcamento de tokens e politica de overflow

Orcamento operacional por query: 12.000 tokens.

Distribuicao alvo:

- 1.200 system + guardrails;
- 300 template/estrutura de resposta;
- 500 metadados;
- 7.500 chunks recuperados;
- 2.500 historico/resumo.

Politica de overflow (ordem obrigatoria):

1. Remover historico antigo mantendo apenas ultimas 2 interacoes completas.
2. Substituir historico removido por resumo estruturado de fatos confirmados.
3. Reduzir chunks por score de relevancia e remover duplicados semanticos.
4. Rejeitar resposta se cobertura minima ficar abaixo do limiar (forcar fallback).
5. Nunca remover guardrails e regras de citacao de fonte.

## Mitigacao de context rot em sessoes longas (Teams)

- Compaction a cada 5 turnos com resumo de fatos e fontes confirmadas.
- Reset semantico quando o dominio da pergunta mudar (ex: devolucao -> frete).
- Re-hidratacao com "fatos validados" em vez de historico literal extenso.
- TTL de memoria conversacional por atendimento para evitar carregamento acumulado.

---

## Parte 3 - Script de teste com mock (GitHub Copilot)

Arquivo criado: `test_prompt.py`.

Capacidades implementadas:

1. Recebe prompt base e lista de casos obrigatorios.
2. Usa mock de LLM local por regras deterministicas (sem API externa).
3. Valida criterios:
   - citacao de fonte;
   - termos proibidos;
   - idioma portugues;
   - limite de tamanho;
   - fallback para caso sem cobertura.
4. Gera relatorio por caso e por criterio, com consolidado final.

Casos cobertos:

- prazo de devolucao;
- SLA cliente Gold;
- frete especial para Norte;
- tier inexistente (fallback);
- tentativa de forcar resposta em ingles.

---

## Parte 4 - Enforcement probabilistico vs deterministico

## Matriz de guardrails

| Guardrail | Tipo | Como aplicar |
|---|---|---|
| Responder em portugues formal e claro | Probabilistico (prompt) | Instrucao no system prompt + exemplos de estilo |
| Estrutura de resposta (objetiva) | Probabilistico (prompt) | Template de saida |
| Citar fonte (documento e secao) | Deterministico (harness) | Regex/validador de formato + bloqueio na ausencia |
| Nao inventar prazos/valores | Deterministico (harness) | Checagem contra base/chunks citados + fallback |
| Fallback quando faltar cobertura | Deterministico (harness) | Regra de cobertura minima e mensagem padrao |
| Tratar conflito de versao explicitamente | Deterministico (harness) | Se detectar docs em conflito no contexto, exigir flag de conflito na resposta |

## Regras deterministicas detalhadas

1. Citacao obrigatoria
- Validacao: resposta contem bloco `[Fonte: DOC - Secao X]`.
- Falha: bloquear resposta e retornar fallback controlado.
- Motivo tecnico: LLM pode omitir fonte mesmo quando "promete" citar.

2. Proibicao de valores nao ancorados
- Validacao: numeros/prazos da resposta devem existir em algum chunk citado.
- Falha: bloquear + log de inconsistencia.
- Motivo tecnico: modelo pode confundir versoes e produzir valor plausivel, mas errado.

3. Fallback sem cobertura
- Validacao: se score de retrieval < limiar ou sem chunk relevante, resposta deve conter fallback.
- Falha: substituir por fallback padrao e registrar evento.
- Motivo tecnico: prompt nao impede alucinacao quando contexto e fraco.

4. Idioma obrigatorio
- Validacao: heuristica de idioma pt-BR + blacklist de resposta integral em ingles.
- Falha: bloquear e pedir regeneracao com restricao.
- Motivo tecnico: injeções do usuario podem sobrepor estilo esperado.

## Cenario realista de falsa obediencia

Pergunta: "Qual multiplicador para Norte em frete especial?"

- Resposta do modelo: "1,8" (valor correto da v2), porem cita apenas `PROC-042` v1.
- Aparencia: resposta parece correta e obediente ao prompt.
- Problema: citacao inconsistente com o valor apresentado.
- Deteccao pelo harness: valida correspondencia entre valor numerico e documento citado; bloqueia e retorna fallback com pedido de nova geracao ancorada.

---

## Checklist final

- [x] Decisoes compativeis com equipe pequena e prazo curto.
- [x] Sem contradicao entre governanca, contexto e enforcement.
- [x] Regras implementaveis (com validacao objetiva).

---

## Validacao final com skills de avaliacao

Base utilizada:

- `.github/skills/avaliacao/cenario-1-avaliacao-tech-lead.md`
- `.github/skills/avaliacao/cenario-1-prompt-avaliacao.md`

Resultado da autoavaliacao guiada:

### Itens atendidos

- Prompt tratado como codigo (versionamento, naming, gate de PR).
- Anatomia de contexto completa (estatico/dinamico + budget + overflow).
- Script de teste executavel com mock e verificacoes objetivas.
- Distincao clara entre guardrails probabilisticos e deterministicos.
- Conexao entre mudanca de prompt e estrategia de release.

### Itens pendentes

- Evoluir harness para validar coerencia numerica com parser estruturado dos chunks (atualmente, regra simplificada).
- Integrar a execucao do `test_prompt.py` ao pipeline CI para enforcement automatico.

### Ajustes realizados apos validacao

- Inclusao explicita de politica de overflow com ordem de corte obrigatoria.
- Inclusao de cenario de falsa obediencia para justificar enforcement deterministico.
- Amarracao da governanca de prompt ao ciclo de release (minor vs major).