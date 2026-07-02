# Evidência de teste real com Copilot — Exercício 2.2

## Contexto
- Ferramenta: GitHub Copilot Chat
- Modelo: GPT-5.3-Codex
- Objetivo: gerar script de health check MCP local e validar execução
- Data: 2026-07-02

## Prompt utilizado
Prompt em `prompt-copilot-health-check.md`.

## Saída gerada (resumo)
- Script PowerShell em `scripts/mcp-health-check.ps1` com:
  - leitura de `.mcp/mcp.json`
  - validação de `mcpServers`
  - validação por server (`command`, `args`)
  - status por server (`PASS`/`WARN`/`FAIL`)
  - `exit code != 0` para falhas críticas

## Execução real — cenário 1 (config vazia)
Comando:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\mcp-health-check.ps1
```

Saída observada:
```text
[INFO] Configuração alvo: ...\.mcp\mcp.json
[FAIL] mcpServers está vazio em '...\.mcp\mcp.json'. Configure ao menos um server.
Command exited with code 1
```

## Execução real — cenário 2 (config de exemplo)
Comando:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\mcp-health-check.ps1 -ConfigPath .mcp/mcp.example.json
```

Saída observada:
```text
[INFO] Servers encontrados: 4
[PASS] filesystem command encontrado
[PASS] filesystem args presentes
[PASS] filesystem paths válidos
[WARN] git command 'uvx' não encontrado no PATH
[PASS] memory command encontrado
[PASS] everything command encontrado
[WARN] Health check concluído com avisos (sem falhas críticas)
```

## Conclusão
- O health check foi gerado e validado com execução real local.
- O comportamento degradado está explícito (WARN para dependência ausente não crítica no cenário local).
