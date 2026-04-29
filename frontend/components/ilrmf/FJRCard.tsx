"use client"
export function FJRCard({ fjr }: { fjr: any }) {
  const allPass = fjr.fair && fjr.just && fjr.reasonable
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 9, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 }}>
        FJR TRIPLE-GATE ASSESSMENT
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {[["FAIR", fjr.fair], ["JUST", fjr.just], ["REASONABLE", fjr.reasonable]].map(([label, val]) => (
          <div key={label as string} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            background: val ? "rgba(39,174,96,0.12)" : "rgba(231,76,60,0.12)",
            border: `1px solid ${val ? "#27ae60" : "#e74c3c"}`,
            borderRadius: 8, padding: "10px 18px", minWidth: 90
          }}>
            <span style={{ fontSize: 18 }}>{val ? "✓" : "✗"}</span>
            <span style={{ fontSize: 11, color: val ? "#27ae60" : "#e74c3c", fontWeight: 700, marginTop: 2 }}>
              {label}
            </span>
          </div>
        ))}
        <div style={{
          flex: 1, minWidth: 120, display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "10px 14px",
          background: allPass ? "rgba(39,174,96,0.1)" : "rgba(231,76,60,0.1)",
          border: `1px solid ${allPass ? "#27ae60" : "#e74c3c"}`,
          borderRadius: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: allPass ? "#27ae60" : "#e74c3c" }}>
            {allPass ? "✓ TERM ENFORCEABLE" : "✗ TERM AT RISK / VOID"}
          </div>
          {fjr.analysis && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.4 }}>{fjr.analysis}</div>}
        </div>
      </div>
    </div>
  )
}
