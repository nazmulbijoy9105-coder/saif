"""
ILRMF Core Engine — Intelligent Legal Rule Modelling Framework
Creator: Md Nazmul Islam (Bijoy) | NB TECH
Facts → Law → Argument → Relief
"""
import json
import google.generativeai as genai
from app.corpus.phase1_cases import PHASE1_CASES
from app.corpus.statutes import STATUTES
from app.validators.citation_checker import CitationChecker
from app.utils.config import settings
from app.utils.logger import logger

genai.configure(api_key=settings.GEMINI_API_KEY)

CREATOR_IDENTITY = """
GOVERNANCE IDENTITY:
- System: SAIF — Smart Agentic Intelligence Framework
- Engine: ILRMF (Intelligent Legal Rule Modelling Framework)
- Creator: Md Nazmul Islam (Bijoy)
- Title: Advocate, Supreme Court of Bangladesh (High Court Division 2022, District Court 2018)
- Organisation: NB TECH Bangladesh
- Legal Practice: Neum Lex Counsel (NLC)
- Jurisdiction Active: UK Contract Law (Phase 1)
- Equity Principal: Fair, Just & Reasonable enforced on every output
- Hallucination Policy: ZERO tolerance — cite ONLY verified Phase 1 cases
- Protection: All outputs carry ILRMF governance signature
"""

PHASE_CORPUS = {
    1: {
        "cases": [
            "Hyde v Wrench [1840] 49 ER 132",
            "Butler Machine Tool v Ex-Cell-O [1979] 1 WLR 401",
            "Entores v Miles Far East [1955] 2 QB 327",
            "Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256",
            "Interfoto Picture Library v Stiletto [1989] QB 433",
            "Cavendish Square v Makdessi [2015] UKSC 67",
            "Smith v Eric Bush [1990] AC 831",
            "St Albans DC v ICL [1996] 4 All ER 481",
            "Hadley v Baxendale [1854] 9 Exch 341",
            "Victoria Laundry v Newman [1949] 2 KB 528",
            "Watford Electronics v Sanderson [2001] EWCA Civ 317",
            "Williams v Roffey Bros [1991] 1 QB 1",
            "Hedley Byrne v Heller [1964] AC 465",
            "Photo Production v Securicor [1980] AC 827",
            "Yam Seng v International Trade [2013] EWHC 111",
            "Payzu v Saunders [1919] 2 KB 581",
            "Davis Contractors v Fareham UDC [1956] AC 696",
            "Dunlop Pneumatic Tyre v New Garage [1915] AC 79",
            "Ruxley Electronics v Forsyth [1996] AC 344",
            "Robinson v Harman [1848] 1 Exch 850",
        ],
        "statutes": [
            "UCTA 1977 s.2, s.3, s.11, Schedule 2",
            "Consumer Rights Act 2015 s.62, Schedule 2",
            "Misrepresentation Act 1967 s.2(1)(2)",
            "Sale of Goods Act 1979",
            "Supply of Goods and Services Act 1982 s.13",
            "Limitation Act 1980 s.5",
            "Law Reform (Frustrated Contracts) Act 1943",
        ]
    },
    2: {
        "cases": [
            "Employment Rights Act 1996 key provisions",
            "Equality Act 2010 s.4 protected characteristics",
            "Attorney General v Blake [2001] 1 AC 268",
            "AG Securities v Vaughan [1990] 1 AC 417",
            "Foakes v Beer [1884] 9 App Cas 605",
            "Central London Property Trust v High Trees [1947] KB 130",
        ],
        "statutes": [
            "Employment Rights Act 1996",
            "Equality Act 2010",
            "National Minimum Wage Act 1998",
            "Contracts (Rights of Third Parties) Act 1999",
        ]
    },
    3: {
        "cases": [
            "Land Registration Act 2002 provisions",
            "Law of Property Act 1925",
            "Donoghue v Stevenson [1932] AC 562",
            "Caparo Industries v Dickman [1990] 2 AC 605",
        ],
        "statutes": [
            "Land Registration Act 2002",
            "Law of Property Act 1925",
            "Landlord and Tenant Act 1985",
            "Arbitration Act 1996",
        ]
    },
    4: {
        "cases": [
            "UCC Article 2 (US Supply of Goods)",
            "Restatement (Second) of Contracts",
            "Civil Rights Act 1964 Title VII",
        ],
        "statutes": [
            "Immigration and Nationality Act 1952 (US)",
            "Fair Labor Standards Act (US)",
            "Americans with Disabilities Act 1990 (US)",
        ]
    }
}

