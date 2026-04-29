"use client"
const SEALS = [
  ["🔐 SECURITY", "High-grade governance\nMd Nazmul Islam (Bijoy)"],
  ["⚖ ILRMF", "Facts→Law→Argument\n→Relief enforced"],
  ["✓ HALLUCINATION", "ZERO — Verified\ncitations only"],
  ["◈ EQUITY", "FJR Triple-Gate\nAll parties protected"],
  ["§ UK JURISDICTION", "Phase 1-4 Contract\nLaw Specialist AI"],
  ["🏛 NB TECH", "Proprietary Engine\n© All Rights Reserved"],
]
export function GovernanceSeal() {
  return (
    <div style={{
      background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 10, padding: "16px 20px", marginTop: 24,
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14
    }}>
      {SEALS.map(([title, desc]) => (
        <div key={title as string} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#c9a84c", fontFamily: "monospace", letterSpacing: 1, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, whiteSpace: "pre-line" }}>{desc as string}</div>
        </div>
      ))}
    </div>
  )
}
