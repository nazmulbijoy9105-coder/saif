"""Admin Router"""
from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_current_user
from app.db.supabase_client import supabase

router = APIRouter()

@router.get("/stats")
async def admin_stats(user=Depends(get_current_user)):
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    assessments = supabase.table("assessments").select("id", count="exact").execute()
    users = supabase.table("profiles").select("id", count="exact").execute()
    return {
        "total_assessments": assessments.count,
        "total_users": users.count,
        "engine": "ILRMF v1.0",
        "creator": "Md Nazmul Islam (Bijoy) | NB TECH",
    }
