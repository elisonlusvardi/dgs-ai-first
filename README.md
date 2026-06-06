# dgs-ai-first

Repositório de estudo para a Fase 1 (Entendimento e Contexto) do cenário NovaTech, com foco em IA Generativa, Engenharia de Prompt, Engenharia de Contexto e RAG.

## Visão do projeto

O projeto simula a construção de um assistente de IA para atendimento da NovaTech, capaz de responder perguntas com base em documentação corporativa e citação de fontes.

Contexto de negócio resumido:

- Empresa de logística com alto volume de chamados.
- Documentação distribuída e com contradições entre versões.
- Meta de reduzir tempo de busca de informação no atendimento.
- Janela de 3 meses para discovery, desenvolvimento e go-live.

## Papel deste repositório

Este repositório organiza os artefatos da fase de entendimento e os exercícios por papel. Para este workspace, o papel alvo é **Tech Lead**.

## Escopo para Tech Lead

O trilho de Tech Lead está dividido em 3 exercícios principais:

1. **Exercício 1.1 — ADRs de Arquitetura**
	- Produzir 4 ADRs: modelo LLM, estratégia de contexto, tratamento de documentos contraditórios e build vs buy do pipeline de RAG.
	- Incluir trade-offs, riscos de implementação e revisão adversarial (devil's advocate).

2. **Exercício 1.2 — Prompt Engineering como Arquitetura**
	- Definir governança de prompts (versionamento, revisão e testes).
	- Desenhar anatomia de contexto (partes estáticas e dinâmicas, orçamento e overflow).
	- Implementar script de testes de prompt com validações mínimas.

3. **Exercício 1.3 — Revisão Crítica de Arquitetura RAG**
	- Fazer revisão independente da proposta (sem IA).
	- Fazer segunda revisão com IA e consolidar os resultados.
	- Reescrever a proposta final de forma implementável e pragmática.

## Arquivos de especificação

Arquivos centrais para condução da trilha:

- `.github/exercicio-fase-1-entendimento.md`
- `.github/anexo-a-documentacao-simulada-novatech.md`
- `.github/anexo-b-chunks-referencia-rag.md`
- `.github/tech-lead-exercicio-1.1-prompt.md`
- `.github/tech-lead-exercicio-1.2-prompt.md`
- `.github/tech-lead-exercicio-1.3-prompt.md`

Documentos de domínio (base de verdade para análise e validação):

- `.github/POL-001-politica-devolucao.md`
- `.github/PROC-042-frete-especial-v1.md`
- `.github/PROC-042-v2-frete-especial-revisado.md`
- `.github/SLA-2024-tabela-sla-clientes.md`
- `.github/FAQ-atendimento.md`

## Entregáveis esperados (Tech Lead)

- `exercicios/1.1/resolucao.md`
- `exercicios/1.2/resolucao.md`
- `exercicios/1.3/resolucao.md`
- `historico-conversas.md`
- `test_prompt.py` (parte do exercício 1.2)

Observação: alguns arquivos de entregável podem ainda não existir neste momento e serão criados ao longo da execução dos exercícios.

## Critérios de qualidade da trilha

- Decisões arquiteturais com trade-offs explícitos.
- Regras de contexto e guardrails descritas de forma implementável.
- Evidência de iteração humano + IA (não aceitação acrítica).
- Rastreabilidade entre decisão, fonte documental e resultado final.

## Setup técnico do workspace (apoio)

Além dos materiais de especificação, o workspace possui um bootstrap simples em PowerShell para validar ambiente VS Code.

Requisitos:

- Windows com PowerShell 5.1+.

Execução:

```powershell
.\main.ps1
```

Saída esperada:

```text
Hello World from dgs_ai_first
```

Task disponível no VS Code:

- `Run Hello World` em `.vscode/tasks.json`

Configuração de debug disponível:

- `Debug Hello World (PowerShell)` em `.vscode/launch.json`
