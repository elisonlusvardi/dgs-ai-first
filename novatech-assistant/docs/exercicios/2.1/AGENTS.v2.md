# AGENTS.md — NovaTech Assistant

Constitution do projeto. Todo agente de IA (Copilot, Claude Code) deve ler este arquivo antes de gerar qualquer artefato.

## Project Overview
- Regra: O projeto está em fase de estruturação; entregas devem ser mínimas, verificáveis e estritamente alinhadas ao escopo solicitado.
- Justificativa: Evita spec bloat e retrabalho.
- Verificação: PR não inclui funcionalidades fora da tarefa nem abstrações não solicitadas.

- Regra: Toda alteração técnica deve ser rastreável a specs/ADRs e aos diretórios oficiais do projeto.
- Justificativa: Governança arquitetural.
- Verificação: Descrição de PR explicita spec/ADR aplicável e paths alterados.

- Regra: O agente deve produzir regras operacionais em vez de texto genérico.
- Justificativa: Melhora obediência e auditabilidade.
- Verificação: Cada diretriz relevante contém Regra, Justificativa e Critério de Verificação.

## Tech Stack & Architecture
- Regra: Stack mandatória por camada:
- backend: TypeScript + Azure Functions v4 HTTP Trigger.
- validation: Zod.
- testing: Vitest.
- logging: pino (via logger central).
- IaC: Bicep.
- bot: Bot Framework / Teams.
- web panel: React.
- Justificativa: Consistência técnica do cenário.
- Verificação: Código novo respeita tecnologia prevista por camada.

- Regra: Responsabilidade por diretório:
- src/functions: borda HTTP, composição de request/response.
- src/services: regra de negócio e orquestração.
- src/shared: tipos/config/erros/logger.
- prompts: prompts versionados com changelog.
- docs/novatech: documentos de domínio.
- data/retrieval-corpus: chunks de retrieval.
- Justificativa: Fronteiras explícitas entre responsabilidades.
- Verificação: Handler sem regra de negócio extensa; service sem acoplamento HTTP.

- Regra: Contrato obrigatório de handler HTTP v4:
- validar input com Zod.
- delegar processamento para service.
- validar output com Zod antes de responder.
- mapear erro por abstrações de shared/errors.
- usar logger estruturado central.
- Justificativa: Evita variação de implementação entre endpoints.
- Verificação: Presença dos 5 passos no fluxo do handler.

- Regra: Context management (ADR-0002) obrigatório e bloqueante:
- system prompt aproximadamente 4K tokens.
- chunks por query aproximadamente 8K tokens.
- estratégia default: até 5 chunks com média ~1.5K.
- histórico máximo: 3 turnos relevantes.
- proibição: anexar documento inteiro quando chunk cobre o tópico.
- seleção por relevância + recência.
- registrar decisão de seleção de contexto em logs estruturados.
- Justificativa: Controle de custo e precisão.
- Verificação: Evidência de limites e seleção de contexto no código/logs.

- Regra: Vigência documental (ADR-0003) obrigatória e bloqueante:
- ao detectar versões conflitantes, informar conflito.
- priorizar versão mais recente com metadado de data/vigência.
- preservar histórico e rastreabilidade de versões anteriores.
- Justificativa: Evita mistura de regra antiga com regra vigente.
- Verificação: Resposta/código escolhe versão vigente e explicita critério.

## Coding Standards (Tech Lead)
- Regra: TypeScript strict é obrigatório e imutável.
- Justificativa: Segurança de tipo.
- Verificação: tsconfig mantém strict true e build sem atalhos de tipo.

- Regra: Proibido any implícito; cast inseguro só com justificativa técnica pontual.
- Justificativa: Contratos estáveis.
- Verificação: Revisão e lint sem escapes de tipo injustificados.

- Regra: Naming obrigatório:
- arquivos: kebab-case.
- funções/variáveis: camelCase.
- tipos/interfaces/schemas: PascalCase.
- schemas Zod com sufixo Schema.
- Justificativa: Consistência.
- Verificação: Novos símbolos seguem padrão.

- Regra: Validação com Zod é obrigatória para input e output de endpoints.
- Justificativa: Contratos explícitos na fronteira.
- Verificação: validator contém schemas e handler aplica parse/safeParse nos dois lados.

- Regra: Logging somente via src/shared/logger.ts; console.log e console.error são proibidos.
- Justificativa: Observabilidade e padronização.
- Verificação: Bloqueio por busca de console. em código de produção.

- Regra: Tratamento de erro somente via src/shared/errors.ts e mapeamento HTTP consistente.
- Justificativa: Uniformidade operacional.
- Verificação: Erros não normalizados são rejeitados em review.

- Regra: Handler HTTP deve ser fino e testável; regra de negócio em services.
- Justificativa: Manutenção e isolamento de testes.
- Verificação: Handler com baixa complexidade e chamadas diretas a service.

- Regra: Todo incremento funcional deve vir com testes Vitest mínimos:
- sucesso.
- falha de validação.
- erro interno.
- Justificativa: Cobertura de riscos centrais.
- Verificação: PR inclui testes para os três cenários quando aplicável.

- Regra: Conventional Commits é obrigatório.
- Justificativa: Histórico auditável.
- Verificação: Commits no padrão feat/fix/chore/test/docs/refactor.

- Regra: Proibido criar código fora da estrutura prevista sem aprovação explícita.
- Justificativa: Controle de escopo arquitetural.
- Verificação: Novos diretórios/arquivos fora da árvore alvo exigem justificativa formal no PR.

## Product Rules & Guardrails (Product Specialist)
TODO (Product Specialist — Ex. 2.3): seção intencionalmente não preenchida neste exercício.

## Testing Standards (QA)
TODO (QA — Ex. 2.1): seção intencionalmente não preenchida neste exercício.

## Project Management Rules (Delivery Manager)
TODO (Delivery Manager — Ex. 2.3): seção intencionalmente não preenchida neste exercício.

## Build & Deploy
- Regra: Gate mínimo obrigatório antes de review:
- npm run build
- npm run test
- npm run lint
- Justificativa: Qualidade mínima local.
- Verificação: PR registra evidência de execução dos três comandos.

- Regra: Política de branch e merge:
- feature branch obrigatória.
- PR obrigatório para main.
- proibido merge direto em main.
- Justificativa: Governança e revisão.
- Verificação: Histórico sem commit direto em main.

- Regra: Relação código, teste e validação:
- mudança funcional sem teste correspondente é inválida.
- endpoint sem schema Zod de input/output é inválido.
- uso de console.* em produção é inválido.
- Justificativa: Evitar regressão e drift de contrato.
- Verificação: Checklist de PR aprovado apenas se os três critérios forem atendidos.

- Regra: Compatibilidade com CI/CD e IaC é mandatória.
- Justificativa: Entrega previsível.
- Verificação: Alterações não quebram comandos de qualidade nem estrutura de infra/.

- Regra: Mudanças de infra devem ficar restritas a infra/ com Bicep versionado por ambiente.
- Justificativa: Infra declarativa e rastreável.
- Verificação: Alterações de provisionamento apenas em .bicep/.bicepparam apropriados.
