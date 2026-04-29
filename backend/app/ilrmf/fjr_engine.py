"""
FJR Triple-Gate Scoring Engine
Fair · Just · Reasonable
Creator: Md Nazmul Islam (Bijoy) | NB TECH | ILRMF
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class FJRResult:
    fair: bool
    just: bool
    reasonable: bool
    score: int
    verdict: str
    analysis: str
    ucta_factors: dict
    cra_factors: dict


UCTA_SCHEDULE2_FACTORS = [
    "bargaining_strength_equal",
    "inducement_to_accept",
    "knowledge_of_term",
    "compliance_with_special_order",
    "custom_of_trade_aligned",
]

CRA_SCHEDULE2_GREY_LIST = [
    "excludes_liability_death_injury",
    "limits_remedies",
    "binding_consumer_not_supplier",
    "allows_unilateral_price_variation",
    "allows_unilateral_term_change",
    "automatic_renewal_without_notice",
    "excessive_cancellation_charges",
]


class FJREngine:
    """
    FJR Triple-Gate Assessment Engine.
    Enforces Fair, Just & Reasonable on every clause.
    Equity: weaker party always protected.
    """

    def assess_clause(
        self,
        clause: str,
        contract_type: str,  # B2B / B2C
        bargaining_power_equal: bool,
        notice_adequate: bool,
        standard_form: bool,
        value_of_contract: float,
        cap_value: Optional[float] = None,
        allows_unilateral_variation: bool = False,
        consumer_vulnerable: bool = False,
    ) -> FJRResult:

        # ── FAIR ───────────────────────────────────────────────
        fair_score = 0
        fair_factors = []

        if bargaining_power_equal:
            fair_score += 30
            fair_factors.append("Bargaining power equal ✓")
        else:
            fair_factors.append("Bargaining power unequal ✗")

        if notice_adequate:
            fair_score += 25
            fair_factors.append("Adequate notice of term ✓")
        else:
            fair_factors.append("Inadequate notice (Interfoto rule) ✗")

        if not allows_unilateral_variation:
            fair_score += 25
            fair_factors.append("No unilateral variation ✓")
        else:
            fair_factors.append("Unilateral variation clause ✗ (CRA 2015 Sch.2)")

        if not consumer_vulnerable:
            fair_score += 20
        else:
            fair_factors.append("Consumer vulnerability identified ✗")

        fair = fair_score >= 60

        # ── JUST ───────────────────────────────────────────────
        just_score = 0
        just_factors = []

        if bargaining_power_equal:
            just_score += 33
            just_factors.append("Good faith presumed (equal power) ✓")
        else:
            just_factors.append("Good faith doubtful (power imbalance) ✗")

        if not allows_unilateral_variation:
            just_score += 34
            just_factors.append("Honest performance maintained ✓")
        else:
            just_factors.append("Unilateral variation = bad faith (Yam Seng) ✗")

        if not standard_form or notice_adequate:
            just_score += 33
            just_factors.append("Transparency maintained ✓")
        else:
            just_factors.append("Standard form without negotiation ✗")

        just = just_score >= 60

        # ── REASONABLE ─────────────────────────────────────────
        reasonable_score = 0
        ucta_factors = {}
        cra_factors = {}

        if contract_type == "B2C":
            # CRA 2015 applies
            if not allows_unilateral_variation:
                reasonable_score += 40
                cra_factors["no_unilateral_price"] = True
            else:
                cra_factors["no_unilateral_price"] = False

            if notice_adequate:
                reasonable_score += 30
                cra_factors["transparent"] = True
            else:
                cra_factors["transparent"] = False

            if bargaining_power_equal:
                reasonable_score += 30
                cra_factors["balanced"] = True
            else:
                cra_factors["balanced"] = False

        else:
            # B2B — UCTA 1977 Schedule 2
            ucta_factors["bargaining_strength_equal"] = bargaining_power_equal
            ucta_factors["adequate_notice"] = notice_adequate
            ucta_factors["not_standard_form"] = not standard_form
            ucta_factors["no_unilateral_variation"] = not allows_unilateral_variation

            passing = sum(1 for v in ucta_factors.values() if v)
            reasonable_score = int((passing / len(ucta_factors)) * 100)

            # Cap proportionality check (St Albans test)
            if cap_value and value_of_contract:
                cap_ratio = cap_value / value_of_contract
                if cap_ratio < 0.1:  # Cap less than 10% of contract value
                    reasonable_score = min(reasonable_score, 20)
                    ucta_factors["cap_proportionate"] = False
                else:
                    ucta_factors["cap_proportionate"] = True

        reasonable = reasonable_score >= 60

        # ── COMBINED SCORE ─────────────────────────────────────
        combined = int((fair_score + just_score + reasonable_score) / 3)

        # ── VERDICT ────────────────────────────────────────────
        if fair and just and reasonable:
            verdict = "TERM ENFORCEABLE"
        elif not fair and not just and not reasonable:
            verdict = "TERM VOID — fails all FJR gates"
        elif sum([fair, just, reasonable]) == 2:
            verdict = "TERM AT RISK — partial FJR failure"
        else:
            verdict = "TERM LIKELY VOID — majority FJR failure"

        analysis = (
            f"FAIR ({fair_score}/100): {'; '.join(fair_factors[:2])} | "
            f"JUST ({just_score}/100): {'; '.join(just_factors[:2])} | "
            f"REASONABLE ({reasonable_score}/100): UCTA/CRA analysis complete"
        )

        return FJRResult(
            fair=fair,
            just=just,
            reasonable=reasonable,
            score=combined,
            verdict=verdict,
            analysis=analysis,
            ucta_factors=ucta_factors,
            cra_factors=cra_factors,
        )


fjr_engine = FJREngine()
