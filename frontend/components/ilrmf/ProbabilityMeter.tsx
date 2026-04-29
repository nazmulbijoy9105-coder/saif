// ProbabilityMeter.tsx
"use client"
export function ProbabilityMeter({ value }: { value: number }) {
  const color = value >= 70 ? "#27ae60" : value >= 45 ? "#f39c12" : "#e74c3c"
  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: "monospace", letterSpacing: 1 }}>SUCCESS PROBABILITY</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: "monospace" }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}`, transition: "width 1.2s ease" }} />
      </div>
    </div>
  )
}
