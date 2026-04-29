"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/ui/Header"
import { GovernanceBanner } from "@/components/ui/GovernanceBanner"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import { ILRMFLoadingScreen } from "@/components/ilrmf/LoadingScreen"
import toast from "react-hot-toast"
import axios from "axios"

const CONTRACT_TYPES = ["B2B", "B2C", "Standard Form Contract", "Service Agreement", "Supply Contract", "NDA", "Employment Contract", "Construction Contract"]

const PHASES = [
  { n: 1, label: "Phase 1 — Contract Core", tier: "free" },
  { n: 2, label: "Phase 2 — Employment & Service", tier: "pro" },
  { n: 3, label: "Phase 3 — Property & Cross-Border", tier: "pro" },
  { n: 4, label: "Phase 4 — US & Triple Jurisdiction", tier: "enterprise" },
]

export default function AssessPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    claimant: "", defendant: "",
    contractType: "B2B", value: "",
    narrative: "", disputedClause: "",
    additionalContext: "", phase: 1
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.claimant || !form.defendant || form.narrative.length < 20) {
      toast.error("Fill all required fields")
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem("saif_token") || ""
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/assess/`,
        form,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      if (data.success) {
        localStorage.setItem("saif_result", JSON.stringify(data))
        router.push("/result")
      } else {
        toast.error(data.error || "Assessment failed")
        setLoading(false)
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Server error")
      setLoading(false)
    }
  }

  if (loading) return <ILRMFLoadingScreen />

  const label = { fontSize: 10, color: "#00d4aa", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6, display: "block" }
  const section = {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.2)",
    borderRadius: 12, padding: "20px 22px", marginBottom: 16
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <GovernanceBanner />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: "#00d4aa", letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>
            ILRMF ENGINE — DISPUTE ASSESSMENT
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>UK Contract Law Assessment</h1>
        </div>

        {/* Phase Selector */}
        <div style={section}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ SELECT PHASE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PHASES.map(p => (
              <button key={p.n} onClick={() => set("phase", p.n)} style={{
                padding: "12px 14px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                background: form.phase === p.n ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${form.phase === p.n ? "#00d4aa" : "rgba(255,255,255,0.08)"}`,
                color: form.phase === p.n ? "#00d4aa" : "rgba(240,244,255,0.6)",
                fontFamily: "monospace", fontSize: 12, transition: "all 0.2s"
              }}>
                {p.label}
                {p.tier !== "free" && <span style={{ fontSize: 9, marginLeft: 8, color: "#c9a84c" }}>[{p.tier.toUpperCase()}]</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Parties */}
        <div style={section}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ PARTIES & CONTRACT</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={label}>CLAIMANT (PARTY A) *</label>
              <input value={form.claimant} onChange={e => set("claimant", e.target.value)} placeholder="Mr. James Hartley, SME Builder..." />
            </div>
            <div>
              <label style={label}>DEFENDANT (PARTY B) *</label>
              <input value={form.defendant} onChange={e => set("defendant", e.target.value)} placeholder="TechBuild Supplies Ltd..." />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={label}>CONTRACT TYPE</label>
              <select value={form.contractType} onChange={e => set("contractType", e.target.value)}>
                {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>CONTRACT VALUE (£)</label>
              <input value={form.value} onChange={e => set("value", e.target.value)} placeholder="280000" type="number" />
            </div>
          </div>
        </div>

        {/* Narrative */}
        <div style={section}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ DISPUTE NARRATIVE *</div>
          <label style={label}>FULL FACTS, TIMELINE, NEGOTIATIONS & DISPUTE</label>
          <textarea
            value={form.narrative} onChange={e => set("narrative", e.target.value)}
            placeholder="Day 1 — Defendant sends catalogue at £560/tonne. Day 3 — Claimant emails offer 500 tonnes. Day 4 — Counter-offer 600 tonnes minimum. Day 5 — Counter-counter-offer 500 tonnes £540. Day 6 — Defendant confirms but attaches T&Cs with Clause 14.3 price variation..."
            rows={6} style={{ resize: "vertical" }}
          />
        </div>

        {/* Disputed Clause */}
        <div style={section}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ DISPUTED CLAUSE & ADDITIONAL CONTEXT</div>
          <label style={label}>DISPUTED CLAUSE TEXT (if specific)</label>
          <textarea value={form.disputedClause} onChange={e => set("disputedClause", e.target.value)}
            placeholder="Clause 14.3: Price may be revised upward up to 15% due to market fluctuation without consent..." rows={3} />
          <div style={{ marginTop: 12 }}>
            <label style={label}>ADDITIONAL CONTEXT</label>
            <input value={form.additionalContext} onChange={e => set("additionalContext", e.target.value)}
              placeholder="Sub-contracts placed, reliance losses, prior dealings..." />
          </div>
        </div>

        {/* Security Notice */}
        <div style={{
          background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔐</span>
          <div>
            <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 1, marginBottom: 3 }}>GOVERNANCE & SECURITY</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              All assessments governed by ILRMF — proprietary framework of Md Nazmul Islam (Bijoy),
              Advocate, Supreme Court of Bangladesh / NB TECH. Zero hallucination enforced.
              FJR equity principals applied. Not a substitute for qualified legal advice.
            </div>
          </div>
        </div>

        <button onClick={submit} style={{
          width: "100%", padding: "16px", background: "#00d4aa", border: "none",
          borderRadius: 10, color: "#0a0f1e", fontSize: 14, fontWeight: 700,
          letterSpacing: 2, fontFamily: "monospace", cursor: "pointer",
          boxShadow: "0 0 24px rgba(0,212,170,0.3)", textTransform: "uppercase"
        }}>
          ⚖ Run ILRMF Assessment — Phase {form.phase}
        </button>
      </div>
    </div>
  )
}
