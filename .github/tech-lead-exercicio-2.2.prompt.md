# Prompts — Tech Lead 2.2 (Arquitetura de MCP para o Projeto)

Objetivo: executar o exercício 2.2 com artefatos concretos e verificáveis, tratando MCP servers como infraestrutura gerenciada, com distinção explícita entre arquitetura de produção e arquitetura local do starter repo.


## Prompt 1 — Execução Completa do Exercício 2.2
Você é o Tech Lead do projeto NovaTech Assistant.

Sua missão é entregar o pacote completo do exercício 2.2:
- documento de arquitetura MCP
- script de health check funcional para o contexto local
- prompt para GitHub Copilot implementar esse health check
- plano de contingência para indisponibilidade de MCP server

Importante: não fugir do contexto do exercício e não inventar disponibilidade de serviços que não existem localmente.

---

## 1) Contexto e Limites

Contexto do cenário (alvo de produção):
- MCP servers são infraestrutura gerenciada
- Tech Lead define servers autorizados e tools expostas
- mapeamento simulado de servers de negócio:
  1. GitHub (read code, create PR)
  2. Azure AI Search (read index, query)
  3. Azure OpenAI (completion API)
  4. Confluence NovaTech (read pages)
  5. Azure DevOps (read/write work items)

Contexto real do starter repo (execução local):
- `.mcp/mcp.json` existe e está vazio (`{"mcpServers": {}}`)
- `.mcp/mcp.example.json` contém referência de servers locais:
  - filesystem
  - git
  - memory
  - everything
- README explicita que no exercício local:
  - não há GitHub remoto obrigatório
  - não há Azure obrigatório
  - não há Confluence
  - equivalências locais:
    - `docs/novatech/` no lugar de Confluence
    - `data/retrieval-corpus/` no lugar de fonte de retrieval externa

Diretriz central:
- não fingir que serviços remotos existem localmente
- propor arquitetura-alvo de produção
- propor arquitetura local executável
- explicar substituição, simulação e degradação entre os dois contextos

---

## 2) Estrutura Real a Referenciar

Use estes caminhos como âncoras reais:
- `.mcp/mcp.json`
- `.mcp/mcp.example.json`
- `docs/novatech/`
- `data/retrieval-corpus/`
- `src/`
- `specs/`
- `skills/`

Não usar paths inventados.

---

## 3) Protocolo de Execução em Fases (obrigatório)

### Fase A — Alinhamento de Escopo
- Reafirme em 4-8 bullets o que será entregue.
- Declare explicitamente o que não será assumido (ex.: Azure/GitHub/Confluence reais no ambiente local).

### Fase B — Arquitetura MCP
- Produzir documento completo cobrindo todos os requisitos da seção 4.
- Diferenciar produção x local em cada parte crítica (server, permissão, monitoramento, fallback).

### Fase C — Health Check
- Definir tecnologia do script (TypeScript/Node ou PowerShell) com justificativa curta.
- Entregar script completo e executável para o contexto local.

### Fase D — Prompt para Copilot
- Entregar prompt curto, objetivo e aderente ao repositório para implementação do health check.

### Fase E — Contingência
- Entregar plano de contingência com gatilhos, fallback, owner e decisão de bloqueio/continuidade.

### Fase F — Auto-validação
- Verificar checklist da seção 8 antes de finalizar.

---

## 4) Conteúdo Obrigatório do Documento de Arquitetura MCP

### 4.1 Visão Geral
- Papel de MCP servers no projeto
- Diferença entre:
  - arquitetura-alvo de produção
  - arquitetura local de desenvolvimento
- Declaração explícita: MCP é infra versionada e aprovada, não configuração ad-hoc

### 4.2 Catálogo de Servers Autorizados
Para cada server, incluir:
- nome
- ambiente (local, produção, ambos)
- finalidade
- consumidores (papéis/agentes)
- tools expostas
- resources expostos
- prompts expostos (se houver)
- criticidade
- permissão mínima

Mínimo obrigatório no catálogo:
- produção: GitHub, Azure AI Search, Azure OpenAI, Confluence NovaTech, Azure DevOps
- local: filesystem, git, memory, everything

### 4.3 Diagrama de Conexões
- diagrama Mermaid
- separar visualmente local e produção
- mostrar quem consome o quê
- mostrar fluxo principal para código, documentação, memória e serviços externos

