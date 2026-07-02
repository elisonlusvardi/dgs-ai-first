# Exercício 2.2 — Artefatos

Arquivos entregues:
- `arquitetura-mcp.md`
- `matriz-servers.md`
- `prompt-copilot-health-check.md`
- `plano-contingencia-mcp.md`
- `evidencia-copilot-health-check.md`
- `../../scripts/mcp-health-check.ps1`

Execução local do health check:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\mcp-health-check.ps1
```

Teste com configuração de exemplo:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\mcp-health-check.ps1 -ConfigPath .mcp/mcp.example.json
```
