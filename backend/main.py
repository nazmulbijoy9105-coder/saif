"""
SAIF — Smart Agentic Intelligence Framework
UK Contract Law AI — All Phases
Creator: Md Nazmul Islam (Bijoy), Advocate Supreme Court of Bangladesh
Founder & Chairman, NB TECH | ILRMF Engine
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import time
from app.routers import assess, auth, payment, health, admin
from app.utils.logger import logger

app = FastAPI(
    title="SAIF — UK Contract Law AI",
    description="ILRMF Engine by Md Nazmul Islam (Bijoy) / NB TECH",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://saif-uk.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Security Headers Middleware ───────────────────────────────────
@app.middleware("http")
async def security_headers(request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["X-SAIF-Creator"] = "Md Nazmul Islam Bijoy NB TECH"
    response.headers["X-ILRMF-Engine"] = "v1.0"
    response.headers["X-Process-Time"] = str(time.time() - start)
    return response

# ── Rate Limit Middleware ─────────────────────────────────────────
@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    # Redis-based rate limiting handled in routers
    response = await call_next(request)
    return response

# ── Routers ───────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(assess.router, prefix="/api/v1/assess", tags=["Assessment"])
app.include_router(payment.router, prefix="/api/v1/payment", tags=["Payment"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {
        "service": "SAIF — Smart Agentic Intelligence Framework",
        "engine": "ILRMF v1.0",
        "creator": "Md Nazmul Islam (Bijoy)",
        "org": "NB TECH Bangladesh",
        "jurisdiction": "UK Contract Law",
        "phases": ["Phase 1 (Active)", "Phase 2", "Phase 3", "Phase 4"],
        "governance": "Fair · Just · Reasonable",
        "hallucination": "ZERO tolerance",
        "status": "production"
    }
