"""
Citation Validator — Zero Hallucination Enforcement
ILRMF Ground Truth Database — Phase 1-4
Creator: Md Nazmul Islam (Bijoy) | NB TECH
"""
import re
from typing import Any

VERIFIED_CASES = {
    1: [
        "Hyde v Wrench",
        "Butler Machine Tool",
        "Ex-Cell-O",
        "Entores v Miles",
        "Carlill v Carbolic",
        "Interfoto",
        "Stiletto",
        "Cavendish Square",
        "Makdessi",
        "Smith v Eric Bush",
        "St Albans",
        "Hadley v Baxendale",
        "Victoria Laundry",
        "Newman",
        "Watford Electronics",
        "Sanderson",
        "Williams v Roffey",
        "Hedley Byrne",
        "Heller",
        "Photo Production",
        "Securicor",
        "Yam Seng",
        "Payzu v Saunders",
        "Davis Contractors",
        "Fareham",
        "Dunlop",
        "New Garage",
        "Ruxley Electronics",
        "Forsyth",
        "Robinson v Harman",
        "Adams v Lindsell",
    ],
    2: [
        "AG Securities",
        "Vaughan",
        "Foakes v Beer",
        "Central London Property",
        "High Trees",
        "Attorney General v Blake",
    ],
    3: [
        "Donoghue v Stevenson",
        "Caparo Industries",
        "Dickman",
    ],
    4: [],
}

VERIFIED_STATUTES = {
    1: [
        "UCTA 1977", "Unfair Contract Terms Act",
        "Consumer Rights Act 2015", "CRA 2015",
        "Misrepresentation Act 1967",
        "Sale of Goods Act 1979",
        "Supply of Goods and Services Act 1982",
        "Limitation Act 1980",
        "Law Reform (Frustrated Contracts) Act 1943",
        "Senior Courts Act 1981",
        "Law of Property Act",
    ],
    2: [
        "Employment Rights Act 1996",
        "Equality Act 2010",
        "National Minimum Wage Act 1998",
        "Contracts (Rights of Third Parties) Act 1999",
    ],
    3: [
        "Land Registration Act 2002",
        "Landlord and Tenant Act 1985",
        "Arbitration Act 1996",
    ],
    4: [
        "Immigration and Nationality Act",
        "Fair Labor Standards Act",
        "Americans with Disabilities Act",
        "Civil Rights Act 1964",
    ],
}


class CitationChecker:
    def validate(self, result: dict, phase: int) -> dict:
        """
        Cross-check all citations in ILRMF output against verified DB.
        Returns validation report.
        """
        all_verified_cases = []
        all_verified_statutes = []
        for p in range(1, phase + 1):
            all_verified_cases.extend(VERIFIED_CASES.get(p, []))
            all_verified_statutes.extend(VERIFIED_STATUTES.get(p, []))

        result_text = str(result)
        flagged = []
        passed = []

        # Extract case-like patterns
        case_pattern = re.findall(r'([A-Z][a-zA-Z\s]+v\s+[A-Z][a-zA-Z\s]+(?:\[\d{4}\])?)', result_text)
        for case in case_pattern:
            verified = any(vc.lower() in case.lower() for vc in all_verified_cases)
            if verified:
                passed.append(case.strip())
            else:
                # Check if it looks like a real citation pattern
                if len(case.strip()) > 5:
                    flagged.append(case.strip())

        return {
            "passed": len(flagged) == 0,
            "verified_citations": list(set(passed)),
            "flagged_citations": list(set(flagged)),
            "hallucination_count": len(set(flagged)),
            "governance": "Md Nazmul Islam (Bijoy) / NB TECH / ILRMF v1.0",
        }
