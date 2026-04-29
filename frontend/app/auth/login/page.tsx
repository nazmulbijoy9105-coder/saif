"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/ui/Header"
import { SecurityStamp } from "@/components/ui/SecurityStamp"
import toast from "react-hot-toast"
import axios from "axios"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.email || !form.password) { toast.error("Fill all fields"); return }
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, form)
      if (data.success) {
        localStorage.setItem("saif_token", data.token)
        localStorage.setItem("saif_user", JSON.stringify(data.user))
        toast.success(`Welcome back, ${data.user.name}`)
        router.push("/dashboard")
      }
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Login failed")
    } finally { setLoading(false) }
  }

  const label = { fontSize: 10, color: "#00d4aa", letterSpacing: 2, fontFamily: "monospace" as const, marginBottom: 6, display: "block" as const }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e" }}>
      <SecurityStamp />
      <Header />
      <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,170,0.2)", borderRadius: 14, padding: "32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: "#00d4aa", letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>SAIF — SECURE LOGIN</div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Welcome Back</h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>ILRMF Engine — Md Nazmul Islam (Bijoy) / NB TECH</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={label}>EMAIL ADDRESS</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={label}>PASSWORD</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <button onClick={submit} disabled={loading} style={{
            width: "100%", padding: "14px", background: loading ? "rgba(0,212,170,0.5)" : "#00d4aa",
            border: "none", borderRadius: 8, color: "#0a0f1e", fontWeight: 700,
            fontFamily: "monospace", fontSize: 12, letterSpacing: 2, cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "AUTHENTICATING..." : "⚖ LOGIN TO SAIF"}
          </button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            No account?{" "}
            <Link href="/auth/register" style={{ color: "#00d4aa", textDecoration: "none" }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
