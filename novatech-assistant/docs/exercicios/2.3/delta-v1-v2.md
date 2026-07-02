# Resumo das melhorias v1 -> v2

1. Endurecimento de validação de output Zod como critério bloqueante.
Impacto: reduz respostas parcialmente corretas com contrato de saída inconsistente.

2. Inclusão de gate explícito de reprovação para `console.log`/`console.error`.
Impacto: reforça observabilidade padronizada com pino.

3. Regras de handler fino tornadas objetivas (validar, delegar, responder).
Impacto: diminui acoplamento e aumenta testabilidade.

4. Checklist refinado com itens verificáveis e foco em paths reais.
Impacto: melhora consistência de estrutura entre endpoints gerados.

5. Critérios de teste da skill com rodada-padrão e sinais claros de fraqueza.
Impacto: facilita iteração contínua da skill com base em evidência.

6. Inclusão explícita de contexto local do projeto e requisitos de ADR-0002/0003.
Impacto: reduz desvios de escopo e respostas desalinhadas do cenário NovaTech.
