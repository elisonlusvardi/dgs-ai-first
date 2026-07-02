# AGENTS.md — NovaTech Assistant

Constitution do projeto. Todo agente de IA (Copilot, Claude Code) deve ler este arquivo antes de gerar qualquer artefato.

## Project Overview
- Regra: Este repositório está em fase de estruturação e contratos técnicos; todo código novo deve preservar arquitetura e padrões definidos neste documento.
- Justificativa: Evita deriva de implementação antes da consolidação dos contratos do projeto.
- Verificação: Mudanças propostas alteram apenas escopo solicitado na tarefa e respeitam diretórios existentes.
- Regra: O agente deve priorizar aderência a specs e ADRs antes de adicionar novas abstrações.
- Justificativa: Garante rastreabilidade de decisão técnica.
- Verificação: PR referencia explicitamente spec e decisões aqui descritas.

## Tech Stack & Architecture
- Regra: Stack mandatória por camada:
- backend: TypeScript + Azure Functions v4 HTTP Trigger
- validation: Zod
- testing: Vitest
- logging: pino
- IaC: Bicep
- bot: Bot Framework / Teams
- web panel: React
- Justificativa: Padronização tecnológica do projeto.
- Verificação: Implementações usam apenas as tecnologias listadas para cada camada.

- Regra: Responsabilidade por diretório:
- src/functions: handlers HTTP e validação de borda.
- src/services: regra de negócio e orquestração.
- src/shared: tipos, config, erros, logging e utilidades transversais.
- prompts: prompts versionados e rastreáveis.
- docs/novatech: fonte documental de domínio.
- data/retrieval-corpus: corpus/chunks para simulação de retrieval.
- Justificativa: Clarifica fronteiras entre camadas.
- Verificação: Handler não contém regra de negócio extensa; services não dependem de objeto HTTP.

- Regra: Prompts em prompts/ devem ser versionados e atualizados com changelog em prompts/prompt-changelog.md.
- Justificativa: Governança de comportamento do assistente.
- Verificação: Alteração de prompt inclui atualização de changelog.

- Regra (ADR-0002): Gerenciamento de contexto:
- system prompt: orçamento aproximado de 4K tokens.
- chunks por query: orçamento aproximado de 8K tokens.
- estratégia preferencial: ~5 chunks de ~1.5K, sem ultrapassar budget.
- histórico de conversa: máximo de 3 turnos relevantes.
- não anexar documento inteiro se chunk resolve.
- priorizar relevância e recência.
- Justificativa: Controle de custo e qualidade de resposta.
- Verificação: Pipeline/prompt builder aplica limites e registra seleção de contexto.

- Regra (ADR-0003): Em conflito documental, preservar histórico e priorizar versão mais recente com metadado de vigência/recência.
- Justificativa: Evita mistura de regras antigas e novas.
- Verificação: Resposta sinaliza conflito quando houver versões concorrentes e escolhe a vigente.

## Coding Standards (Tech Lead)
- Regra: TypeScript strict mode é obrigatório e não pode ser desativado.
- Justificativa: Segurança de tipos e redução de defeitos.
- Verificação: tsconfig mantém strict true; PR não altera isso para false.

- Regra: any implícito é proibido; cast inseguro só com justificativa técnica registrada no código.
- Justificativa: Evita fuga de contrato de tipos.
- Verificação: revisão identifica ausência de any implícito e casts não justificados.

- Regra: Naming:
- arquivos: kebab-case.
- funções/variáveis: camelCase.
- tipos/interfaces/schemas: PascalCase.
- schemas Zod devem ter sufixo Schema.
- Justificativa: Consistência de leitura e busca.
- Verificação: Novos arquivos e símbolos seguem padrão.

- Regra: Input e output de endpoints HTTP devem ser validados com Zod.
- Justificativa: Contratos explícitos de API.
- Verificação: Handler usa parse/safeParse para request e response.

- Regra: Logging deve usar pino (ou wrapper central em src/shared/logger.ts); console.log e console.error são proibidos.
- Justificativa: Observabilidade estruturada.
- Verificação: Ausência de chamadas console.* no código de produção.

- Regra: Tratamento de erro deve usar abstrações em src/shared/errors.ts e mapeamento consistente de status HTTP.
- Justificativa: Uniformidade de erro e rastreabilidade.
- Verificação: Handler não lança erro cru sem normalização.

- Regra: Handler HTTP deve ser fino; regra de negócio deve residir em services.
- Justificativa: Separação de responsabilidades e testes focados.
- Verificação: funções em handler com baixa complexidade e delegação para services.

- Regra: Todo código novo deve ser testável e acompanhado por testes Vitest proporcionais ao risco.
- Justificativa: Previne regressões.
- Verificação: PR com mudança funcional inclui ou atualiza testes.

- Regra: Commits devem seguir Conventional Commits.
- Justificativa: Histórico legível e automação de release.
- Verificação: Mensagens no padrão feat:, fix:, chore:, test:, docs:, refactor:.

- Regra: Não criar código fora da estrutura prevista; preferir mudanças pequenas, incrementais e aderentes a ADRs/specs.
- Justificativa: Controle de escopo e previsibilidade de entrega.
- Verificação: PR limitado ao problema-alvo e com impacto arquitetural justificável.

## Product Rules & Guardrails (Product Specialist)
TODO (Product Specialist — Ex. 2.3): seção intencionalmente não preenchida neste exercício.

## Testing Standards (QA)
TODO (QA — Ex. 2.1): seção intencionalmente não preenchida neste exercício.

## Project Management Rules (Delivery Manager)
TODO (Delivery Manager — Ex. 2.3): seção intencionalmente não preenchida neste exercício.

## Build & Deploy
- Regra: Antes de solicitar code review, executar obrigatoriamente:
- npm run build
- npm run test
- npm run lint
- Justificativa: Garantia mínima de qualidade local.
- Verificação: PR descreve execução e resultado dos três comandos.

- Regra: Fluxo de branch:
- desenvolvimento em feature branch obrigatório.
- PR obrigatório para merge em main.
- merge direto em main é proibido.
- Justificativa: Governança e revisão técnica.
- Verificação: Histórico Git sem commits diretos em main por desenvolvedores.

- Regra: Critério mínimo de entrada em code review:
- build sem erro.
- testes relevantes passando.
- lint sem erro.
- validações Zod aplicadas nas fronteiras alteradas.
- Justificativa: Reduz retrabalho em revisão.
- Verificação: Checklist preenchido na descrição do PR.

- Regra: Toda mudança de código funcional deve incluir validação correspondente (teste e/ou schema) e manter compatibilidade com IaC/CI/CD.
- Justificativa: Evita desalinhamento entre runtime e pipeline.
- Verificação: Mudança em app não quebra estrutura de infra/ nem comandos de pipeline.

- Regra: Alterações de infraestrutura devem permanecer em infra/ com Bicep versionado e coerente com ambiente alvo.
- Justificativa: Infra declarativa e auditável.
- Verificação: Mudanças de provisionamento só em arquivos .bicep/.bicepparam adequados.