### 4.4 Política de Aprovação de Novo MCP Server
Definir processo prescritivo com:
- quem propõe
- quem revisa
- quem aprova
- evidências obrigatórias
- critérios de segurança/utilidade
- como registrar decisão
- onde versionar configuração

### 4.5 Política de Permissões (least privilege)
- separar leitura/escrita
- restringir escopo por ambiente
- evitar credenciais amplas
- separar permissões dev/CI/produção
- definir quando write é permitido e quando é proibido

### 4.6 Monitoramento e Observabilidade
Definir detecção de:
- indisponibilidade
- latência anormal
- resposta estrutural inválida
- resposta semanticamente incorreta/desatualizada
- drift de configuração entre ambientes

Incluir:
- sinais mínimos por server
- cadência de verificação
- owner
- mecanismo de notificação
- distinção falha crítica vs falha degradável

### 4.7 Versionamento e Compatibilidade
- versionamento de configuração
- changelog
- política de breaking change
- validação local pré-rollout
- fallback para tool/resource removida ou alterada

### 4.8 Plano de Contingência
- impacto por tipo de server
- comportamento degradado aceitável
- quando bloquear tarefa
- quando seguir com fallback manual
- como registrar e comunicar incidente

---

## 5) Requisitos Obrigatórios do Script de Health Check

O script deve ser funcional para o starter repo local.

Regras:
- usar `.mcp/mcp.json` como fonte primária
- se vazio, falhar com mensagem clara e exit code != 0
- validar por server:
  - nome
  - command
  - args ou equivalente
- validar existência do executável base quando possível
- executar checagem plausível de configuração/resposta sem depender de serviços pagos
- produzir saída legível por humano e CI local
- retornar exit code != 0 em falhas críticas

Tecnologia:
- preferir TypeScript/Node ou PowerShell
- justificar escolha em 1-3 linhas
- indicar path sugerido do script (ex.: `scripts/mcp-health-check.ps1`)

Regra de realidade:
- não propor check impossível para Azure/Confluence/GitHub remotos no ambiente local
- para produção, descrever extensibilidade sem perder execução local concreta

---

## 6) Requisitos do Prompt para GitHub Copilot

Gerar um prompt curto para implementar o health check que:
- cite `.mcp/mcp.json`
- cite `.mcp/mcp.example.json` como referência
- exija comportamento claro para config vazia
- exija saída de status por server
- exija exit code apropriado

---

## 7) Regras de Qualidade (anti-ambiguidade)

Ao escrever os artefatos:
- evitar linguagem vaga sem critério verificável
- usar estrutura de decisão quando possível:
  - Regra
  - Justificativa curta
  - Critério de verificação
- evitar excesso de teoria
- priorizar artefatos prontos para uso
- declarar premissas explicitamente quando necessário
- preferir "agente degradado" a "agente quebrado" quando seguro

---

## 8) Checklist de Auto-Validação (obrigatório)

Antes da resposta final, validar:
1. Produção e local foram claramente separados?
2. O catálogo inclui os 5 servers de produção e 4 locais?
3. O diagrama Mermaid diferencia os ambientes?
4. A política de aprovação está executável e versionável?
5. A política de permissões segue least privilege?
6. Monitoramento inclui sinais, cadência, owner e notificação?
7. O plano de versionamento cobre breaking change e fallback?
8. O script funciona no contexto local e falha corretamente com `.mcp/mcp.json` vazio?
9. O prompt para Copilot está curto e acionável?
10. O plano de contingência define bloqueio vs continuidade?

Se qualquer resposta for "não", corrigir antes de finalizar.

---

## 9) Formato Obrigatório da Resposta

Responder em Markdown com exatamente 5 blocos, nesta ordem:

1. Arquitetura MCP
- documento completo
- seções claras
- diagrama Mermaid

2. Matriz de servers
- tabela com: ambiente, finalidade, permissão mínima, criticidade

3. Prompt para GitHub Copilot
- prompt curto para implementar o health check

4. Script de health check esperado
- código completo, pronto para salvar no projeto

5. Plano de contingência
- gatilhos
- fallback
- responsáveis
- decisão de bloqueio/continuidade

---

## 10) Restrições Finais

- Não responder genericamente.
- Não ignorar contexto real do starter repo.
- Não assumir disponibilidade de GitHub/Azure/Confluence/Azure DevOps no ambiente local.
- Não entregar só teoria.
- Não inventar caminhos.
- Escrever em português, mantendo termos técnicos em inglês quando necessário.
