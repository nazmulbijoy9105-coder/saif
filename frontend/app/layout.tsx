import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "SAIF — UK Contract Law AI | ILRMF Engine",
  description: "Smart Agentic Intelligence Framework — UK Contract Law disputes powered by ILRMF. Fair, Just & Reasonable. Zero hallucination. Created by Md Nazmul Islam (Bijoy) | NB TECH Bangladesh.",
  keywords: "UK contract law AI, SAIF, ILRMF, NB TECH, Md Nazmul Islam Bijoy, legal AI, FJR assessment",
  authors: [{ name: "Md Nazmul Islam (Bijoy)", url: "https://nbtech.ai" }],
  openGraph: {
    title: "SAIF — UK Contract Law AI",
    description: "ILRMF-powered contract law dispute assessment. Fair · Just · Reasonable.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="creator" content="Md Nazmul Islam (Bijoy) | NB TECH Bangladesh" />
        <meta name="engine" content="ILRMF v1.0" />
      </head>
      <body>
        <Toaster position="top-right" toastOptions={{
          style: { background: "#0d1b3e", color: "#f0f4ff", border: "1px solid rgba(0,212,170,0.3)" }
        }} />
        {children}
      </body>
    </html>
  )
}
