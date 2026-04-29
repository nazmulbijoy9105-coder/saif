"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/ui/Header"
import { GovernanceBanner } from "@/components/ui/GovernanceBanner"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import axios from "axios"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem("saif_user")
    const token = localStorage.getItem("saif_token")
    if (!u || !token) { router.push("/auth/login"); return }
    setUser(JSON.parse(u))
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/assess/history`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      if (data.success) setHistory(data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem("saif_token")
    localStorage.removeItem("saif_user")
    router.push("/")
  }

  const PHASE_COLORS: Record<number, string> = { 1: "#00d4aa", 2: "#00d4aa", 3: "#f39c12", 4: "#c9a84c" }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <GovernanceBanner />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* User Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 10, color: "#00d4aa", letterSpacing: 2, fontFamily: "monospace", marginBottom: 6 }}>
              SAIF DASHBOARD — ILRMF ENGINE
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              {user?.name || "User"}
            </h1>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{user?.email}</span>
              <span style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 10,
                background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)",
                color: "#00d4aa", fontFamily: "monospace", letterSpacing: 1
              }}>{(user?.tier || "FREE").toUpperCase()}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/assess" style={{
              padding: "10px 18px", background: "#00d4aa", borderRadius: 7,
              color: "#0a0f1e", fontFamily: "monospace", fontSize: 11,
              fontWeight: 700, letterSpacing: 1, textDecoration: "none"
            }}>+ NEW ASSESSMENT</Link>
            <button onClick={logout} style={{
              padding: "10px 16px", background: "transparent",
              border: "1px solid rgba(231,76,60,0.4)", borderRadius: 7,
              color: "#e74c3c", fontFamily: "monospace", fontSize: 11, cursor: "pointer"
            }}>LOGOUT</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
          {[
            ["Total Assessments", history.length, "#00d4aa"],
            ["Plan", user?.tier?.toUpperCase() || "FREE", "#c9a84c"],
            ["Engine", "ILRMF v1.0", "#00d4aa"],
            ["Hallucination", "ZERO", "#27ae60"],
          ].map(([label, value, color]) => (
            <div key={label as string} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.15)",
              borderRadius: 10, padding: "14px", textAlign: "center"
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: color as string, fontFamily: "monospace" }}>{value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, fontFamily: "monospace", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* History */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,212,170,0.1)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace" }}>▸ ASSESSMENT HISTORY</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{history.length} records</span>
          </div>

          {loading ? (
            <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: 12 }}>
              Loading...
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>No assessments yet</div>
              <Link href="/assess" style={{
                padding: "10px 20px", background: "#00d4aa", borderRadius: 6,
                color: "#0a0f1e", fontFamily: "monospace", fontSize: 11,
                fontWeight: 700, textDecoration: "none"
              }}>Run First Assessment</Link>
            </div>
          ) : (
            history.map((item, i) => (
              <div key={item.id} style={{
                padding: "14px 20px", borderBottom: i < history.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
                    {item.claimant} <span style={{ color: "rgba(255,255,255,0.3)" }}>v</span> {item.defendant}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                      {item.contract_type}
                    </span>
                    <span style={{
                      fontSize: 9, padding: "1px 6px", borderRadius: 4,
                      background: `${PHASE_COLORS[item.phase] || "#00d4aa"}15`,
                      border: `1px solid ${PHASE_COLORS[item.phase] || "#00d4aa"}30`,
                      color: PHASE_COLORS[item.phase] || "#00d4aa", fontFamily: "monospace"
                    }}>Phase {item.phase}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                    {new Date(item.created_at).toLocaleDateString("en-GB")}
                  </span>
                  <Link href={`/result?id=${item.id}`} style={{
                    fontSize: 10, padding: "4px 10px", border: "1px solid rgba(0,212,170,0.3)",
                    borderRadius: 4, color: "#00d4aa", fontFamily: "monospace", textDecoration: "none"
                  }}>VIEW</Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upgrade Prompt for free users */}
        {user?.tier === "free" && (
          <div style={{
            marginTop: 20, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: 10, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>
                UPGRADE TO PRO
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                Unlock Phase 2 (Employment), unlimited assessments, PDF export from £9.99/month
              </div>
            </div>
            <Link href="/pricing" style={{
              padding: "10px 18px", background: "#c9a84c", borderRadius: 6,
              color: "#0a0f1e", fontFamily: "monospace", fontSize: 11,
              fontWeight: 700, textDecoration: "none", flexShrink: 0, marginLeft: 16
            }}>VIEW PLANS</Link>
          </div>
        )}

        {/* Governance Footer */}
        <div style={{ marginTop: 28, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", lineHeight: 1.8 }}>
          SAIF ILRMF Engine v1.0 · Md Nazmul Islam (Bijoy) · NB TECH Bangladesh<br />
          Fair · Just · Reasonable · Zero Hallucination · All Rights Reserved
        </div>
      </div>
    </div>
  )
}
