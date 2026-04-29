"""
Payment Router — Stripe (UK Market)
Tiers: Free / Basic £9.99 / Pro £29.99 / Enterprise £99.99
Creator: Md Nazmul Islam (Bijoy) | NB TECH
"""
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import stripe
from app.utils.config import settings
from app.db.supabase_client import supabase
from app.utils.auth import get_current_user

router = APIRouter()
stripe.api_key = settings.STRIPE_SECRET_KEY

PLANS = {
    "basic": {
        "price_id": settings.STRIPE_BASIC_PRICE_ID,
        "name": "SAIF Basic",
        "price": "£9.99/month",
        "phase_access": 1,
        "features": ["Phase 1 — Contract Law", "10 assessments/month", "PDF export", "Email support"],
    },
    "pro": {
        "price_id": settings.STRIPE_PRO_PRICE_ID,
        "name": "SAIF Pro",
        "price": "£29.99/month",
        "phase_access": 2,
        "features": ["Phase 1+2 — Contract + Employment", "Unlimited assessments", "PDF export", "Priority support"],
    },
    "enterprise": {
        "price_id": settings.STRIPE_ENTERPRISE_PRICE_ID,
        "name": "SAIF Enterprise",
        "price": "£99.99/month",
        "phase_access": 4,
        "features": ["All Phases 1-4", "BD+UK+US jurisdiction", "API access", "Custom corpus", "Dedicated support"],
    },
}


class CheckoutRequest(BaseModel):
    plan: str
    success_url: str = "https://saif-uk.vercel.app/dashboard?success=true"
    cancel_url: str = "https://saif-uk.vercel.app/pricing?cancelled=true"


@router.get("/plans")
async def get_plans():
    return {"success": True, "plans": PLANS}


@router.post("/checkout")
async def create_checkout(body: CheckoutRequest, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    if body.plan not in PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            customer_email=user.email,
            line_items=[{"price": PLANS[body.plan]["price_id"], "quantity": 1}],
            success_url=body.success_url,
            cancel_url=body.cancel_url,
            metadata={"user_id": user.id, "plan": body.plan},
        )
        return {"success": True, "checkoutUrl": session.url, "sessionId": session.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Webhook signature invalid")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session["metadata"]["user_id"]
        plan = session["metadata"]["plan"]

        # Update user tier in Supabase
        supabase.table("profiles").update(
            {"tier": plan, "stripe_customer_id": session.get("customer")}
        ).eq("id", user_id).execute()

    elif event["type"] == "customer.subscription.deleted":
        customer_id = event["data"]["object"]["customer"]
        supabase.table("profiles").update(
            {"tier": "free"}
        ).eq("stripe_customer_id", customer_id).execute()

    return {"received": True}
