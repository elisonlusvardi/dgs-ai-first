# Prompt para GitHub Copilot — Health Check MCP

Implemente um script de health check em PowerShell no caminho `scripts/mcp-health-check.ps1`.

Requisitos obrigatórios:
- Ler `.mcp/mcp.json` como fonte primária.
- Usar `.mcp/mcp.example.json` apenas como referência de formato esperado.
- Se `.mcp/mcp.json` estiver vazio (`mcpServers` vazio), falhar com mensagem clara e `exit code != 0`.
- Validar por server: nome, `command`, e `args` (ou equivalente).
- Validar existência do executável base (`command`) quando possível.
- Exibir status por server em formato legível para humano e CI local (`PASS`, `WARN`, `FAIL`).
- Retornar `exit code != 0` em falhas críticas.
- Não depender de Azure/GitHub/Confluence remotos para validar contexto local.
