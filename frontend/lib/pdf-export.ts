import jsPDF from "jspdf"

export function exportPDF(data: any) {
  const doc = new jsPDF()
  const dark = [10, 15, 30]
  const teal = [0, 212, 170]
  const gold = [201, 168, 76]

  // Header
  doc.setFillColor(...dark as [number, number, number])
  doc.rect(0, 0, 210, 297, "F")
  doc.setFillColor(...([13, 27, 62] as [number, number, number]))
  doc.rect(0, 0, 210, 30, "F")

  doc.setTextColor(...teal as [number, number, number])
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SAIF — UK Contract Law Assessment", 14, 14)

  doc.setFontSize(8)
  doc.setTextColor(...gold as [number, number, number])
  doc.text("ILRMF Engine | Md Nazmul Islam (Bijoy) | NB TECH Bangladesh", 14, 22)

  let y = 40

  // Facts
  doc.setTextColor(...gold as [number, number, number])
  doc.setFontSize(10)
  doc.text("EXTRACTED FACTS", 14, y)
  y += 8

  const facts = data?.facts || {}
  doc.setTextColor(200, 210, 240)
  doc.setFontSize(9)
  for (const [k, v] of Object.entries(facts)) {
    if (v) { doc.text(`${k}: ${v}`, 14, y); y += 6 }
  }

  y += 6

  // Issues
  const issues = data?.issues || []
  for (const [idx, iss] of issues.entries()) {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setTextColor(...gold as [number, number, number])
    doc.setFontSize(10)
    doc.text(`ISSUE ${idx + 1}: ${iss.issue || ""}`, 14, y)
    y += 7

    if (iss.law) {
      doc.setTextColor(180, 190, 220)
      doc.setFontSize(8)
      const lines = doc.splitTextToSize(iss.law, 180)
      doc.text(lines, 14, y)
      y += lines.length * 5 + 3
    }

    if (iss.fjr) {
      doc.setTextColor(...teal as [number, number, number])
      doc.text(`FJR: Fair=${iss.fjr.fair} | Just=${iss.fjr.just} | Reasonable=${iss.fjr.reasonable} | Score=${iss.fjr.score}/100`, 14, y)
      y += 6
    }

    if (iss.verdict) {
      doc.setTextColor(200, 220, 200)
      doc.text(`Verdict: ${iss.verdict}`, 14, y)
      y += 8
    }
  }

  // Relief
  const relief = data?.relief || {}
  if (relief.primary) {
    if (y > 250) { doc.addPage(); y = 20 }
    doc.setTextColor(...gold as [number, number, number])
    doc.setFontSize(10)
    doc.text("STRUCTURED RELIEF", 14, y)
    y += 7
    doc.setTextColor(200, 210, 240)
    doc.setFontSize(9)
    if (relief.primary) { doc.text(`Primary: ${relief.primary}`, 14, y); y += 6 }
    if (relief.damages) { doc.text(`Damages: ${relief.damages}`, 14, y); y += 6 }
    if (relief.court) { doc.text(`Court: ${relief.court}`, 14, y); y += 6 }
    if (relief.probability) { doc.text(`Success Probability: ${relief.probability}%`, 14, y); y += 6 }
    if (relief.limitation) { doc.text(`Limitation: ${relief.limitation}`, 14, y); y += 6 }
  }

  // Footer
  doc.setFillColor(...([13, 27, 62] as [number, number, number]))
  doc.rect(0, 280, 210, 17, "F")
  doc.setTextColor(...gold as [number, number, number])
  doc.setFontSize(7)
  doc.text("ILRMF v1.0 | Md Nazmul Islam (Bijoy) | NB TECH Bangladesh | Fair · Just · Reasonable | Zero Hallucination", 14, 289)

  doc.save(`SAIF-Assessment-${Date.now()}.pdf`)
}
