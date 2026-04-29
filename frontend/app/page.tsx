"use client"
import Link from "next/link"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import { GovernanceBanner } from "@/components/ui/GovernanceBanner"
import { Header } from "@/components/ui/Header"

const PHASES = [
  {
    number: 1, status: "ACTIVE",
    title: "Contract Law Core",
    color: "#00d4aa",
    items: ["Offer & Acceptance", "Battle of Forms", "UCTA 1977", "CRA 2015", "Hadley Damages", "Court Routing"],
    cases: "20 verified cases",
  },
  {
    number: 2, status: "ACTIVE",
    title: "Employment & Service",
    color: "#00d4aa",
    items: ["Employment Contracts", "Service Agreements", "NDA Disputes", "Penalty Clauses Full", "Frustration Doctrine", "Misrepresentation Full"],
    cases: "60 verified cases",
  },
  {
    number: 3, status: "BETA",
    title: "Property & Cross-Border",
    color: "#f39c12",
    items: ["Property Contracts", "Construction Disputes", "IP Licensing", "BD-UK Cross-Border", "NRB Agreements", "Arbitration"],
    cases: "150+ verified cases",
  },
  {
    number: 4, status: "COMING SOON",
    title: "US & Triple Jurisdiction",
    color: "#c9a84c",
    items: ["US Contract Law (UCC)", "US Employment Law", "BD+UK+US Simultaneous", "Bengali Diaspora Cases", "Federal Law", "State Routing"],
    cases: "300+ verified cases",
  },
]

const STATS = [
  { value: "483M", label: "People Served" },
  { value: "ZERO", label: "Hallucination" },
  { value: "FJR", label: "Triple-Gate" },
  { value: "ILRMF", label: "Engine" },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <GovernanceBanner />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#00d4aa", letterSpacing: 3, fontFamily: "monospace", marginBottom: 12 }}>
            SMART AGENTIC INTELLIGENCE FRAMEWORK
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.25, marginBottom: 16 }}>
            UK Contract Law AI<br />
            <span style={{ color: "#00d4aa" }}>Powered by ILRMF</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", maxWidth: 540, margin: "0 auto 28px", lineHeight: 1.8 }}>
            Fair · Just · Reasonable assessment on every clause. Zero hallucination.
            Court-ready output. Created by Md Nazmul Islam (Bijoy) / NB TECH.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/assess" style={{
              padding: "14px 32px", background: "#00d4aa", borderRadius: 8,
              color: "#0a0f1e", fontWeight: 700, fontFamily: "monospace",
              fontSize: 13, letterSpacing: 2, textDecoration: "none",
              boxShadow: "0 0 24px rgba(0,212,170,0.3)"
            }}>
              ⚖ START ASSESSMENT
            </Link>
            <Link href="/pricing" style={{
              padding: "14px 32px", background: "transparent",
              border: "1px solid rgba(0,212,170,0.4)", borderRadius: 8,
              color: "#00d4aa", fontWeight: 700, fontFamily: "monospace",
              fontSize: 13, letterSpacing: 2, textDecoration: "none"
            }}>
              VIEW PLANS
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 48 }}>
          {STATS.map(s => (
            <div key={s.value} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.15)",
              borderRadius: 10, padding: "16px", textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#00d4aa", fontFamily: "monospace" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, fontFamily: "monospace", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Phases */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 20, textAlign: "center" }}>
            ▸ ALL PHASES — FULL ROADMAP
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PHASES.map(p => (
              <div key={p.number} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${p.color}30`,
                borderRadius: 12, padding: "20px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: p.color, fontFamily: "monospace", letterSpacing: 2, marginBottom: 4 }}>
                      PHASE {p.number} — {p.status}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</div>
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${p.color}15`, border: `1px solid ${p.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: p.color, fontFamily: "monospace"
                  }}>
                    {p.number}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
                  {p.items.map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: p.color, fontSize: 10 }}>→</span>
                      <span style={{ fontSize: 12, color: "rgba(240,244,255,0.7)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: p.color, fontFamily: "monospace", letterSpacing: 1 }}>
                  {p.cases}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Footer */}
        <div style={{
          background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 10, padding: "20px", textAlign: "center", marginTop: 40
        }}>
          <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>
            CREATED & GOVERNED BY
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff" }}>
            Md Nazmul Islam (Bijoy)
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            Advocate, Supreme Court of Bangladesh · Founder & Chairman, NB TECH
          </div>
          <div style={{ fontSize: 11, color: "#00d4aa", fontFamily: "monospace", marginTop: 8 }}>
            ILRMF v1.0 — Intelligent Legal Rule Modelling Framework © NB TECH
          </div>
        </div>
      </main>
    </div>
  )
}
