import { ImageResponse } from "next/og";

export const alt = "Japan Part-time Work Check: can I work this job on my Japanese visa? 28-hour rule and 資格外活動許可";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "64px", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "#f0b429" }}>Free · Japan · rules as of 2026-10-26</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1050 }}>Can I work this job on my Japanese visa?</div>
          <div style={{ display: "flex", fontSize: 30, color: "#9b9588", maxWidth: 1050, lineHeight: 1.35 }}>28 h in any 7 days · 8 h/day in long vacation · new 2026-10-01 pachinko rule for dependents</div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 22, color: "#9b9588" }}>
          <span style={{ color: "#99f6e4" }}>Students · dependents · work visas</span>
          <span>Permission + hours + documents</span>
          <span>Free JSON API · no login</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
