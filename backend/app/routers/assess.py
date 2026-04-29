"""
Assessment Router — SAIF ILRMF Engine
Creator: Md Nazmul Islam (Bijoy) | NB TECH
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional
from app.ilrmf.engine import ilrmf_engine
from app.db.supabase_client import supabase
from app.utils.rate_limiter import check_rate_limit
from app.utils.auth import get_current_user
from app.utils.logger import logger

router = APIRouter()


class DisputeRequest(BaseModel):
    claimant: str = Field(..., min_length=2, max_length=200)
    defendant: str = Field(..., min_length=2, max_length=200)
    contractType: str = Field(default="B2B")
    value: Optional[str] = None
    narrative: str = Field(..., min_length=20, max_length=5000)
    disputedClause: Optional[str] = Field(default="", max_length=2000)
    additionalContext: Optional[str] = Field(default="", max_length=1000)
    phase: int = Field(default=1, ge=1, le=4)


class DisputeResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    assessmentId: Optional[str] = None
    phase: int = 1
    governance: dict = {
        "creator": "Md Nazmul Islam (Bijoy)",
        "org": "NB TECH Bangladesh",
        "engine": "ILRMF v1.0",
        "hallucination": "ZERO",
        "equity": "Fair · Just · Reasonable",
    }


@router.post("/", response_model=DisputeResponse)
async def run_assessment(
    request: Request,
    body: DisputeRequest,
    user=Depends(get_current_user),
):
    # Rate limiting
    await check_rate_limit(request, user.id if user else "anonymous")

    # Phase access check
    user_tier = user.tier if user else "free"
    phase_access = {"free": 1, "basic": 1, "pro": 2, "enterprise": 4}
    max_phase = phase_access.get(user_tier, 1)

    if body.phase > max_phase:
        raise HTTPException(
            status_code=403,
            detail=f"Phase {body.phase} requires upgrade. Your tier: {user_tier}"
        )

    logger.info(f"ILRMF assessment: {body.claimant} v {body.defendant} | Phase {body.phase}")

    result = await ilrmf_engine.assess(body.dict(), phase=body.phase)

    # Save to Supabase
    assessment_id = None
    if user and result.get("success"):
        try:
            saved = supabase.table("assessments").insert({
                "user_id": user.id,
                "claimant": body.claimant,
                "defendant": body.defendant,
                "contract_type": body.contractType,
                "value": body.value,
                "phase": body.phase,
                "result": result.get("data"),
                "narrative_summary": body.narrative[:200],
            }).execute()
            assessment_id = saved.data[0]["id"] if saved.data else None
        except Exception as e:
            logger.warning(f"Supabase save failed: {e}")

    return DisputeResponse(
        success=result.get("success", False),
        data=result.get("data"),
        error=result.get("error"),
        assessmentId=assessment_id,
        phase=body.phase,
    )


@router.get("/history")
async def get_history(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        data = supabase.table("assessments")\
            .select("id, claimant, defendant, contract_type, phase, created_at")\
            .eq("user_id", user.id)\
            .order("created_at", desc=True)\
            .limit(20)\
            .execute()
        return {"success": True, "data": data.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{assessment_id}")
async def get_assessment(assessment_id: str, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        data = supabase.table("assessments")\
            .select("*")\
            .eq("id", assessment_id)\
            .eq("user_id", user.id)\
            .single()\
            .execute()
        return {"success": True, "data": data.data}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Assessment not found")
