"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/ui/Header"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import toast from "react-hot-toast"
import axios from "axios"

export default function RegisterPage() {
  const router = useRouter()
  const params = useSearchParams()
  const plan = params.get("plan") || "free"
  const [form, setForm] = useState({ name: "", email: "", password: "", organisation: "" })
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { toast.error("Fill all required fields"); return }
    if (form.password.length < 8) { toast.error("Password min 8 characters"); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, form)
      if (data.success) {
        toast.success("Registration successful! Check your email.")
        if (plan !== "free") router.push(`/pricing`)
        else router.push("/auth/login")
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Registration failed")
    } finally { setLoading(false) }
  }

  const label = { fontSize: 10, color: "#00d4aa", letterSpacing: 2, fontFamily: "monospace" as const, marginBottom: 6, display: "block" as const }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <div style={{ maxWidth: 440, margin: "50px auto", padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 14, padding: "32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#00d4aa", letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>SAIF — REGISTER</div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Create Account</h1>
            {plan !== "free" && (
              <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 6, display: "inline-block" }}>
                <span style={{ fontSize: 10, color: "#c9a84c", fontFamily: "monospace" }}>Plan: {plan.toUpperCase()}</span>
              </div>
            )}
          </div>
          {[
            ["FULL NAME *", "name", "text", "Md Nazmul Islam"],
            ["EMAIL ADDRESS *", "email", "email", "your@email.com"],
            ["PASSWORD * (min 8 chars)", "password", "password", "••••••••"],
            ["ORGANISATION", "organisation", "text", "NB TECH / Law Firm / Company"],
          ].map(([lbl, key, type, ph]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={label}>{lbl}</label>
              <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={ph} />
            </div>
          ))}
          <button onClick={submit} disabled={loading} style={{
            width: "100%", padding: "14px", background: loading ? "rgba(0,212,170,0.5)" : "#00d4aa",
            border: "none", borderRadius: 8, color: "#0a0f1e", fontWeight: 700,
            fontFamily: "monospace", fontSize: 12, letterSpacing: 2, cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8
          }}>
            {loading ? "CREATING ACCOUNT..." : "⚖ CREATE SAIF ACCOUNT"}
          </button>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Have account?{" "}
            <Link href="/auth/login" style={{ color: "#00d4aa", textDecoration: "none" }}>Login here</Link>
          </div>
          <div style={{ marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.25)", textAlign: "center", fontFamily: "monospace", lineHeight: 1.6 }}>
            Governed by ILRMF — Md Nazmul Islam (Bijoy) / NB TECH<br />
            Fair · Just · Reasonable · Zero Hallucination
          </div>
        </div>
      </div>
    </div>
  )
}
