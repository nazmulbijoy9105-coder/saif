// components/ui/Header.tsx
"use client"
import Link from "next/link"
export function Header() {
  return (
    <header style={{
      background: "rgba(13,27,62,0.95)", borderBottom: "1px solid rgba(0,212,170,0.2)",
      backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, padding: "0 24px"
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 7,
            background: "linear-gradient(135deg, #00d4aa, #1a2764)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#0a0f1e", fontFamily: "monospace"
          }}>S</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", letterSpacing: 1 }}>
              SAIF <span style={{ color: "#00d4aa" }}>UK</span>
            </div>
            <div style={{ fontSize: 8, color: "#c9a84c", letterSpacing: 2, fontFamily: "monospace" }}>
              CONTRACT LAW AI — ILRMF ENGINE
            </div>
          </div>
        </Link>
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {[["Assess", "/assess"], ["Pricing", "/pricing"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 11, color: "rgba(240,244,255,0.6)", fontFamily: "monospace", letterSpacing: 1, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
          <Link href="/auth/login" style={{
            fontSize: 11, padding: "6px 14px", border: "1px solid rgba(0,212,170,0.4)",
            borderRadius: 6, color: "#00d4aa", fontFamily: "monospace", letterSpacing: 1, textDecoration: "none"
          }}>LOGIN</Link>
        </nav>
      </div>
    </header>
  )
}
