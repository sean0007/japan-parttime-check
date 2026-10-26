import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { SOURCES } from "@/lib/parttime";
import { EXAMPLE_SHARED, EXAMPLE_STUDENT, PUBLIC_URL, resultPath } from "@/lib/share";

const title = "Can I work part-time on my Japanese visa? 28-hour rule checker (資格外活動許可) 2026";
const description =
  "Free checker for students, dependents and work-visa holders in Japan: can you take this part-time job or side gig, do you need permission for activities outside status (comprehensive or individual), are your hours within the 28-hour rule, and what changed on 2026-10-01 for pachinko, mahjong and game centers. Free JSON API for AI agents. Educational, not immigration advice.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan Part-time Work Check",
  alternateName: ["資格外活動許可 チェック", "留学生 アルバイト 28時間 判定", "家族滞在 パチンコ アルバイト 2026", "Japan student visa part-time job checker"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description: "Unofficial, free checker for Japan's permission for activities outside status of residence (資格外活動許可): which jobs each status may do, comprehensive vs individual permission, the 28-hour and 8-hour vacation limits, and the 2026-10-01 amusement-venue change, with a keyless JSON API. Not affiliated with the Immigration Services Agency.",
};

const faq: FaqItem[] = [
  {
    q: "How many hours can international students work in Japan?",
    a: "With the comprehensive permission (包括許可) stamped on your residence card, up to 28 hours in any 7-day period, counting all jobs together. During your school's official long vacation (as set in its rules) you may work up to 8 hours a day. Without the permission you can't work at all. Most bureaus check any 7 consecutive days, not just Monday to Sunday.",
  },
  {
    q: "What changed on October 1, 2026 for pachinko and game centers?",
    a: "Before, every permission outside status banned work at all 風俗営業 venues, including pachinko parlors, mahjong parlors and licensed game centers. From 2026-10-01, Dependent (家族滞在) holders only may work at venues licensed under category 4 or 5 of the Entertainment Business Act with an individual permission for that venue, even if they already have the 28-hour permission. The employer and the applicant both sign pledges, all side jobs stay within 28 hours a week, and students and Designated Activities dependents are still excluded.",
  },
  {
    q: "Can students work at an izakaya or bar?",
    a: "Yes, if staff don't 'host' guests. Serving food and drinks, kitchen work and late-night alcohol service are fine. A place where staff sit with customers, pour drinks for them one-on-one or sing with them is a 風俗営業 (category 1) venue such as a hostess club, snack or girls bar, and every role there, including dishwashing and cleaning, is banned.",
  },
  {
    q: "Can I do Uber Eats or other delivery gigs on a student or dependent visa?",
    a: "ISA says per-job contractor delivery is covered by the 28-hour comprehensive permission only if your working hours can be objectively confirmed (for example app login records); otherwise you need individual permission. Keep your records, and count app hours toward the 28. Platforms may set stricter rules of their own.",
  },
  {
    q: "Can I freelance or run a small business on a student or dependent visa?",
    a: "If your hours are clear (fixed in a contract) the comprehensive permission can cover it. If your hours can't be objectively confirmed, as with most freelancing, you need individual permission. Setting up a company, hiring staff or opening an office needs a change to Business Manager (経営・管理).",
  },
  {
    q: "Can I have a side job on a work visa?",
    a: "Work that fits your own status (an engineer doing other engineering work) needs no permission. Work that fits a different work status (a professor teaching at an eikaiwa) needs individual permission first. Simple labor such as konbini or restaurant shifts doesn't fit any work status, so it's generally not allowed; the 28-hour comprehensive permission is for students and dependents.",
  },
  {
    q: "Which statuses can work without any limit?",
    a: "Permanent Resident, Spouse or Child of Japanese National, Spouse or Child of Permanent Resident, and Long-Term Resident have no work restrictions. Working Holiday holders can work without the 28-hour cap, but not at 風俗営業 venues. Temporary Visitors, Specified Skilled Workers and Technical Intern Trainees can't take side jobs.",
  },
  {
    q: "How do I apply, and how long does it take?",
    a: "Apply at the Regional Immigration Services Bureau for your address with the application form (資格外活動許可申請書) and your residence card. There's no fee and standard processing is 2 weeks to 2 months. Students entering Japan for 3 months or more can get the comprehensive permission at the airport. Don't start work until it's granted.",
  },
  {
    q: "What happens if I work more than 28 hours?",
    a: "Working over the limit or without permission is unauthorized work. It can lead to refusal of your visa renewal, criminal penalties and deportation, and the employer can be charged with facilitating illegal work. For students, poor attendance because of part-time work is also a common reason for refused renewals.",
  },
  {
    q: "Is there a free API for AI agents?",
    a: `Yes. GET or POST ${PUBLIC_URL}/api/check?status=student&job=convenience_store&permission=comprehensive&weeklyHours=30 (keyless, CORS open), rules at /api/rules, OpenAPI at /openapi.json, llms.txt, and the MCP tool japan_parttime_work_check on free-agent-tools.vercel.app/mcp. Every response carries rulesAsOf, sources and a disclaimer.`,
  },
  {
    q: "留学生のアルバイトは週何時間までですか？",
    a: "資格外活動の包括許可があれば、すべてのアルバイトを合わせて1週28時間以内（どの曜日から数えても7日間で28時間）です。学則で定める長期休業期間中は1日8時間以内まで働けます。風俗営業等の店舗では、皿洗いや清掃も含めて働けません。",
  },
  {
    q: "家族滞在でパチンコ店で働けますか？",
    a: "2026年10月1日から、家族滞在の方に限り、風営法2条1項4号・5号の許可を受けた遊技場（ぱちんこ、まあじゃん、ゲームセンター）で、勤務先ごとに資格外活動の個別許可を受ければ働けるようになりました。包括許可を持っていても個別許可が必要です。勤務先と本人の誓約書、営業許可証の写し等を提出し、他のアルバイトと合わせて週28時間以内に収める必要があります。留学・特定活動（扶養）は対象外です。",
  },
];