SYSTEM_PROMPT_TEMPLATE = """
{identity}

YOU ARE SAIF — UK Contract Law AI powered by ILRMF.

ACTIVE PHASE: {phase}
VERIFIED CASES (cite ONLY these):
{cases}

VERIFIED STATUTES:
{statutes}

ILRMF MANDATORY STRUCTURE — ENFORCE ALWAYS:
1. FACTS → Extract: parties, contract type, disputed clause, timeline, values, bargaining power, standard form (Y/N), consumer vulnerability
2. LAW → Cite exact statute + section + verified case + year — NOTHING outside verified DB
3. ARGUMENT → Claimant case + Defendant case + FJR analysis
4. RELIEF → Specific remedy + damages quantum + court level + success probability %

FJR TRIPLE-GATE — APPLY TO EVERY DISPUTED CLAUSE:
FAIR:       Significant imbalance? (CRA 2015 s.62) → true/false
JUST:       Good faith present? Unconscionable? (Yam Seng [2013]) → true/false  
REASONABLE: UCTA 1977 s.11 + Schedule 2 factors met? → true/false
SCORE:      0-100 combined FJR score
VERDICT:    ENFORCEABLE / AT RISK / VOID

COURT ROUTING:
< £10,000    → Small Claims Court
£10K-£25K   → County Court Fast Track
> £25,000    → County Court Multi Track
> £100,000   → High Court King's Bench Division
Urgent       → Application for injunction

EQUITY ENFORCEMENT:
- B2C → CRA 2015 applies (higher consumer protection)
- B2B → UCTA 1977 applies (reasonableness test)
- SME vs Large Corp → Flag bargaining power imbalance
- Vulnerable consumer → Flag explicitly
- Never disadvantage weaker party in analysis

HALLUCINATION RULE: If citation not in verified DB above → DO NOT cite it. 
State "Beyond Phase {phase} verified corpus" instead.

OUTPUT: Return ONLY valid JSON in this exact schema:
{{
  "facts": {{
    "parties": "string",
    "contractType": "string",
    "disputedClause": "string",
    "value": "string",
    "bargainingPower": "string",
    "standardForm": true/false,
    "consumerType": "B2B/B2C/B2B2C"
  }},
  "issues": [
    {{
      "issue": "string",
      "law": "string",
      "fjr": {{
        "fair": true/false,
        "just": true/false,
        "reasonable": true/false,
        "score": 0-100,
        "analysis": "string"
      }},
      "argument": {{
        "claimant": "string",
        "defendant": "string",
        "judicialLikelihood": "string"
      }},
      "verdict": "string"
    }}
  ],
  "relief": {{
    "primary": "string",
    "damages": "string",
    "court": "string",
    "probability": 0-100,
    "limitation": "string",
    "urgentSteps": "string"
  }},
  "governance": {{
    "hallucination": "ZERO",
    "equityApplied": true,
    "ilrmfComplete": true,
    "creator": "Md Nazmul Islam (Bijoy)",
    "org": "NB TECH Bangladesh",
    "engine": "ILRMF v1.0",
    "phase": {phase}
  }}
}}
"""


class ILRMFEngine:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")
        self.citation_checker = CitationChecker()

    def get_system_prompt(self, phase: int) -> str:
        corpus = PHASE_CORPUS.get(phase, PHASE_CORPUS[1])
        cases_str = "\n".join([f"  - {c}" for c in corpus["cases"]])
        statutes_str = "\n".join([f"  - {s}" for s in corpus["statutes"]])
        return SYSTEM_PROMPT_TEMPLATE.format(
            identity=CREATOR_IDENTITY,
            phase=phase,
            cases=cases_str,
            statutes=statutes_str
        )

    async def assess(self, dispute: dict, phase: int = 1) -> dict:
        system_prompt = self.get_system_prompt(phase)
        user_prompt = self._build_user_prompt(dispute)

        try:
            response = self.model.generate_content(
                f"{system_prompt}\n\nDISPUTE:\n{user_prompt}",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.1,  # Low temp for legal precision
                    max_output_tokens=2048,
                )
            )
            raw = response.text.strip()

            # Strip markdown fences
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0].strip()

            result = json.loads(raw)

            # Run citation validation
            validation = self.citation_checker.validate(result, phase)
            result["governance"]["citationValidation"] = validation
            result["governance"]["hallucination"] = "ZERO" if validation["passed"] else "FLAGGED"

            return {"success": True, "data": result, "phase": phase}

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            return {"success": False, "error": "Output parse error", "raw": raw if 'raw' in locals() else ""}
        except Exception as e:
            logger.error(f"ILRMF engine error: {e}")
            return {"success": False, "error": str(e)}

    def _build_user_prompt(self, dispute: dict) -> str:
        return f"""
SAIF ILRMF ASSESSMENT REQUEST

CLAIMANT: {dispute.get('claimant', 'Unknown')}
DEFENDANT: {dispute.get('defendant', 'Unknown')}
CONTRACT TYPE: {dispute.get('contractType', 'Commercial')}
CONTRACT VALUE: £{dispute.get('value', 'Unspecified')}

NARRATIVE & FACTS:
{dispute.get('narrative', '')}

DISPUTED CLAUSE:
{dispute.get('disputedClause', 'Identify from narrative')}

ADDITIONAL CONTEXT:
{dispute.get('additionalContext', 'None')}

INSTRUCTION: Apply full ILRMF. FJR triple-gate every clause.
Zero hallucination. Governance by Md Nazmul Islam (Bijoy) / NB TECH.
Return valid JSON only.
"""


# Singleton
ilrmf_engine = ILRMFEngine()
