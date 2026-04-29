# SAIF — Smart Agentic Intelligence Framework
## UK Contract Law AI | All Phases 1-4 | ILRMF Engine

> **Creator:** Md Nazmul Islam (Bijoy)  
> **Title:** Advocate, Supreme Court of Bangladesh (High Court Division 2022)  
> **Organisation:** NB TECH Bangladesh  
> **Engine:** ILRMF — Intelligent Legal Rule Modelling Framework v1.0  
> **Governance:** Fair · Just · Reasonable · Zero Hallucination · Equity Enforced

---

## Architecture

```
saif/
├── backend/          FastAPI + Gemini + Supabase + Stripe → Render
├── frontend/         Next.js 15 + TypeScript + Tailwind → Vercel
├── .github/
│   └── workflows/
│       └── deploy.yml   CI/CD → Render + Vercel
```

---

## Phases

| Phase | Scope | Status | Cases |
|-------|-------|--------|-------|
| 1 | Contract Core — Offer/Acceptance, UCTA, FJR | ✅ Active | 20 verified |
| 2 | Employment & Service Agreements | ✅ Active | 60 verified |
| 3 | Property & BD-UK Cross-Border | 🔶 Beta | 150+ |
| 4 | US & Triple Jurisdiction BD+UK+US | 🔜 Coming | 300+ |

---

## Quick Deploy

### 1. Clone & Setup

```bash
git clone https://github.com/nazmulbijoy9105-coder/saif-uk.git
cd saif-uk
```

### 2. Backend (Render)

```bash
cd backend
cp .env.example .env
# Fill in all env vars in .env

# Test locally
pip install -r requirements.txt
uvicorn main:app --reload
```

**Deploy to Render:**
1. New Web Service → Connect GitHub repo
2. Root directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all env vars from `.env.example`

### 3. Supabase Setup

```bash
# In Supabase dashboard → SQL Editor → Run:
# backend/schema.sql
```

### 4. Frontend (Vercel)

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your Render backend URL

bun install
bun run build
```

**Deploy to Vercel:**
1. Import from GitHub
2. Root directory: `frontend`
3. Framework: Next.js
4. Add env vars from `.env.example`
5. Deploy

### 5. GitHub Secrets (for CI/CD)

```
RENDER_API_KEY          → Render dashboard → Account → API Keys
RENDER_SERVICE_ID       → Render service URL contains the ID
VERCEL_TOKEN            → Vercel → Settings → Tokens
VERCEL_ORG_ID           → vercel.json or Vercel dashboard
VERCEL_PROJECT_ID       → Vercel project settings
```

---

## Environment Variables

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| GEMINI_API_KEY | ✅ | Google AI Studio — free tier |
| SUPABASE_URL | ✅ | Supabase project URL |
| SUPABASE_KEY | ✅ | Supabase anon key |
| STRIPE_SECRET_KEY | ✅ | Stripe secret (UK) |
| STRIPE_WEBHOOK_SECRET | ✅ | Stripe webhook endpoint secret |
| UPSTASH_REDIS_URL | Optional | Rate limiting |
| UPSTASH_REDIS_TOKEN | Optional | Rate limiting |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | ✅ | Backend Render URL |
| NEXT_PUBLIC_SUPABASE_URL | ✅ | Supabase URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | Supabase anon key |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ✅ | Stripe publishable key |

---

## ILRMF Engine

**Intelligent Legal Rule Modelling Framework**

```
Facts → Law → Argument → Relief
```

- **ZERO hallucination** — verified cases DB only
- **FJR Triple-Gate** — Fair · Just · Reasonable on every clause
- **Equity enforced** — weaker party always protected
- **Court routing** — Small Claims / Fast Track / Multi Track / High Court

---

## Security

- All HTTP headers set (X-Frame-Options DENY, XSS-Protection, HSTS)
- JWT auth via Supabase
- RLS policies on all tables
- Rate limiting via Upstash Redis
- Identity stamp: `Md Nazmul Islam (Bijoy) / NB TECH` in every layer

---

## License

© NB TECH Bangladesh. All Rights Reserved.  
ILRMF is a proprietary framework of Md Nazmul Islam (Bijoy) / NB TECH Bangladesh.

---

*Fair · Just · Reasonable · Zero Hallucination · Equity Enforced*
# saif
