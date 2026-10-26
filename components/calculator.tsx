"use client";

import { useState } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { JOBS, JOB_INFO, STATUSES, STATUS_LABEL, type Job, type Permission, type Status } from "@/lib/parttime";
import { EXAMPLE_SHARED, PUBLIC_URL, resultPath, safeCheck, type Shared } from "@/lib/share";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";

const VERDICT_STYLE: Record<string, string> = {
  ok: "text-teal-200",
  no_restriction: "text-teal-200",
  ok_if_hours: "text-amber-200",
  apply_first: "text-amber-200",
  individual_permission: "text-amber-200",
  status_change: "text-amber-200",
  not_allowed: "text-red-300",
};
const PERM_LABEL: Record<Permission, string> = {
  unknown: "Not sure",
  none: "No permission yet",
  comprehensive: "Yes: 28-hour stamp (包括許可)",
  individual: "Yes: individual permission (個別許可)",
};
const CAPPED: Status[] = ["student", "dependent", "designated_dependent", "job_hunting"];

function toNum(v: string): number | null {
  const t = v.replace(/[,\s]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n <= 168 ? n : null;
}

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [status, setStatus] = useState<Status>(start.status);
  const [job, setJob] = useState<Job>(start.job);
  const [permission, setPermission] = useState<Permission>(start.permission);
  const [hours, setHours] = useState(start.weeklyHours !== null ? String(start.weeklyHours) : "");
  const [vacation, setVacation] = useState(start.longVacation);
  const [daily, setDaily] = useState(start.dailyHours ?? "");
  const [enrolled, setEnrolled] = useState(start.enrolled);
  const [employees, setEmployees] = useState(start.hasEmployeesOrOffice);
  const [intern, setIntern] = useState(start.internshipEligible);
  const [same, setSame] = useState(start.sameCategoryWork);

  const isStudent = status === "student";
  const capped = CAPPED.includes(status);
  const shared: Shared = {
    status,
    job,
    permission,
    weeklyHours: toNum(hours),
    longVacation: isStudent && vacation,
    dailyHours: capped && daily.trim() ? daily.trim().replace(/\s+/g, "") : null,
    enrolled: !isStudent || enrolled,
    hasEmployeesOrOffice: job === "freelance" && employees,
    internshipEligible: isStudent && job === "internship" && intern,
    sameCategoryWork: status === "work_visa" && same,
  };
  const r = safeCheck(shared);
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your status and the job</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Status of residence (在留資格)</span>
          <select data-testid="status" className={field} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((x) => (
              <option key={x} value={x}>
                {STATUS_LABEL[x].en} · {STATUS_LABEL[x].ja}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Job or workplace</span>
          <select data-testid="job" className={field} value={job} onChange={(e) => setJob(e.target.value as Job)}>
            {JOBS.map((x) => (
              <option key={x} value={x}>
                {JOB_INFO[x].en} · {JOB_INFO[x].ja}
              </option>
            ))}
          </select>
        </label>
        {capped || status === "work_visa" ? (
          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">Permission you already have</span>
            <select data-testid="permission" className={field} value={permission} onChange={(e) => setPermission(e.target.value as Permission)}>
              {(Object.keys(PERM_LABEL) as Permission[]).map((p) => (
                <option key={p} value={p}>
                  {PERM_LABEL[p]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Hours per week, all side jobs together</span>
          <input data-testid="hours" inputMode="decimal" placeholder="e.g. 20" className={field} value={hours} onChange={(e) => setHours(e.target.value)} />
        </label>
        {capped ? (
          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">Or day-by-day hours (optional)</span>
            <input data-testid="daily" placeholder={isStudent ? "e.g. 8v,8v,8v,4,4,0,0 (v = long-vacation day)" : "e.g. 0,6,6,0,8,8,0"} className={field} value={daily} onChange={(e) => setDaily(e.target.value)} />
            <span className="mt-1 block text-xs text-muted">Checks every 7-day stretch, not just Monday to Sunday.</span>
          </label>
        ) : null}
        {isStudent ? (
          <>
            <label className="mt-4 flex items-start gap-2 text-sm text-foreground">
              <input type="checkbox" className="mt-1" checked={vacation} onChange={(e) => setVacation(e.target.checked)} />
              <span>These hours fall in my school&apos;s official long vacation (summer, winter, spring break)</span>
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
              <input type="checkbox" className="mt-1" checked={enrolled} onChange={(e) => setEnrolled(e.target.checked)} />
              <span>I&apos;m still enrolled and attending (not graduated, withdrawn or on leave)</span>
            </label>
          </>
        ) : null}
        {isStudent && job === "internship" ? (
          <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" className="mt-1" checked={intern} onChange={(e) => setIntern(e.target.checked)} />
            <span>Final year with about 90%+ of credits (or final-year master&apos;s/PhD, or a credit-bearing practicum)</span>
          </label>
        ) : null}
        {job === "freelance" ? (
          <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" className="mt-1" checked={employees} onChange={(e) => setEmployees(e.target.checked)} />
            <span>I hire staff, set up a company or rent an office</span>
          </label>
        ) : null}
        {status === "work_visa" ? (
          <label className="mt-3 flex items-start gap-2 text-sm text-foreground">
            <input type="checkbox" className="mt-1" checked={same} onChange={(e) => setSame(e.target.checked)} />
            <span>The side job is the same kind of work my visa covers</span>
          </label>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/60">
        <div className="p-5 sm:p-7" data-testid="result">
          {r ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {r.statusLabel.ja} · {r.jobLabel.ja}
              </p>
              <p className={`mt-2 font-display text-4xl tracking-tight sm:text-5xl ${VERDICT_STYLE[r.verdict]}`}>{r.verdictLabel}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{r.headline}</p>
              <p className="mt-3 text-base text-foreground">{r.summary}</p>
              {r.hours.weeklyLimit ? (
                <div className={`mt-4 rounded-2xl border p-4 text-sm ${r.hours.withinLimit === false ? "border-red-400/40 bg-red-500/5 text-red-100" : "border-line bg-black/20 text-muted"}`}>
                  <p className="font-semibold text-foreground">
                    Limit: {r.hours.weeklyLimit} h in any 7 days{r.hours.dailyLimitOnVacation ? ` · ${r.hours.dailyLimitOnVacation} h/day in long vacation` : ""}
                    {r.hours.enteredWeekly !== null ? ` · you: ${r.hours.enteredWeekly} h` : ""}
                  </p>
                  <p className="mt-1 leading-relaxed">{r.hours.note}</p>
                  {r.hours.worstWindow ? (
                    <p className="mt-1">
                      Busiest 7 days: day {r.hours.worstWindow.from}–{r.hours.worstWindow.to} = {r.hours.worstWindow.hours} h
                    </p>
                  ) : null}
                </div>
              ) : null}
              {[
                ["Conditions", r.conditions],
                ["Documents", r.documents],
                ["What to do", r.steps],
                ["Watch out", r.warnings],
              ].map(([title, items]) =>
                (items as string[]).length ? (
                  <div key={title as string}>
                    <h3 className="mt-6 text-sm font-semibold text-foreground">{title as string}</h3>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
                      {(items as string[]).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
              <div className="mt-6">
                <ShareBar url={shareUrl} text={`Japan part-time work check: ${r.statusLabel.en.split(" (")[0]} at ${r.jobLabel.en.split(" (")[0].split(" /")[0]} → ${r.verdictLabel}`} />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">Check the day-by-day hours format: numbers separated by commas, with v after long-vacation days (students only).</p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}
