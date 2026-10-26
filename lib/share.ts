import { JOBS, PERMISSIONS, STATUSES, checkWork, type CheckInput, type Job, type Permission, type Status } from "./parttime";

export const PUBLIC_URL = "https://japan-parttime-check.vercel.app";

/** Share links: /r?s=dependent&j=pachinko[&p=comprehensive][&h=20][&v=1][&d=8v,8v,4][&e=0][&o=1][&i=1][&c=1] */
type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

export type Shared = {
  status: Status;
  job: Job;
  permission: Permission;
  weeklyHours: number | null;
  longVacation: boolean;
  dailyHours: string | null;
  enrolled: boolean;
  hasEmployeesOrOffice: boolean;
  internshipEligible: boolean;
  sameCategoryWork: boolean;
};

const BASE = { permission: "unknown" as Permission, weeklyHours: null, longVacation: false, dailyHours: null, enrolled: true, hasEmployeesOrOffice: false, internshipEligible: false, sameCategoryWork: false };
export const EXAMPLE_SHARED: Shared = { ...BASE, status: "dependent", job: "pachinko", permission: "comprehensive", weeklyHours: 20 };
export const EXAMPLE_STUDENT: Shared = { ...BASE, status: "student", job: "convenience_store", permission: "comprehensive", weeklyHours: 30 };
export const EXAMPLES: Shared[] = [EXAMPLE_SHARED, EXAMPLE_STUDENT];

export function parseShared(p: Params): Shared | null {
  const st = one(p, "s");
  const j = one(p, "j");
  if (!st || !(STATUSES as readonly string[]).includes(st) || !j || !(JOBS as readonly string[]).includes(j)) return null;
  const perm = one(p, "p") ?? "unknown";
  const h = one(p, "h");
  const d = one(p, "d");
  return {
    status: st as Status,
    job: j as Job,
    permission: ((PERMISSIONS as readonly string[]).includes(perm) ? perm : "unknown") as Permission,
    weeklyHours: h && /^\d{1,3}(\.\d)?$/.test(h) && Number(h) <= 168 ? Number(h) : null,
    longVacation: one(p, "v") === "1",
    dailyHours: d && /^[\d.vV,]{1,300}$/.test(d) ? d : null,
    enrolled: one(p, "e") !== "0",
    hasEmployeesOrOffice: one(p, "o") === "1",
    internshipEligible: one(p, "i") === "1",
    sameCategoryWork: one(p, "c") === "1",
  };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  q.set("s", s.status);
  q.set("j", s.job);
  if (s.permission !== "unknown") q.set("p", s.permission);
  if (s.weeklyHours !== null) q.set("h", String(s.weeklyHours));
  if (s.longVacation) q.set("v", "1");
  if (s.dailyHours) q.set("d", s.dailyHours);
  if (!s.enrolled) q.set("e", "0");
  if (s.hasEmployeesOrOffice) q.set("o", "1");
  if (s.internshipEligible) q.set("i", "1");
  if (s.sameCategoryWork) q.set("c", "1");
  return q.toString().replace(/%2C/g, ",");
}

export function toCheckInput(s: Shared): CheckInput {
  return { ...s };
}
export function safeCheck(s: Shared) {
  try {
    return checkWork(toCheckInput(s));
  } catch {
    return null;
  }
}
export function resultPath(s: Shared): string {
  return `/r?${sharedQuery(s)}`;
}
export function ogPath(s: Shared): string {
  return `/og?${sharedQuery(s)}`;
}
export function isIndexable(s: Shared): boolean {
  return EXAMPLES.some((e) => resultPath(e) === resultPath(s));
}
