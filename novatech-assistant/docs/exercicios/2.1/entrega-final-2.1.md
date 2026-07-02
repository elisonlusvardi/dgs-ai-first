# 1. AGENTS.md v1

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

# 2. Prompts de teste para GitHub Copilot

## Prompt A (endpoint)
Você está no repositório NovaTech Assistant.
Implemente endpoint HTTP de query com Azure Functions v4 e contratos Zod, sem sair da estrutura existente.

Tarefas:
1. Editar src/functions/query/handler.ts para criar um handler HTTP fino (recebe request, valida input, chama service, valida output, retorna response).
2. Editar src/functions/query/validator.ts para definir schemas Zod de input e output.
3. Implementar lógica de orquestração em src/services/search.ts e/ou src/services/completion.ts, mantendo regra de negócio fora do handler.
4. Usar logger estruturado central em src/shared/logger.ts.
5. Tratar erros via src/shared/errors.ts.
6. NÃO usar console.log ou console.error.
7. Preservar TypeScript strict.
8. Respeitar ADR-0002 no desenho do contexto: system prompt ~4K, chunks ~8K, preferir ~5 chunks de ~1.5K, histórico máximo 3 turnos relevantes.
9. Em conflito documental, sinalizar conflito e priorizar documento mais recente (ex.: PROC-042-v2), sem apagar histórico de versões.

Critérios de aceitação:
- Handler separado de service.
- Input e output validados com Zod.
- Código compilável com npm run build.
- Sem console.*.

## Prompt B (teste)
Você está no repositório NovaTech Assistant.
Crie testes Vitest para o endpoint de query respeitando arquitetura do projeto.

Tarefas:
1. Criar arquivo de teste unitário dentro de tests/unit para cobrir o handler de src/functions/query/handler.ts.
2. Cobrir cenário feliz com input válido e output validado por Zod.
3. Cobrir cenário de input inválido (erro de validação).
4. Cobrir cenário de erro interno no service com mapeamento de erro esperado.
5. Garantir que logs usem camada de logger e que não exista dependência de console.*.
6. Se necessário, usar fixtures de tests/fixtures.

Critérios de aceitação:
- Testes executam com npm run test.
- Casos principais cobertos: sucesso, validação, erro interno.
- Testes reforçam separação handler vs service.
- Sem dependência de implementação fora da estrutura atual.

# 3. Análise de aderência esperada

| Item avaliado | Copilot seguiu? | Evidência esperada no output | Ajuste necessário no AGENTS.md |
|---|---|---|---|
| 1. TypeScript strict-friendly | Parcial | Tipos explícitos e ausência de any implícito; compila em strict | Tornar bloqueante: proibir workaround de tipo sem justificativa e exigir compile local antes de PR |
| 2. Azure Functions v4 | Parcial | Handler modelado como HTTP trigger v4, assinatura e retorno consistentes | Especificar mais claramente contrato mínimo do handler (entrada, saída, status) |
| 3. Zod | Parcial | Schemas de input e output em validator e uso no handler | Exigir validação de output além de input (muitos agentes validam só input) |
| 4. pino | Parcial | Import de logger central e logs estruturados por contexto | Exigir uso exclusivo de logger central para evitar criação de logger ad hoc |
| 5. ausência de console.log | Não | Nenhum console.* no código de produção | Adicionar regra de bloqueio explícita com critério grep console. |
| 6. separação handler vs service | Parcial | Handler curto delegando negócio para service | Definir limite operacional: handler só valida/delega/mapeia resposta |
| 7. Vitest | Sim | Testes em tests/unit com vitest e cenários essenciais | Reforçar cobertura mínima por tipo de risco (sucesso/validação/erro interno) |
| 8. aderência a caminhos reais do repositório | Sim | Edição em paths existentes (src/functions/query, src/services, src/shared, tests) | Incluir regra “não criar diretório fora da árvore alvo sem aprovação” |
| 9. regras de contexto (ADR-0002) e vigência documental (ADR-0003) | Parcial | Limites de tokens/histórico aplicados e escolha de versão vigente em conflito | Tornar obrigatório registrar seleção de chunks e decisão de vigência no fluxo |

# 4. AGENTS.md v2

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

# 5. Mudanças v1 -> v2

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
