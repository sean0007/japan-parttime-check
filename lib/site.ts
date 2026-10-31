export const SITE_NAME = "Japan Part-time Work Check";

export const SITE_TAGLINE =
  "Student, dependent or work visa in Japan? Check if you can take a part-time job or side gig, whether you need permission for activities outside status (資格外活動許可), if your hours fit the 28-hour rule, and what changed on 2026-10-01 for pachinko, mahjong and game centers.";

export const DISCLAIMER_SHORT = "Educational guide, not legal or immigration advice, not affiliated with the Immigration Services Agency. Only your permission and ISA decide; confirm before you start work.";

export const HONESTY =
  "Rules as of 2026-10-26 from ISA's 資格外活動許可 pages (general, Student, Dependent, Designated Activities), the 2026-10-01 遊技場営業店舗 notice and MHLW's employer guide. It can't read your residence card or judge a specific venue.";

export const SIBLING_TOOLS = [
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-driving-check.vercel.app", label: "Japan Driving Check" },
  { href: "https://house-rules-check.vercel.app", label: "House Rules Check" },
  { href: "https://japan-mynumber-card-check.vercel.app", label: "Japan My Number Card Check" },
  { href: "https://japan-hsp-points.vercel.app", label: "Japan HSP Points Calculator" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-parttime-check.vercel.app";
}
