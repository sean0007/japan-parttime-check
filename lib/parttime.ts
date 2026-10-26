/**
 * Japan part-time work permission check (資格外活動許可), rules as of 2026-10-26.
 * Sources: ISA 資格外活動許可について (nyuukokukanri07_00045), 留学 (…00003), 家族滞在 (…00004),
 * 特定活動 job-hunting (…00002), 遊技場営業店舗 (10_00274, from 2026-10-01), 16-8 procedure page,
 * shikakugai_00001 (card stamp wording), MHLW employer check page, Study in Japan (JASSO) part-time page.
 */

export const RULES_AS_OF = "2026-10-26";

export const STATUSES = [
  "student",
  "dependent",
  "designated_dependent",
  "job_hunting",
  "work_visa",
  "specified_skilled",
  "technical_intern",
  "working_holiday",
  "temporary_visitor",
  "unrestricted",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, { en: string; ja: string }> = {
  student: { en: "Student (College Student)", ja: "留学" },
  dependent: { en: "Dependent", ja: "家族滞在" },
  designated_dependent: { en: "Designated Activities (dependent of a foreign national)", ja: "特定活動（扶養を受ける配偶者・子等）" },
  job_hunting: { en: "Designated Activities (job hunting after graduation / waiting to join)", ja: "特定活動（継続就職活動・内定後待機）" },
  work_visa: { en: "Work visa (Engineer/Specialist in Humanities, Instructor, Professor, etc.)", ja: "就労資格（技術・人文知識・国際業務、教育、教授 等）" },
  specified_skilled: { en: "Specified Skilled Worker (SSW i / ii)", ja: "特定技能" },
  technical_intern: { en: "Technical Intern Training", ja: "技能実習" },
  working_holiday: { en: "Designated Activities (Working Holiday)", ja: "特定活動（ワーキング・ホリデー）" },
  temporary_visitor: { en: "Temporary Visitor (tourist / short stay)", ja: "短期滞在" },
  unrestricted: { en: "Permanent Resident, Spouse of Japanese/PR, Long-Term Resident", ja: "永住者・日本人の配偶者等・永住者の配偶者等・定住者" },
};

export const JOBS = [
  "restaurant",
  "izakaya_bar",
  "convenience_store",
  "retail",
  "hotel",
  "factory_warehouse",
  "cleaning",
  "office",
  "language_teacher",
  "interpreter_translator",
  "tutor",
  "delivery_employee",
  "delivery_gig",
  "freelance",
  "internship",
  "pachinko",
  "mahjong",
  "game_center",
  "hostess_bar",
  "nightclub",
  "adult",
] as const;
export type Job = (typeof JOBS)[number];

type JobKind = "ordinary" | "skilled" | "gig_verifiable" | "freelance" | "internship" | "fuzoku_45" | "fuzoku_hosting" | "nightclub" | "adult";

export const JOB_INFO: Record<Job, { en: string; ja: string; kind: JobKind }> = {
  restaurant: { en: "Restaurant / café / fast food", ja: "飲食店", kind: "ordinary" },
  izakaya_bar: { en: "Izakaya or bar with no hosting of guests (incl. late-night alcohol)", ja: "居酒屋・バー（接待なし、深夜酒類提供を含む）", kind: "ordinary" },
  convenience_store: { en: "Convenience store", ja: "コンビニ", kind: "ordinary" },
  retail: { en: "Shop / supermarket / drugstore sales", ja: "販売", kind: "ordinary" },
  hotel: { en: "Hotel or ryokan staff", ja: "ホテル・旅館", kind: "ordinary" },
  factory_warehouse: { en: "Factory or warehouse", ja: "工場・倉庫", kind: "ordinary" },
  cleaning: { en: "Cleaning", ja: "清掃", kind: "ordinary" },
  office: { en: "Office / admin / IT support", ja: "一般事務", kind: "ordinary" },
  language_teacher: { en: "Language teacher (eikaiwa, school)", ja: "語学講師", kind: "skilled" },
  interpreter_translator: { en: "Interpreter / translator", ja: "通訳・翻訳", kind: "skilled" },
  tutor: { en: "Private tutor (katei kyoshi)", ja: "家庭教師", kind: "skilled" },
  delivery_employee: { en: "Delivery as an employee (shift contract)", ja: "配達（雇用）", kind: "ordinary" },
  delivery_gig: { en: "App delivery as a contractor (Uber Eats, Wolt, Demae-can…)", ja: "配達（業務委託・アプリ）", kind: "gig_verifiable" },
  freelance: { en: "Freelance / self-employed with no fixed hours (writing, design, video, consulting)", ja: "個人事業主・業務委託（稼働時間が不明確）", kind: "freelance" },
  internship: { en: "Paid internship over 28 hours a week", ja: "インターンシップ（週28時間超）", kind: "internship" },
  pachinko: { en: "Pachinko / pachislot parlor (any role, incl. cleaning)", ja: "ぱちんこ店", kind: "fuzoku_45" },
  mahjong: { en: "Mahjong parlor", ja: "まあじゃん屋", kind: "fuzoku_45" },
  game_center: { en: "Game center / arcade licensed under the Entertainment Business Act", ja: "ゲームセンター（風営法5号許可）", kind: "fuzoku_45" },
  hostess_bar: { en: "Hostess/host club, snack, cabaret, girls bar with 'hosting' (settai), low-light bar", ja: "キャバクラ・ホスト・スナック等（接待飲食・低照度・区画席）", kind: "fuzoku_hosting" },
  nightclub: { en: "Nightclub open after midnight with entertainment (tokutei yūkō)", ja: "ナイトクラブ等（特定遊興飲食店）", kind: "nightclub" },
  adult: { en: "Adult / sex industry (incl. online and phone services)", ja: "性風俗関連特殊営業", kind: "adult" },
};

export const PERMISSIONS = ["none", "comprehensive", "individual", "unknown"] as const;
export type Permission = (typeof PERMISSIONS)[number];

export type Verdict = "ok" | "ok_if_hours" | "apply_first" | "individual_permission" | "status_change" | "not_allowed" | "no_restriction";

export const VERDICT_LABEL: Record<Verdict, string> = {
  ok: "Allowed",
  ok_if_hours: "Allowed, but over the hour limit",
  apply_first: "Get permission first",
  individual_permission: "Needs individual permission",
  status_change: "Needs a status change",
  not_allowed: "Not allowed",
  no_restriction: "No immigration limit",
};

export class RuleInputError extends Error {}

export type CheckInput = {
  status: Status;
  job: Job;
  permission?: Permission;
  /** Total hours per week across ALL side jobs. */
  weeklyHours?: number | null;
  /** Students only: the school's official long vacation (学則で定める長期休業期間). */
  longVacation?: boolean;
  /** Optional day-by-day hours (all jobs combined). Suffix "v" marks a long-vacation day for students, e.g. "8v,8v,6,4". */
  dailyHours?: string | null;
  /** Students: still enrolled and attending (not graduated, withdrawn or on leave). */
  enrolled?: boolean;
  /** Freelance / business: has employees, an office, or a company. */
  hasEmployeesOrOffice?: boolean;
  /** Internship: final-year undergrad with ~90%+ credits, or final-year master's/PhD, or credit-bearing practicum. */
  internshipEligible?: boolean;
  /** Work visa: the side job is the same kind of work your own status covers. */
  sameCategoryWork?: boolean;
};

export const SOURCES = [
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00045.html",
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00003.html",
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00004.html",
  "https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00002.html",
  "https://www.moj.go.jp/isa/10_00274.html",
  "https://www.moj.go.jp/isa/applications/procedures/16-8.html",
  "https://www.moj.go.jp/isa/applications/procedures/shikakugai_00001.html",
  "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/jigyounushi/seido/anteikyoku/gairou/980908gai01.htm",
  "https://www.studyinjapan.go.jp/en/work-in-japan/part-time-jobs/",
] as const;

export const DISCLAIMER =
  "Educational guide, not legal or immigration advice, not affiliated with the Immigration Services Agency of Japan (ISA). Only the permission stamp on your residence card / passport and the ISA decide what you may do. Unauthorized work can lead to refusal of renewal, criminal penalties and deportation, and employers can be punished too. Confirm with your Regional Immigration Services Bureau, the Immigration Information Center (外国人在留総合インフォメーションセンター, 0570-013904), your school, or a licensed gyoseishoshi before you start.";

const CAPPED: Status[] = ["student", "dependent", "designated_dependent", "job_hunting"];

type HoursResult = {
  weeklyLimit: number | null;
  dailyLimitOnVacation: number | null;
  enteredWeekly: number | null;
  withinLimit: boolean | null;
  note: string;
  windows?: { from: number; to: number; hours: number; termHours: number; ok: boolean }[];
  worstWindow?: { from: number; to: number; hours: number } | null;
  overDays?: number[];
};

function parseDaily(raw: string): { h: number; v: boolean }[] {
  const parts = raw.split(/[,\s/|]+/).filter(Boolean);
  if (parts.length > 62) throw new RuleInputError("dailyHours: at most 62 days.");
  return parts.map((p, i) => {
    const m = /^(\d+(?:\.\d+)?)(v)?$/i.exec(p.trim());
    if (!m) throw new RuleInputError(`dailyHours: day ${i + 1} "${p}" is not a number (use e.g. 4 or 8v for a long-vacation day).`);
    const h = Number(m[1]);
    if (h > 24) throw new RuleInputError(`dailyHours: day ${i + 1} has more than 24 hours.`);
    return { h, v: !!m[2] };
  });
}

function checkHours(status: Status, weekly: number | null | undefined, longVacation: boolean, daily: string | null | undefined): HoursResult {
  if (!CAPPED.includes(status)) {
    return { weeklyLimit: null, dailyLimitOnVacation: null, enteredWeekly: weekly ?? null, withinLimit: null, note: "No 28-hour immigration cap for this status (labor law still applies)." };
  }
  const isStudent = status === "student";
  const base: HoursResult = {
    weeklyLimit: 28,
    dailyLimitOnVacation: isStudent ? 8 : null,
    enteredWeekly: weekly ?? null,
    withinLimit: null,
    note: isStudent
      ? "28 hours in any 7-day period, all jobs combined. During your school's official long vacation (in its rules, 学則): up to 8 hours a day instead (labor law usually caps a normal week at 40 hours)."
      : "28 hours in any 7-day period, all jobs combined. No long-vacation exception for this status.",
  };
  if (daily && daily.trim()) {
    const days = parseDaily(daily);
    if (!isStudent && days.some((d) => d.v)) throw new RuleInputError("dailyHours: the 'v' (long vacation) marker applies to the Student status only.");
    const overDays = days.map((d, i) => (d.v && d.h > 8 ? i + 1 : 0)).filter(Boolean);
    const windows: HoursResult["windows"] = [];
    const n = days.length;
    const span = Math.min(7, n);
    for (let i = 0; i + span <= n; i++) {
      const w = days.slice(i, i + span);
      const hours = w.reduce((a, d) => a + d.h, 0);
      const termHours = w.filter((d) => !d.v).reduce((a, d) => a + d.h, 0);
      const allVacation = w.every((d) => d.v);
      const ok = allVacation ? true : hours <= 28;
      windows.push({ from: i + 1, to: i + span, hours, termHours, ok });
    }
    const worst = windows.filter((w) => !days.slice(w.from - 1, w.to).every((d) => d.v)).sort((a, b) => b.hours - a.hours)[0] ?? null;
    const okAll = windows.every((w) => w.ok) && overDays.length === 0;
    const mixed = windows.some((w) => !w.ok && days.slice(w.from - 1, w.to).some((d) => d.v));
    return {
      ...base,
      note: mixed
        ? base.note + " A 7-day stretch that mixes vacation and term days is counted strictly here (all its hours against 28); ask your school or bureau how they count the switch-over week."
        : base.note,
      enteredWeekly: worst ? worst.hours : weekly ?? null,
      withinLimit: okAll,
      windows,
      worstWindow: worst ? { from: worst.from, to: worst.to, hours: worst.hours } : null,
      overDays,
    };
  }
  if (weekly === null || weekly === undefined) return base;
  if (weekly < 0 || weekly > 168) throw new RuleInputError("weeklyHours must be between 0 and 168.");
  if (isStudent && longVacation) {
    return { ...base, withinLimit: weekly <= 56, note: base.note + " Long vacation: keep every day at 8 hours or less." };
  }
  return { ...base, withinLimit: weekly <= 28 };
}

const ISA_INFO = "Immigration Information Center (外国人在留総合インフォメーションセンター) 0570-013904, weekdays 8:30-17:15";

export function checkWork(input: CheckInput) {
  const { status, job } = input;
  if (!(STATUSES as readonly string[]).includes(status)) throw new RuleInputError(`Invalid status. Allowed: ${STATUSES.join(", ")}`);
  if (!(JOBS as readonly string[]).includes(job)) throw new RuleInputError(`Invalid job. Allowed: ${JOBS.join(", ")}`);
  const permission: Permission = input.permission ?? "unknown";
  const info = JOB_INFO[job];
  const kind = info.kind;
  const enrolled = input.enrolled !== false;
  const hours = checkHours(status, input.weeklyHours, !!input.longVacation, input.dailyHours);

  let verdict: Verdict = "ok";
  let permissionNeeded: "none" | "comprehensive" | "individual" | "status_change" | "not_available" = "comprehensive";
  let headline = "";
  let summary = "";
  const conditions: string[] = [];
  const steps: string[] = [];
  const warnings: string[] = [];
  const documents: string[] = [];

  const fuzokuNote =
    "The ban covers every role at the venue, including dishwashing, cleaning, kitchen and reception, not just serving guests.";

  const sl = STATUS_LABEL[status].en;

  if (status === "unrestricted") {
    verdict = "no_restriction";
    permissionNeeded = "none";
    headline = "No immigration work limit";
    summary = `${sl}: these statuses (別表第二) have no work restrictions, so no permission for activities outside status is needed and the 28-hour cap does not apply. Labor law, the Entertainment Business Act (age 18+, licensed venues) and tax rules still apply.`;
    if (kind === "adult") warnings.push("Legal only at properly notified businesses and for adults; immigration status is not the issue here, other laws are.");
  } else if (status === "temporary_visitor") {
    verdict = "not_allowed";
    permissionNeeded = "not_available";
    headline = "Tourists can't take paid work in Japan";
    summary = "Temporary Visitor (短期滞在) does not allow paid work, and permission for activities outside status is normally not granted for it. You need a different status of residence (for example Working Holiday if your country has an agreement).";
  } else if (status === "specified_skilled" || status === "technical_intern") {
    verdict = "not_allowed";
    permissionNeeded = "not_available";
    headline = "Side jobs are generally not allowed on this status";
    summary = `${sl}: you may only do the work at the employer/plan in your designation. ISA's general rule says activities of Specified Skilled Worker and Technical Intern Training don't qualify for permission outside status, so a side job (part-time or freelance) is generally not permitted.`;
  } else if (status === "working_holiday") {
    if (kind === "fuzoku_45" || kind === "fuzoku_hosting" || kind === "nightclub" || kind === "adult") {
      verdict = "not_allowed";
      permissionNeeded = "not_available";
      headline = "Working Holiday excludes entertainment-business venues";
      summary = `Working Holiday lets you work freely, but the designation excludes work at businesses regulated by the Entertainment Business Act (風俗営業 etc.). ${info.en} is one of them. ${fuzokuNote}`;
    } else {
      verdict = "ok";
      permissionNeeded = "none";
      headline = "Allowed on Working Holiday";
      summary = "Working Holiday (特定活動) allows incidental paid work with no 28-hour cap and no separate permission, except at entertainment-business venues (風俗営業 etc.). Check the designation paper (指定書) in your passport.";
    }
  } else if (status === "work_visa") {
    if (kind === "fuzoku_45" || kind === "fuzoku_hosting" || kind === "nightclub" || kind === "adult") {
      verdict = "not_allowed";
      permissionNeeded = "not_available";
      headline = "Not allowed: entertainment-business venue";
      summary = `Permission outside status is never granted for work at 風俗営業 / 性風俗 venues. ${fuzokuNote}`;
    } else if (input.sameCategoryWork) {
      verdict = "ok";
      permissionNeeded = "none";
      headline = "Likely within your own status (no permission needed)";
      summary = "If the side job is the same kind of work your status covers (for example an engineer doing other engineering work), it is part of your own status of residence and needs no permission outside status. Tell your employer if your contract requires it, and report a new contracting organization within 14 days if it is a new main employer.";
      warnings.push("Whether the work really fits your status is ISA's call. Unsure? Apply for a Certificate of Authorized Employment (就労資格証明書) or ask the bureau.");
    } else if (kind === "skilled" || kind === "freelance" || job === "office") {
      verdict = "individual_permission";
      permissionNeeded = "individual";
      headline = "Needs individual permission first";
      summary = `With a work visa, work that belongs to a different work status (for example a Professor teaching at an eikaiwa, which is Humanities work) needs individual permission (個別許可) naming the employer, before you start. Your main employer must consent.`;
      documents.push("Application form (資格外活動許可申請書)", "Document describing the side job: employer, duties, hours, pay (任意様式)", "Residence card and passport");
    } else {
      verdict = "not_allowed";
      permissionNeeded = "not_available";
      headline = "Simple labor side jobs aren't allowed on a work visa";
      summary = `${info.en} is not an activity of any work status (it's 'simple labor'), and permission outside status for work-visa holders only covers activities that fit another work status. The comprehensive 28-hour permission is for students and dependents, not for you. So this side job is generally not permitted.`;
    }
  } else {
    // student, dependent, designated_dependent, job_hunting
    if (status === "student" && !enrolled) {
      verdict = "not_allowed";
      permissionNeeded = "not_available";
      headline = "Not while you're not studying";
      summary = "Permission outside status depends on actually doing your student activities. After graduation, withdrawal, expulsion or during a leave of absence you can't rely on it. Graduates who keep job hunting must change to Designated Activities (job hunting) and get a new permission.";
    } else if (kind === "adult" || kind === "fuzoku_hosting" || kind === "nightclub") {
      verdict = "not_allowed";
      permissionNeeded = "not_available";
      headline = "Not allowed: entertainment-business venue";
      summary = `Every permission outside status excludes 風俗営業 (hostess/host clubs, snacks with settai, low-light bars), 特定遊興飲食店 (late-night clubs) and the sex industry. ${fuzokuNote}`;
    } else if (kind === "fuzoku_45") {
      if (status === "dependent") {
        verdict = "individual_permission";
        permissionNeeded = "individual";
        headline = "Allowed since 2026-10-01 with individual permission";
        summary = `New from 2026-10-01: Dependent (家族滞在) holders only may work at a licensed pachinko parlor, mahjong parlor or game center (風営法 2条1項4号・5号) with an individual permission for that venue, even if they already have the 28-hour comprehensive permission. You can't start until the permission is granted. All side jobs together must stay at 28 hours a week or less.`;
        conditions.push(
          "Venue holds an Entertainment Business Act license for category 4 (pachinko/mahjong) or 5 (game center) only.",
          "Employer signs a pledge: follows foreign-employment reporting rules, recommends the Tokutei Zairyu Card (特定在留カード) to foreign staff, and regularly checks your total side-job hours stay within 28 a week.",
          "You sign a pledge too; total of all side jobs (comprehensive + individual) is 28 hours a week or less.",
          "Your main activity (living as a dependent) isn't hindered, and your conduct is good.",
        );
        documents.push(
          "Application form (資格外活動許可申請書)",
          "Document describing duties, hours and pay (任意様式)",
          "Employer pledge (勤務先作成用誓約書)",
          "Your pledge (申請人作成用誓約書)",
          "Copy of the venue's business license (営業許可証) under category 4 or 5",
          "Document showing your other side jobs' hours (total ≤ 28 h/week)",
        );
      } else {
        verdict = "not_allowed";
        permissionNeeded = "not_available";
        headline = status === "student" ? "Students still can't work at pachinko or game centers" : "Not allowed on this status";
        summary = `The 2026-10-01 change only opened pachinko, mahjong and licensed game centers to the Dependent (家族滞在) status. ${sl} is explicitly not covered, so these venues stay off-limits. ${fuzokuNote}`;
      }
      if (job === "game_center") warnings.push("A small game corner inside a supermarket or mall may not need an Entertainment Business Act license. If the venue has no 風営法 license, it's ordinary work; ask the employer to show the license status.");
    } else if (kind === "internship") {
      if (status !== "student") {
        verdict = "individual_permission";
        permissionNeeded = "individual";
        headline = "Over 28 hours needs individual permission";
        summary = "Work beyond 28 hours a week is outside the comprehensive permission. It needs individual permission, which is granted only if your main activity isn't hindered (for dependents: no longer than half your period of stay). If it becomes your real purpose, change status instead.";
      } else if (input.internshipEligible) {
        verdict = "individual_permission";
        permissionNeeded = "individual";
        headline = "Possible with individual permission";
        summary = "Students may get individual permission for a job-hunting internship over 28 hours a week if they're in the final year of a university (about 90%+ of credits done) or the final year of a master's/PhD, or if it's a credit-bearing practicum closely tied to their major.";
        documents.push("Application form", "Certificate or contract from the host company (duties, period, hours, place, pay)", "Certificate of enrollment", "Transcript showing credits (undergraduates)");
      } else {
        verdict = "not_allowed";
        permissionNeeded = "not_available";
        headline = "Keep it to 28 hours a week";
        summary = "Paid internships over 28 hours a week are only permitted for final-year students (undergrad ~90%+ credits, final-year master's/PhD) or credit-bearing practicums. Otherwise stay within the 28-hour comprehensive limit.";
      }
    } else if (kind === "freelance") {
      if (input.hasEmployeesOrOffice) {
        verdict = "status_change";
        permissionNeeded = "status_change";
        headline = "That's a business: change to Business Manager";
        summary = "Setting up a company, hiring staff or opening an office goes beyond permission outside status. ISA says it needs a change to Business Manager (経営・管理).";
      } else {
        verdict = "individual_permission";
        permissionNeeded = "individual";
        headline = "Freelance with unclear hours needs individual permission";
        summary = "If you're self-employed or on a service/contract deal (業務委託・請負) where your working hours can't be objectively confirmed, the comprehensive permission isn't enough; you need individual permission. If the contract fixes standard hours clearly, the comprehensive permission is enough.";
        documents.push("Application form", "Document explaining the business plan or contract (任意様式)");
        if (status === "student") conditions.push("For students, individual permission covers jobs closely related to students (language teacher, interpreter, tutor), jobs students normally do, or startup preparation.");
      }
    } else {
      // ordinary, skilled, gig_verifiable
      if (permission === "none") {
        verdict = "apply_first";
        permissionNeeded = "comprehensive";
        headline = "Allowed once you get the 28-hour permission";
        summary = `${info.en} is fine on ${sl} with the comprehensive permission (包括許可): up to 28 hours a week${status === "student" ? " (8 hours a day in official long vacations)" : ""}, no entertainment-business venues. Apply first (no fee); you can't work until it's granted.`;
      } else if (permission === "individual") {
        verdict = "ok";
        headline = "Check your individual permission covers this job";
        summary = "An individual permission only covers the employer and duties written on it. A new employer needs the comprehensive permission or another individual permission.";
      } else {
        verdict = "ok";
        headline = "Allowed with the 28-hour permission";
        summary = `${info.en} is fine on ${sl} if your residence card says 許可：原則週28時間以内・風俗営業等の従事を除く (the comprehensive permission). Keep all side jobs together within 28 hours in any 7-day period${status === "student" ? ", or 8 hours a day during your school's official long vacation" : ""}.`;
      }
      if (kind === "gig_verifiable") {
        conditions.push("ISA: contractor delivery paid per job counts under the comprehensive permission only if your working hours can be objectively confirmed (for example app log-in records). Keep those records; app hours count toward the 28.");
        warnings.push("Platforms set their own rules and may refuse some statuses (for example Student); that's the platform's policy, not ISA's.");
      }
      if (job === "izakaya_bar") conditions.push("Fine only if staff don't 'host' guests (sitting with them, pouring drinks one-on-one, duet karaoke). A bar that hosts is 風俗営業 (category 1) and off-limits.");
      if (permission === "unknown") steps.push("Look at the back of your residence card: the 資格外活動許可欄 shows 許可：原則週28時間以内・風俗営業等の従事を除く if you have the comprehensive permission.");
    }
  }

  if (hours.withinLimit === false && (verdict === "ok" || verdict === "apply_first" || verdict === "individual_permission")) {
    verdict = verdict === "individual_permission" ? verdict : "ok_if_hours";
    headline = "Over the hour limit";
    warnings.unshift(
      hours.overDays && hours.overDays.length
        ? `More than 8 hours on long-vacation day(s) ${hours.overDays.join(", ")}.`
        : `${hours.enteredWeekly} hours in a 7-day period is over the 28-hour limit (all side jobs combined).`,
    );
    summary += " But your hours break the limit, so cut them before you work.";
  }

  if (CAPPED.includes(status) && verdict !== "not_allowed") {
    steps.push("Count every side job together, and check any 7 consecutive days, not just Monday to Sunday.");
  }
  if (verdict === "apply_first" || verdict === "individual_permission") {
    steps.push(
      "Apply at the Regional Immigration Services Bureau for your address (no fee; standard processing 2 weeks to 2 months). Students arriving for 3+ months can get the comprehensive permission at the airport.",
      "Don't start work until the permission sticker or permission document is issued.",
    );
    if (!documents.length) documents.push("Application form (資格外活動許可申請書)", "Residence card and passport");
  }
  if (status === "student" && verdict !== "not_allowed") warnings.push("Low attendance because of part-time work is a common reason students' renewals are refused.");
  if (verdict === "not_allowed" || verdict === "ok_if_hours") {
    warnings.push("Working without permission or over the limit can mean refusal of renewal, criminal penalties and deportation; employers face the crime of facilitating illegal work (不法就労助長罪).");
  }
  steps.push(`Unsure? Ask your bureau, your school (students) or the ${ISA_INFO}.`);

  return {
    rulesAsOf: RULES_AS_OF,
    verdict,
    verdictLabel: VERDICT_LABEL[verdict],
    headline,
    summary,
    status,
    statusLabel: STATUS_LABEL[status],
    job,
    jobLabel: { en: info.en, ja: info.ja },
    permissionHeld: permission,
    permissionNeeded,
    hours,
    conditions,
    documents,
    steps,
    warnings,
    sources: [...SOURCES],
  };
}

export type CheckResult = ReturnType<typeof checkWork>;

export const RULES = {
  rulesAsOf: RULES_AS_OF,
  name: "Japan part-time work permission (資格外活動許可) rules",
  legalBasis: "Immigration Control and Refugee Recognition Act art. 19(2); Enforcement Regulation art. 19(5)",
  generalPrinciple: [
    "Main status activity is not hindered and you are actually doing it.",
    "The activity fits a status in Annexed Table I(1)/(2) (except SSW and Technical Intern Training). Not required for the comprehensive permission.",
    "Not illegal; not at 風俗営業, 店舗型性風俗特殊営業 or 特定遊興飲食店 venues, nor in non-store sex, video-transmission or phone-dating businesses.",
    "No detention or hearing notice; good conduct; employer consent where your status is based on a contract.",
  ],
  comprehensive: {
    hours: "28 hours per week (students: 8 hours per day during the school's official long vacation)",
    who: ["Student (留学)", "Dependent (家族滞在)", "Designated Activities: dependent of a foreign national", "Designated Activities: continued job hunting / waiting to join", "Instructor / Engineer-Humanities / Instructor (sports) employed by local governments (within their status)"],
    cardStamp: "許可：原則週28時間以内・風俗営業等の従事を除く",
    contractorWork: "Self-employed delivery etc. paid per job is covered only if hours can be objectively confirmed; otherwise individual permission.",
  },
  individual: [
    "Students: job-hunting internship over 28 h/week (final-year undergrad ~90%+ credits, final-year master's/PhD) or credit-bearing practicum.",
    "Students: language teacher, interpreter, tutor or other student-type jobs, or startup preparation, outside the comprehensive scope.",
    "Self-employed or contract work with hours that can't be objectively confirmed.",
    "Work-visa holders doing work of another work status (e.g. Professor teaching at a language school).",
    "Dependents: work outside the comprehensive scope, for no more than half of the period of stay.",
  ],
  pachinkoChange2026: {
    effective: "2026-10-01",
    who: "Dependent (家族滞在) only. Not Student, not Designated Activities (dependent).",
    venues: "Businesses licensed under 風営法 art. 3(1) for categories 2(1)(iv) (mahjong, pachinko) and (v) (game centers) only",
    requires: ["Individual permission per venue, even with the comprehensive permission", "Employer pledge + applicant pledge", "Copy of the venue's license", "All side jobs ≤ 28 h/week"],
    stillBanned: "Sex-related work (性風俗関連) and category 1-3 venues (hosting, low-light, booth seating)",
    source: "https://www.moj.go.jp/isa/10_00274.html",
  },
  noLimit: ["Permanent Resident", "Spouse or Child of Japanese National", "Spouse or Child of Permanent Resident", "Long-Term Resident"],
  notAvailable: ["Temporary Visitor", "Specified Skilled Worker", "Technical Intern Training"],
  workingHoliday: "Work allowed without separate permission or hour cap, except at 風俗営業 etc. venues (check your 指定書).",
  procedure: { fee: "None", processing: "2 weeks to 2 months", where: "Regional Immigration Services Bureau for your address; students entering for 3+ months can apply at the airport", online: "Only together with a change/extension/acquisition application" },
  statuses: STATUSES.map((s) => ({ id: s, ...STATUS_LABEL[s] })),
  jobs: JOBS.map((j) => ({ id: j, en: JOB_INFO[j].en, ja: JOB_INFO[j].ja, kind: JOB_INFO[j].kind })),
  sources: [...SOURCES],
  disclaimer: DISCLAIMER,
};
