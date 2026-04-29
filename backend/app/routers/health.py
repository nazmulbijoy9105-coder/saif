"""Health Router"""
from fastapi import APIRouter
router = APIRouter()

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "SAIF UK Contract Law AI",
        "engine": "ILRMF v1.0",
        "creator": "Md Nazmul Islam (Bijoy) | NB TECH",
        "governance": "Fair · Just · Reasonable",
        "hallucination": "ZERO",
        "phases": {
            "1": "active",
            "2": "active",
            "3": "beta",
            "4": "coming_soon"
        }
    }
