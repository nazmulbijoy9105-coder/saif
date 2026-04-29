"""Auth Utility — JWT + Supabase"""
from fastapi import Request
from app.db.supabase_client import supabase

async def get_current_user(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ")[1]
    try:
        user = supabase.auth.get_user(token)
        if user and user.user:
            u = user.user
            u.tier = u.user_metadata.get("tier", "free")
            u.role = u.user_metadata.get("role", "user")
            return u
    except:
        return None
