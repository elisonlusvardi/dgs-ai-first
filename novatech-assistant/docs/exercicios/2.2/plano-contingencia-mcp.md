# Plano de Contingência MCP

## Gatilhos
- indisponibilidade de server crítico (não inicializa/comando ausente)
- latência anormal persistente acima do limiar definido
- resposta estrutural inválida
- resposta semântica incorreta/desatualizada (conflito com fonte vigente)
- drift entre configuração aprovada e configuração ativa

## Fallback por tipo de server
- GitHub MCP (produção): fallback para fluxo manual de PR via processo humano.
- Azure AI Search MCP (produção): fallback para corpus controlado/último snapshot validado quando permitido.
- Azure OpenAI MCP (produção): fallback para fila de processamento e resposta assíncrona.
- Confluence MCP (produção): fallback para documentação versionada exportada e validada.
- Azure DevOps MCP (produção): fallback para atualização manual de work items.
- filesystem/git/memory/everything (local): fallback para execução parcial sem server auxiliar e registro explícito de degradação.

## Responsáveis (Owner)
- Tech Lead: decisão de bloqueio vs continuidade e governança de configuração.
- Platform/Infra: recuperação de disponibilidade e latência.
- Product/Knowledge Owner: validação semântica e vigência documental.

## Decisão de Bloqueio vs Continuidade
Bloquear tarefa (fail closed):
- server crítico sem fallback seguro.
- risco de resposta incorreta com impacto operacional alto.
- perda de rastreabilidade/auditoria obrigatória.

Continuar com degradação controlada:
- server não crítico indisponível.
- fallback manual seguro e aprovado.
- impacto limitado, com registro explícito do modo degradado.

## Registro e Comunicação
- Registrar incidente com timestamp, server afetado, impacto, decisão e owner.
- Comunicar em canal operacional definido do time.
- Abrir ação corretiva para eliminar causa-raiz e prevenir reincidência.
