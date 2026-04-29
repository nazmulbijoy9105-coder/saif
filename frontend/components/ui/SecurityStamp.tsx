"use client"
export function SecurityStamp() {
  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16, zIndex: 9999,
      background: "rgba(10,15,30,0.95)", border: "1px solid #c9a84c",
      borderRadius: 8, padding: "8px 14px", backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column", alignItems: "flex-end"
    }}>
      <span style={{ fontSize: 8, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace" }}>SECURED SYSTEM</span>
      <span style={{ fontSize: 10, color: "#00d4aa", fontFamily: "monospace" }}>Md Nazmul Islam (Bijoy)</span>
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>NB TECH © ILRMF ENGINE</span>
    </div>
  )
}
