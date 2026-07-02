# Matriz de Servers MCP

| Server | Ambiente | Finalidade | Permissão mínima | Criticidade |
|---|---|---|---|---|
| GitHub MCP | Produção | Ler código e criar PR em fluxo controlado | Read por padrão; write apenas para PR autorizado | Alta |
| Azure AI Search MCP | Produção | Query de índice para retrieval | Read/query only | Alta |
| Azure OpenAI MCP | Produção | Completion/chat completion | Invoke em deployment aprovado; sem admin | Alta |
| Confluence NovaTech MCP | Produção | Leitura de documentação corporativa | Read-only em spaces autorizados | Média |
| Azure DevOps MCP | Produção | Ler/escrever work items | Read por padrão; write escopado com auditoria | Média-Alta |
| filesystem MCP | Local | Ler/editar arquivos locais do projeto | Escopo restrito a src/specs/skills/docs/data | Alta |
| git MCP | Local | Histórico e branches do repositório local | Read por padrão; sem operações destrutivas automáticas | Média-Alta |
| memory MCP | Local | Memória persistente de decisões | Leitura/escrita restrita ao contexto do projeto | Média |
| everything MCP | Local | Exploração de primitivas MCP | Operações não destrutivas | Baixa |
