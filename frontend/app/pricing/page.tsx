"use client"
import Link from "next/link"
import { Header } from "@/components/ui/Header"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import { GovernanceBanner } from "@/components/ui/GovernanceBanner"

const PLANS = [
  {
    id: "free", name: "Free", price: "£0", period: "/forever",
    color: "#00d4aa", phase: "Phase 1",
    features: ["Phase 1 Contract Law", "3 assessments/month", "FJR Triple-Gate", "Zero Hallucination", "Basic court routing"],
    cta: "Start Free", href: "/assess"
  },
  {
    id: "basic", name: "Basic", price: "£9.99", period: "/month",
    color: "#00d4aa", phase: "Phase 1", popular: true,
    features: ["Phase 1 Contract Law", "10 assessments/month", "PDF export", "Full FJR analysis", "Priority routing", "Email support"],
    cta: "Start Basic", href: "/auth/register?plan=basic"
  },
  {
    id: "pro", name: "Pro", price: "£29.99", period: "/month",
    color: "#c9a84c", phase: "Phase 1-2",
    features: ["Phase 1+2 (Employment+Service)", "Unlimited assessments", "PDF export", "Full ILRMF reports", "Priority support", "Assessment history"],
    cta: "Start Pro", href: "/auth/register?plan=pro"
  },
  {
    id: "enterprise", name: "Enterprise", price: "£99.99", period: "/month",
    color: "#c9a84c", phase: "Phase 1-4",
    features: ["All Phases 1-4", "BD+UK+US jurisdiction", "Unlimited assessments", "API access", "Custom corpus", "Dedicated support", "White-label option"],
    cta: "Contact Us", href: "/auth/register?plan=enterprise"
  },
]

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <GovernanceBanner />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 16px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: "#00d4aa", letterSpacing: 3, fontFamily: "monospace", marginBottom: 10 }}>SAIF — PRICING</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Choose Your Plan</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Access ILRMF-powered UK contract law AI. Fair · Just · Reasonable. All plans include zero hallucination enforcement.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {PLANS.map(p => (
            <div key={p.id} style={{
              background: p.popular ? "rgba(0,212,170,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${p.popular ? p.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, padding: "22px 18px", position: "relative",
              display: "flex", flexDirection: "column"
            }}>
              {p.popular && (
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  background: "#00d4aa", color: "#0a0f1e", fontSize: 9, fontWeight: 700,
                  fontFamily: "monospace", letterSpacing: 1, padding: "3px 10px", borderRadius: 10
                }}>POPULAR</div>
              )}
              <div style={{ fontSize: 10, color: p.color, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>
                {p.phase}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: p.color, fontFamily: "monospace" }}>{p.price}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.period}</span>
              </div>
              <div style={{ flex: 1, marginBottom: 20 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                    <span style={{ color: p.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 11, color: "rgba(240,244,255,0.7)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href={p.href} style={{
                display: "block", textAlign: "center", padding: "10px",
                background: p.popular ? p.color : "transparent",
                border: `1px solid ${p.color}`,
                borderRadius: 7, color: p.popular ? "#0a0f1e" : p.color,
                fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: 1, textDecoration: "none"
              }}>{p.cta}</Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          All plans governed by ILRMF — Md Nazmul Islam (Bijoy) / NB TECH Bangladesh
        </div>
      </div>
    </div>
  )
}
