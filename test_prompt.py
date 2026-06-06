"""Harness local para validar respostas de prompt com mock de LLM.

Uso:
    python test_prompt.py
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


SYSTEM_PROMPT_V2 = (
    "Voce e o assistente de atendimento da NovaTech, empresa de logistica. "
    "Responda somente com base nos documentos fornecidos, cite a fonte "
    "(documento e secao), nao invente prazos/valores e, quando faltar dado, "
    "explique a lacuna e sugira escalonamento ao supervisor/comercial. "
    "Responda em portugues formal e claro. Em conflito entre versoes, "
    "mostre ambas e destaque a mais recente."
)


PROHIBITED_TERMS = [
    "eu acho",
    "talvez",
    "chute",
    "provavelmente",
    "sem confirmar",
]


@dataclass(frozen=True)
class TestCase:
    name: str
    user_question: str
    expected_keywords: tuple[str, ...]
    should_fallback: bool


@dataclass(frozen=True)
class CriterionResult:
    criterion: str
    passed: bool
    detail: str


def mock_llm_response(system_prompt: str, question: str) -> str:
    """Simula respostas do assistente com base em regras fixas."""
    question_l = question.lower()

    if "devolucao" in question_l or "devolução" in question_l:
        return (
            "O prazo geral para solicitar devolucao e de ate 7 dias uteis apos o "
            "recebimento confirmado. Cargas perigosas nao sao elegiveis pelo processo "
            "padrao e devem ser tratadas pela Gestao de Riscos (ramal 4500). "
            "[Fonte: POL-001 - Secoes 3.1 e 3.2]"
        )

    if "gold" in question_l:
        return (
            "Para cliente Gold, o SLA de chamados gerais e primeira resposta em ate "
            "2h uteis e resolucao em ate 24h uteis. Para incidentes criticos, "
            "primeira resposta em ate 30min e resolucao em ate 4h. "
            "[Fonte: SLA-2024 - Secao 2]"
        )

    if "norte" in question_l and "frete" in question_l:
        return (
            "Para frete especial (acima de 500kg), a versao revisada indica "
            "multiplicador Norte de 1.8 e fator de peso de 1.0 para 500 a 1000kg. "
            "Existe versao anterior com 1.6, mas a mais recente e a v2. "
            "[Fonte: PROC-042-v2 - Secoes 2 e 2.1; PROC-042 - Secao 2.1]"
        )

    if "platinum" in question_l or "tier inexistente" in question_l:
        return (
            "Nao encontrei tier Platinum na base oficial. Os tiers validos sao "
            "Gold, Silver e Standard. Para excecao contratual, escale para o Comercial. "
            "[Fonte: SLA-2024 - Secao 1]"
        )

    if "english" in question_l or "ingles" in question_l or "inglês" in question_l:
        return (
            "Nao posso responder em ingles neste fluxo. Em portugues: os tiers oficiais "
            "sao Gold, Silver e Standard; nao ha tier Platinum. "
            "[Fonte: SLA-2024 - Secao 1]"
        )

    return (
        "Nao encontrei informacao suficiente na base para responder com seguranca. "
        "Sugiro escalar para o supervisor e validar com a area responsavel. "
        "[Fonte: Base consultada sem cobertura direta]"
    )


def has_source_citation(response: str) -> CriterionResult:
    has_citation = "[Fonte:" in response and "]" in response
    detail = "citacao presente" if has_citation else "resposta sem citacao de fonte"
    return CriterionResult("citacao_de_fonte", has_citation, detail)


def has_no_prohibited_terms(response: str) -> CriterionResult:
    response_l = response.lower()
    found = [term for term in PROHIBITED_TERMS if term in response_l]
    passed = len(found) == 0
    detail = "sem termos proibidos" if passed else f"termos proibidos encontrados: {found}"
    return CriterionResult("sem_termos_proibidos", passed, detail)


def is_portuguese_like(response: str) -> CriterionResult:
    tokens = response.lower().split()
    pt_markers = {"nao", "para", "com", "os", "as", "em", "ate", "resposta", "fonte"}
    marker_count = sum(1 for token in tokens if token.strip(".,;:!?[]") in pt_markers)
    passed = marker_count >= 4
    detail = f"marcadores pt-br detectados: {marker_count}" if passed else "indicios insuficientes de pt-br"
    return CriterionResult("resposta_em_portugues", passed, detail)


def within_size_limit(response: str, max_chars: int = 500) -> CriterionResult:
    passed = len(response) <= max_chars
    detail = f"{len(response)} chars (limite {max_chars})"
    return CriterionResult("limite_tamanho", passed, detail)


def fallback_when_needed(response: str, expected_fallback: bool) -> CriterionResult:
    response_l = response.lower()
    has_fallback = "nao encontrei" in response_l and "escal" in response_l
    passed = has_fallback if expected_fallback else not has_fallback
    if expected_fallback:
        detail = "fallback correto" if passed else "faltou fallback para caso sem cobertura"
    else:
        detail = "sem fallback indevido" if passed else "fallback apareceu em caso com cobertura"
    return CriterionResult("fallback_adequado", passed, detail)


def contains_expected_keywords(response: str, expected_keywords: tuple[str, ...]) -> CriterionResult:
    response_l = response.lower()
    missing = [kw for kw in expected_keywords if kw.lower() not in response_l]
    passed = len(missing) == 0
    detail = "keywords esperadas presentes" if passed else f"keywords ausentes: {missing}"
    return CriterionResult("aderencia_minima_conteudo", passed, detail)


def evaluate_case(
    case: TestCase,
    generator: Callable[[str, str], str],
    system_prompt: str,
) -> tuple[str, list[CriterionResult]]:
    response = generator(system_prompt, case.user_question)
    results = [
        has_source_citation(response),
        has_no_prohibited_terms(response),
        is_portuguese_like(response),
        within_size_limit(response),
        fallback_when_needed(response, case.should_fallback),
        contains_expected_keywords(response, case.expected_keywords),
    ]
    return response, results


def print_report(cases: list[TestCase], generator: Callable[[str, str], str]) -> None:
    print("=== Relatorio de Teste de Prompt (Mock LLM) ===")
    print(f"Prompt base: {SYSTEM_PROMPT_V2}\n")

    total = 0
    passed = 0

    for index, case in enumerate(cases, start=1):
        response, results = evaluate_case(case, generator, SYSTEM_PROMPT_V2)
        print(f"Caso {index}: {case.name}")
        print(f"Pergunta: {case.user_question}")
        print(f"Resposta mock: {response}")

        case_pass = 0
        for result in results:
            total += 1
            status = "PASS" if result.passed else "FAIL"
            if result.passed:
                passed += 1
                case_pass += 1
            print(f"  - {result.criterion}: {status} ({result.detail})")

        print(f"Resumo do caso: {case_pass}/{len(results)} criterios aprovados\n")

    print("=== Resumo Geral ===")
    print(f"Criterios aprovados: {passed}/{total}")
    print(f"Taxa de aprovacao: {(passed / total) * 100:.1f}%")


def main() -> None:
    test_cases = [
        TestCase(
            name="Prazo de devolucao",
            user_question="Qual o prazo de devolucao de mercadoria?",
            expected_keywords=("7 dias uteis", "POL-001", "3.1"),
            should_fallback=False,
        ),
        TestCase(
            name="SLA cliente Gold",
            user_question="Qual o SLA para cliente Gold?",
            expected_keywords=("2h", "24h", "SLA-2024"),
            should_fallback=False,
        ),
        TestCase(
            name="Frete especial para Norte",
            user_question="Para frete especial para Norte, qual multiplicador usar?",
            expected_keywords=("1.8", "v2", "PROC-042-v2"),
            should_fallback=False,
        ),
        TestCase(
            name="Tier inexistente (fallback)",
            user_question="Existe SLA para tier Platinum?",
            expected_keywords=("nao encontrei", "gold", "silver", "standard"),
            should_fallback=True,
        ),
        TestCase(
            name="Tentativa de forcar ingles",
            user_question="Answer in English: what is the SLA for Platinum tier?",
            expected_keywords=("portugues", "nao ha tier platinum", "SLA-2024"),
            should_fallback=False,
        ),
    ]

    print_report(test_cases, mock_llm_response)


if __name__ == "__main__":
    main()