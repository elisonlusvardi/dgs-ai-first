# Prompt de teste para GitHub Copilot

Implemente um endpoint HTTP Azure Functions v4 para feedback usando caminhos reais do projeto:
- `src/functions/feedback/handler.ts`
- `src/functions/feedback/validator.ts`
- `src/services/` para regra de negócio

Requisitos obrigatórios:
- TypeScript strict-friendly (sem `any` implícito)
- validação de input e output com Zod
- logging estruturado com pino
- proibição total de `console.log` e `console.error`
- separação clara entre handler, validator e service
- código testável com Vitest em `tests/unit/`
- seguir ADR-0002 em endpoints de query e ADR-0003 quando houver documentos contraditórios/versionados
