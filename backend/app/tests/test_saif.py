"""
SAIF — Test Suite
Creator: Md Nazmul Islam (Bijoy) | NB TECH
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    d = r.json()
    assert d["service"] == "SAIF — UK Contract Law AI"
    assert d["engine"] == "ILRMF v1.0"
    assert d["creator"] == "Md Nazmul Islam (Bijoy) | NB TECH"
    assert d["governance"] == "Fair · Just · Reasonable"


def test_root():
    r = client.get("/")
    assert r.status_code == 200
    d = r.json()
    assert d["hallucination"] == "ZERO tolerance"


def test_assess_unauthenticated():
    r = client.post("/api/v1/assess/", json={
        "claimant": "Mr Hartley",
        "defendant": "TechBuild Ltd",
        "narrative": "Dispute over steel supply contract price variation clause",
        "phase": 1
    })
    # Unauthenticated allowed on phase 1
    assert r.status_code in [200, 422]


def test_security_headers():
    r = client.get("/")
    assert "X-Content-Type-Options" in r.headers
    assert "X-Frame-Options" in r.headers
    assert r.headers.get("X-SAIF-Creator") == "Md Nazmul Islam Bijoy NB TECH"
    assert r.headers.get("X-ILRMF-Engine") == "v1.0"


def test_citation_checker():
    from app.validators.citation_checker import CitationChecker
    checker = CitationChecker()
    result = {"issues": [{"law": "Hyde v Wrench [1840] 49 ER 132 and Hadley v Baxendale [1854]"}]}
    v = checker.validate(result, phase=1)
    assert v["passed"] is True
    assert v["hallucination_count"] == 0


def test_fjr_engine():
    from app.ilrmf.fjr_engine import FJREngine
    engine = FJREngine()
    r = engine.assess_clause(
        clause="Price may vary 15% without consent",
        contract_type="B2C",
        bargaining_power_equal=False,
        notice_adequate=False,
        standard_form=True,
        value_of_contract=280000,
        allows_unilateral_variation=True,
        consumer_vulnerable=False,
    )
    assert r.fair is False
    assert r.just is False
    assert r.reasonable is False
    assert "VOID" in r.verdict


def test_fjr_engine_enforceable():
    from app.ilrmf.fjr_engine import FJREngine
    engine = FJREngine()
    r = engine.assess_clause(
        clause="Standard industry limitation clause",
        contract_type="B2B",
        bargaining_power_equal=True,
        notice_adequate=True,
        standard_form=False,
        value_of_contract=100000,
        allows_unilateral_variation=False,
        consumer_vulnerable=False,
    )
    assert r.fair is True
    assert r.just is True
    assert "ENFORCEABLE" in r.verdict
