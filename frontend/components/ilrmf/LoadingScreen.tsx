"use client"
import { useEffect, useState } from "react"
const MSGS = [
  "Extracting facts via ILRMF...",
  "Identifying UK statutes...",
  "Running FJR triple-gate...",
  "Building legal arguments...",
  "Verifying citations — zero hallucination...",
  "Enforcing equity & governance...",
  "Structuring court-ready relief...",
  "Applying Md Nazmul Islam ILRMF signature...",
]
export function ILRMFLoadingScreen() {
  const [msg, setMsg] = useState(MSGS[0])
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let i = 0
    const t = setInterval(() => { i = (i + 1) % MSGS.length; setMsg(MSGS[i]); setTick(x => x + 1) }, 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid rgba(0,212,170,0.15)", borderTop: "3px solid #00d4aa", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#00d4aa", fontFamily: "monospace", marginBottom: 8 }}>{msg}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>ILRMF ENGINE — Md Nazmul Islam (Bijoy) / NB TECH</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["FACTS", "LAW", "ARGUMENT", "RELIEF"].map((s, i) => (
          <div key={s} style={{
            fontSize: 9, padding: "4px 10px", borderRadius: 4, fontFamily: "monospace", letterSpacing: 1,
            background: tick > i * 2 ? "rgba(0,212,170,0.15)" : "rgba(255,255,255,0.04)",
            color: tick > i * 2 ? "#00d4aa" : "rgba(255,255,255,0.2)",
            border: `1px solid ${tick > i * 2 ? "#00d4aa" : "rgba(255,255,255,0.08)"}`,
            transition: "all 0.5s"
          }}>{s}</div>
        ))}
      </div>
    </div>
  )
}
