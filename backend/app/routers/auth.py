"""
Auth Router — JWT + Supabase
Creator: Md Nazmul Islam (Bijoy) | NB TECH
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.db.supabase_client import supabase
from app.utils.logger import logger

router = APIRouter()


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    organisation: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(body: RegisterRequest):
    try:
        result = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {
                    "name": body.name,
                    "organisation": body.organisation,
                    "tier": "free",
                }
            }
        })
        if result.user:
            return {
                "success": True,
                "message": "Registration successful. Check email to verify.",
                "userId": result.user.id,
            }
        raise HTTPException(status_code=400, detail="Registration failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(body: LoginRequest):
    try:
        result = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password,
        })
        if result.user and result.session:
            return {
                "success": True,
                "token": result.session.access_token,
                "refreshToken": result.session.refresh_token,
                "user": {
                    "id": result.user.id,
                    "email": result.user.email,
                    "name": result.user.user_metadata.get("name"),
                    "tier": result.user.user_metadata.get("tier", "free"),
                }
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.post("/logout")
async def logout():
    supabase.auth.sign_out()
    return {"success": True, "message": "Logged out"}


@router.post("/refresh")
async def refresh(refresh_token: str):
    try:
        result = supabase.auth.refresh_session(refresh_token)
        return {
            "success": True,
            "token": result.session.access_token,
            "refreshToken": result.session.refresh_token,
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")
