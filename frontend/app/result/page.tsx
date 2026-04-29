"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/ui/Header"
import { GovernanceBanner } from "@/components/ui/GovernanceBanner"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import { FJRCard } from "@/components/ilrmf/FJRCard"
import { ProbabilityMeter } from "@/components/ilrmf/ProbabilityMeter"
import { GovernanceSeal } from "@/components/ilrmf/GovernanceSeal"
import { exportPDF } from "@/lib/pdf-export"

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const raw = localStorage.getItem("saif_result")
    if (!raw) { router.push("/assess"); return }
    setResult(JSON.parse(raw))
  }, [])

  if (!result) return null

  const d = result.data
  const facts = d?.facts || {}
  const issues = d?.issues || []
  const relief = d?.relief || {}
  const gov = d?.governance || {}

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <GovernanceBanner />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 2, marginBottom: 6 }}>
              ILRMF ASSESSMENT COMPLETE ✓ — PHASE {result.phase}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Contract Dispute Analysis</h1>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
              {facts.parties || "Parties extracted from narrative"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
            <button onClick={() => exportPDF(d)} style={{
              padding: "8px 14px", background: "transparent",
              border: "1px solid #c9a84c", borderRadius: 6,
              color: "#c9a84c", fontFamily: "monospace", fontSize: 11,
              cursor: "pointer", letterSpacing: 1
            }}>⬇ PDF</button>
            <Link href="/assess" style={{
              padding: "8px 14px", background: "transparent",
              border: "1px solid #00d4aa", borderRadius: 6,
              color: "#00d4aa", fontFamily: "monospace", fontSize: 11,
              cursor: "pointer", letterSpacing: 1, textDecoration: "none"
            }}>NEW ASSESSMENT</Link>
          </div>
        </div>

        {/* Facts */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ EXTRACTED FACTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Contract Type", facts.contractType],
              ["Contract Value", facts.value],
              ["Consumer Type", facts.consumerType],
              ["Standard Form", facts.standardForm ? "Yes" : "No"],
              ["Bargaining Power", facts.bargainingPower],
              ["Disputed Clause", facts.disputedClause],
            ].filter(([, v]) => v).map(([k, v]) => (
              <div key={k as string} style={{
                background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "10px 12px",
                border: "1px solid rgba(255,255,255,0.06)"
              }}>
                <div style={{ fontSize: 9, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.8)" }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Issues */}
        {issues.map((iss: any, idx: number) => (
          <div key={idx} style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${iss.fjr?.fair && iss.fjr?.just && iss.fjr?.reasonable ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}`,
            borderRadius: 12, padding: "20px", marginBottom: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>
                  ▸ ISSUE {idx + 1}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{iss.issue}</div>
              </div>
              {iss.fjr?.score !== undefined && (
                <div style={{
                  background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 14px",
                  textAlign: "center", flexShrink: 0, marginLeft: 12
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "monospace",
                    color: iss.fjr.score >= 60 ? "#27ae60" : "#e74c3c" }}>{iss.fjr.score}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>FJR SCORE</div>
                </div>
              )}
            </div>

            {iss.law && (
              <div style={{
                background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6, padding: "10px 12px", marginBottom: 14
              }}>
                <div style={{ fontSize: 9, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>LAW APPLIED</div>
                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.85)", lineHeight: 1.7 }}>{iss.law}</div>
              </div>
            )}

            {iss.fjr && <FJRCard fjr={iss.fjr} />}

            {iss.argument && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[["CLAIMANT ARGUMENT", iss.argument.claimant], ["DEFENDANT ARGUMENT", iss.argument.defendant]].map(([side, arg]) => (
                  <div key={side as string} style={{
                    background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "12px",
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}>
                    <div style={{ fontSize: 9, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{side}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.75)", lineHeight: 1.6 }}>{String(arg)}</div>
                  </div>
                ))}
              </div>
            )}

            {iss.argument?.judicialLikelihood && (
              <div style={{ fontSize: 12, color: "#00d4aa", fontFamily: "monospace", marginBottom: 12 }}>
                → {iss.argument.judicialLikelihood}
              </div>
            )}

            {iss.verdict && (
              <div style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 6, padding: "10px 14px" }}>
                <span style={{ fontSize: 9, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 1 }}>VERDICT → </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{iss.verdict}</span>
              </div>
            )}
          </div>
        ))}

        {/* Relief */}
        {(relief.primary || relief.court) && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.3)", borderRadius: 12, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace", marginBottom: 14 }}>▸ STRUCTURED RELIEF</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Primary Relief", relief.primary], ["Damages", relief.damages], ["Limitation", relief.limitation], ["Urgent Steps", relief.urgentSteps]]
                .filter(([, v]) => v).map(([k, v]) => (
                  <div key={k as string} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 6, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 9, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.8)" }}>{String(v)}</div>
                  </div>
                ))}
            </div>
            {relief.court && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,212,170,0.08)", border: "1px solid #00d4aa", borderRadius: 6, padding: "6px 14px", marginBottom: 14 }}>
                <span>⚖️</span>
                <span style={{ fontSize: 12, color: "#00d4aa", fontFamily: "monospace", fontWeight: 700 }}>{relief.court}</span>
              </div>
            )}
            {relief.probability !== undefined && <ProbabilityMeter value={relief.probability} />}
          </div>
        )}

        <GovernanceSeal />
      </div>
    </div>
  )
}