const ROWS: [string, string, string][] = [
  ["Student (留学)", "28 h/week with comprehensive permission; 8 h/day in official long vacation", "No 風俗営業 venues incl. pachinko, mahjong, game centers"],
  ["Dependent (家族滞在)", "28 h/week with comprehensive permission", "Pachinko/mahjong/game center OK from 2026-10-01 with individual permission per venue"],
  ["Designated Activities: dependent / job hunting", "28 h/week with comprehensive permission", "No 風俗営業 venues"],
  ["Work visa (技人国, 教育, 教授…)", "Same-field work: no permission. Other work status: individual permission", "Simple labor side jobs generally not allowed"],
  ["Working Holiday", "No hour cap, no permission needed", "No 風俗営業 venues"],
  ["SSW / Technical Intern / Temporary Visitor", "No side jobs", "—"],
  ["PR, spouse of Japanese/PR, Long-Term Resident", "No immigration limit", "Labor law still applies"],
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · 資格外活動許可 · rules as of 2026-10-26</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Can I work this job on my Japanese visa?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          Students, dependents and work-visa holders need permission for activities outside their status before taking a part-time job, and the 28-hour limit counts every job together, in any 7 days. Since 2026-10-01 dependents can work at pachinko parlors and game centers with an individual permission, but students still can&apos;t. Pick your status and the job to see where you stand.
        </p>
        <p className="mt-3 text-sm text-muted">
          Examples:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SHARED)}>
            dependent at a pachinko parlor, 20 h
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_STUDENT)}>
            student at a konbini, 30 h
          </a>
        </p>
      </section>

      <section className="mt-8">
        <Calculator />
      </section>

      <section className="mt-16 max-w-5xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Who can work, and how much</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Status of residence</th>
                <th className="px-4 py-3 font-medium">Part-time / side work</th>
                <th className="px-4 py-3 font-medium">Entertainment venues</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              {ROWS.map(([a, b, c]) => (
                <tr key={a} className="border-t border-line">
                  <td className="px-4 py-3 text-foreground">{a}</td>
                  <td className="px-4 py-3">{b}</td>
                  <td className="px-4 py-3">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          Hostess/host clubs, snacks with hosting, low-light bars, late-night entertainment clubs and the sex industry stay banned for every capped status, in every role. The card stamp reads 許可：原則週28時間以内・風俗営業等の従事を除く.
        </p>
        <p className="mt-4 text-sm text-muted">
          Official pages:{" "}
          {SOURCES.slice(0, 5).map((s, i) => (
            <span key={s}>
              {i ? " · " : ""}
              <a className="underline underline-offset-2 hover:text-foreground" href={s} target="_blank" rel="noopener noreferrer">
                {s.replace("https://www.", "").slice(0, 60)}
              </a>
            </span>
          ))}
        </p>
      </section>

      <section className="mt-12 max-w-3xl rounded-3xl border border-line bg-panel/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">For AI agents and developers</h2>
        <p className="mt-2 text-sm text-muted">
          Keyless JSON, CORS open, GET or POST:{" "}
          <a className="font-mono text-foreground underline underline-offset-2 break-all" href="/api/check?status=dependent&job=pachinko&permission=comprehensive&weeklyHours=20">
            /api/check?status=dependent&amp;job=pachinko&amp;permission=comprehensive&amp;weeklyHours=20
          </a>
          . Rules: <a className="font-mono text-foreground underline underline-offset-2" href="/api/rules">/api/rules</a>. Docs: <a className="underline underline-offset-2" href="/openapi.json">OpenAPI</a>,{" "}
          <a className="underline underline-offset-2" href="/llms.txt">llms.txt</a>, MCP tool <span className="font-mono text-foreground">japan_parttime_work_check</span> on{" "}
          <a className="underline underline-offset-2" href="https://free-agent-tools.vercel.app" target="_blank" rel="noopener noreferrer">
            free-agent-tools
          </a>
          .
        </p>
      </section>

      <FaqSection items={faq} heading="Part-time work in Japan: questions" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
