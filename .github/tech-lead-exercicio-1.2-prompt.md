# Prompt — Tech Lead | Exercício 1.2 — Prompt Engineering como Arquitetura

## Objetivo

Tratar prompts e contexto como ativos de engenharia: versionados, testáveis e auditáveis.
Este exercício deve resultar em diretrizes que o time consiga aplicar no projeto real.

## Referência principal

Use o conteúdo do cenário já definido no repositório, sobretudo:
- `exercicio-fase-1-entendimento.md`
- `anexo-a-documentacao-simulada-novatech.md`
- `anexo-b-chunks-referencia-rag.md`

## Modo de execução

São 4 partes e a ordem é obrigatória:
1. Governança de prompts (Claude).
2. Anatomia de contexto (Claude).
3. Script de teste de prompt (GitHub Copilot).
4. Enforcement probabilístico vs determinístico (Claude).

Registre cada etapa em `historico-conversas.md`.

---

## Parte 1 — Governança de prompts

### Prompt sugerido para o Claude

```text
Estou definindo a governança de prompts para um assistente RAG de atendimento em logística.
Preciso de uma proposta objetiva cobrindo:
1) Estrutura de pastas e convenção de nomes para prompts.
2) Estratégia de versionamento (acoplado ao código ou não).
3) Processo de revisão e aprovação antes de produção.
4) Testes mínimos para detectar regressão de prompt.
5) Relação entre mudanças de prompt e release da aplicação.

Contexto operacional: equipe pequena (3 devs + 1 TL), prazo curto, sem MLOps dedicado.
```

Saída esperada: política prática que caiba no time atual.

---

## Parte 2 — Anatomia de contexto

### Prompt sugerido para o Claude

```text
Quero documentar a anatomia de contexto de uma query do assistente RAG.

System prompt base:
"Você é o assistente de atendimento da NovaTech, empresa de logística.
Responda perguntas sobre procedimentos, SLAs e regras de frete.
Use apenas as informações dos documentos fornecidos.
Cite a fonte. Se não souber, diga que não sabe."

Guardrails obrigatórios:
- citar fonte (documento e seção)
- não inventar prazos/valores
- quando faltar dado, explicitar e sugerir escalonamento
- responder em português formal e claro
- em conflito de versões, mostrar ambas e sinalizar a mais recente

Tarefas:
1) Reescrever o system prompt com esses guardrails.
2) Montar tabela de componentes de contexto (estático/dinâmico), tamanho estimado e prioridade de corte.
3) Propor orçamento total de tokens e política de overflow.
4) Explicar como mitigar context rot em sessões longas no Teams.
```

Saída esperada: prompt v2 + tabela + política operacional de corte/contexto.

---

## Parte 3 — Script de teste com Copilot

Crie `test_prompt.py` e peça ao Copilot um script que:
1. Receba prompt + casos de teste.
2. Use mock de LLM (sem chamada externa).
3. Valide critérios mínimos:
   - presença de citação de fonte;
   - ausência de termos proibidos;
   - resposta em português;
   - limite de tamanho;
   - fallback quando não houver resposta na base.
4. Gere relatório por caso e por critério.

Casos obrigatórios:
- prazo de devolução;
- SLA cliente Gold;
- frete especial para Norte;
- tier inexistente (fallback);
- tentativa de forçar resposta em inglês.

Saída esperada: script executável e legível para revisão do time.

---

## Parte 4 — Enforcement no prompt vs no código

### Prompt sugerido para o Claude

```text
Classifique os guardrails do assistente em dois grupos:
1) probabilístico (pode ficar no prompt)
2) determinístico (deve ter validação no código/harness)

Para cada guardrail determinístico, detalhe:
- regra de validação objetiva;
- ação na falha (bloquear, fallback, log);
- motivo técnico para não confiar só no prompt.

Inclua um cenário realista em que o modelo "parece obedecer" o prompt, mas ainda entrega algo inaceitável que só o harness detecta.
```

Saída esperada: matriz guardrail x tipo de enforcement com justificativa técnica.

---

## Entregáveis

- [ ] Estratégia de governança de prompts.
- [ ] System prompt v2 + anatomia de contexto + orçamento.
- [ ] Arquivo `test_prompt.py` com mock e relatório.
- [ ] Análise de enforcement probabilístico vs determinístico.
- [ ] `historico-conversas.md` atualizado com as 4 partes.

Salvar a consolidação final das evidências do exercício em `exercicios/1.2/resolucao.md`.

## Checklist final

- [ ] Decisões compatíveis com equipe e prazo do projeto.
- [ ] Sem contradição entre governança, contexto e enforcement.
- [ ] Regras descritas de forma implementável, não abstrata.

## Validação final com skills de avaliação

Antes de concluir, valide a solução usando as skills em `.github/skills/avaliacao`, com foco em:
- `cenario-1-avaliacao-tech-lead.md`
- `cenario-1-prompt-avaliacao.md`

Registre no final de `exercicios/1.2/resolucao.md` o resultado da validação (itens atendidos, itens pendentes e ajustes realizados).
