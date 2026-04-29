"""Rate Limiter — Upstash Redis"""
from fastapi import HTTPException, Request
import httpx
from app.utils.config import settings

async def check_rate_limit(request: Request, user_id: str):
    if not settings.UPSTASH_REDIS_URL:
        return  # Skip if not configured
    key = f"saif:ratelimit:{user_id}"
    try:
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{settings.UPSTASH_REDIS_URL}/pipeline",
                headers={"Authorization": f"Bearer {settings.UPSTASH_REDIS_TOKEN}"},
                json=[
                    ["INCR", key],
                    ["EXPIRE", key, 3600]
                ]
            )
            data = r.json()
            count = data[0][1] if data else 0
            if count > 50:  # 50 requests/hour free tier
                raise HTTPException(status_code=429, detail="Rate limit exceeded. Upgrade for more.")
    except HTTPException:
        raise
    except:
        pass  # Fail open — don't block users if Redis is down
