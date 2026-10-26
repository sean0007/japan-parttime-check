import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/parttime";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational checker. It applies a dated reading (as of {RULES_AS_OF}) of the Immigration Services Agency&apos;s pages on permission to engage in activities other than those permitted by the status of residence (資格外活動許可: general rules, Student, Dependent and Designated Activities pages), the ISA notice on work at amusement venues for Dependent holders effective 2026-10-01 (遊技場営業店舗における資格外活動), and MHLW&apos;s guidance for employers to the status, job and hours you choose.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not legal or immigration advice and is not affiliated with the Immigration Services Agency, any immigration bureau, any school or employer. It can&apos;t read your residence card or designation paper, check whether a specific venue holds an Entertainment Business Act license or hosts guests, or know how an officer will judge your case. Only the permission actually granted to you and the ISA decide. Unauthorized work can lead to refusal of renewal, criminal penalties and deportation, and employers can be punished for facilitating illegal work. Labor law (for example the 40-hour week), tax and social insurance rules apply separately. Confirm with your Regional Immigration Services Bureau, the Immigration Information Center (0570-013904), your school&apos;s international office or a licensed gyoseishoshi (行政書士) before you rely on a result.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">The choices you make stay in your browser (or in a share link you create). No login, no names, no database.</p>
        </section>
      </div>
    </div>
  );
}
