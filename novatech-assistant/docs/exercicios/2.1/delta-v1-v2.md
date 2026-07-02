# Mudanças v1 -> v2

1. Tornado bloqueante o contrato do handler HTTP (validar input, delegar, validar output, mapear erro, logar).
Impacto: reduz respostas parcialmente aderentes em Azure Functions v4 e separação handler-service.

2. Reforçada proibição de console.* com critério explícito de bloqueio.
Impacto: diminui violação recorrente de observabilidade e padroniza logging em pino.

3. Expandida regra de Zod para obrigar validação de output, não só input.
Impacto: evita retorno de payload fora do contrato.

4. ADR-0002 passou de diretriz para regra bloqueante com registro de seleção de contexto.
Impacto: melhora previsibilidade de custo e aderência a budget de tokens.

5. ADR-0003 explicitada como política operacional de conflito documental com critério de decisão.
Impacto: reduz mistura de versões contraditórias e melhora rastreabilidade.

6. Adicionado gate mínimo de testes por risco (sucesso, validação, erro interno).
Impacto: aumenta cobertura útil de Vitest e reduz regressão de endpoint.

7. Incluída regra explícita para não criar diretórios fora da árvore aprovada sem justificativa.
Impacto: evita dispersão estrutural e mantém aderência aos caminhos reais do repositório.
