# Critérios de maturidade da skill

1. Aderência mínima >= 90% nos 10 itens da análise em 2 rodadas consecutivas.
2. Zero recorrência de `console.log`/`console.error` em 2 rodadas consecutivas.
3. Zero ausência de schema de output em 2 rodadas consecutivas.
4. Máximo de 1 correção estrutural por rodada (handler vs service vs validator).
5. 100% dos endpoints gerados com teste unitário Vitest cobrindo sucesso, validação inválida e erro interno.
6. Skill utilizável por outro dev sem explicação oral adicional (apenas lendo o arquivo).
7. Aderência explícita a ADR-0002/0003 quando aplicável ao endpoint gerado.
8. Nenhum path fora da estrutura do projeto (`src/functions`, `src/services`, `src/shared`, `tests/unit`).
