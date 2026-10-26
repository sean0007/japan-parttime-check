import { InputError, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, JOBS, PERMISSIONS, RuleInputError, STATUSES, checkWork, type Job, type Permission, type Status } from "./parttime";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-parttime-check.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?status=dependent&job=pachinko&permission=comprehensive&weeklyHours=20";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function s(v: unknown): string | null {
  const f = first(v);
  return f === undefined || f === null || String(f).trim() === "" ? null : String(f).trim();
}
function n(v: unknown, name: string): number | null {
  const raw = s(v);
  if (raw === null) return null;
  const x = Number(raw.replace(/[,_\s]/g, "").replace(/(h|hrs?|hours?|時間)$/i, ""));
  if (!Number.isFinite(x)) throw new InputError(`Not a number: ${name}`);
  return x;
}
function b(v: unknown): boolean | undefined {
  const raw = s(v);
  if (raw === null) return undefined;
  return ["1", "true", "yes", "y", "on"].includes(raw.toLowerCase());
}

const STATUS_ALIASES: Record<string, Status> = {
  ryugaku: "student", college_student: "student", international_student: "student", 留学: "student", 留学生: "student", 文化活動: "student",
  kazoku_taizai: "dependent", family_stay: "dependent", spouse_of_worker: "dependent", 家族滞在: "dependent",
  designated_activities_dependent: "designated_dependent", tokutei_katsudo_dependent: "designated_dependent",
  jobhunting: "job_hunting", job_hunt: "job_hunting", job_seeker: "job_hunting", designated_job_hunting: "job_hunting", 継続就職活動: "job_hunting", 就職活動: "job_hunting",
  engineer: "work_visa", humanities: "work_visa", gijinkoku: "work_visa", ehs: "work_visa", instructor: "work_visa", professor: "work_visa", highly_skilled: "work_visa", work: "work_visa", 技術_人文知識_国際業務: "work_visa", 技人国: "work_visa", 教育: "work_visa", 教授: "work_visa",
  ssw: "specified_skilled", tokutei_gino: "specified_skilled", 特定技能: "specified_skilled",
  titp: "technical_intern", trainee: "technical_intern", ginou_jisshu: "technical_intern", 技能実習: "technical_intern",
  wh: "working_holiday", whv: "working_holiday", ワーキングホリデー: "working_holiday",
  tourist: "temporary_visitor", visitor: "temporary_visitor", short_term: "temporary_visitor", visa_free: "temporary_visitor", 短期滞在: "temporary_visitor",
  permanent_resident: "unrestricted", pr: "unrestricted", permanent: "unrestricted", spouse_of_japanese: "unrestricted", spouse: "unrestricted", long_term_resident: "unrestricted", teijusha: "unrestricted", 永住者: "unrestricted", 日本人の配偶者等: "unrestricted", 定住者: "unrestricted",
};
const JOB_ALIASES: Record<string, Job> = {
  cafe: "restaurant", fast_food: "restaurant", kitchen: "restaurant", 飲食: "restaurant", 飲食店: "restaurant",
  izakaya: "izakaya_bar", bar: "izakaya_bar", 居酒屋: "izakaya_bar",
  konbini: "convenience_store", combini: "convenience_store", コンビニ: "convenience_store",
  shop: "retail", sales: "retail", supermarket: "retail", drugstore: "retail", 販売: "retail",
  ryokan: "hotel", ホテル: "hotel",
  factory: "factory_warehouse", warehouse: "factory_warehouse", 工場: "factory_warehouse", 倉庫: "factory_warehouse",
  cleaner: "cleaning", 清掃: "cleaning",
  admin: "office", it: "office", 事務: "office",
  teacher: "language_teacher", eikaiwa: "language_teacher", english_teacher: "language_teacher", 語学講師: "language_teacher",
  interpreter: "interpreter_translator", translator: "interpreter_translator", translation: "interpreter_translator", 通訳: "interpreter_translator", 翻訳: "interpreter_translator",
  katei_kyoshi: "tutor", 家庭教師: "tutor",
  delivery: "delivery_employee", 配達: "delivery_employee",
  uber_eats: "delivery_gig", ubereats: "delivery_gig", wolt: "delivery_gig", demaecan: "delivery_gig", gig: "delivery_gig",
  freelancer: "freelance", self_employed: "freelance", contractor: "freelance", youtuber: "freelance", 業務委託: "freelance", 個人事業主: "freelance",
  intern: "internship", インターン: "internship",
  pachislot: "pachinko", slot: "pachinko", パチンコ: "pachinko", ぱちんこ: "pachinko",
  麻雀: "mahjong", まあじゃん: "mahjong",
  arcade: "game_center", ゲームセンター: "game_center", ゲーセン: "game_center",
  hostess: "hostess_bar", host_club: "hostess_bar", cabaret: "hostess_bar", kyabakura: "hostess_bar", snack: "hostess_bar", girls_bar: "hostess_bar", キャバクラ: "hostess_bar", スナック: "hostess_bar",
  club: "nightclub", ナイトクラブ: "nightclub",
  sex_work: "adult", fuzoku: "adult", 風俗: "adult",
};
const PERM_ALIASES: Record<string, Permission> = {
  no: "none", false: "none", yes: "comprehensive", true: "comprehensive", "28": "comprehensive", "28h": "comprehensive", blanket: "comprehensive", general: "comprehensive", 包括許可: "comprehensive", 包括: "comprehensive", specific: "individual", 個別許可: "individual", 個別: "individual", not_sure: "unknown", "?": "unknown",
};

function pick<T extends string>(raw: string | null, allowed: readonly T[], aliases: Record<string, T>, name: string, fallback: T | null): T | null {
  if (!raw) return fallback;
  const k = raw.toLowerCase().replace(/[\s\-・]+/g, "_");
  const v = (aliases[k] ?? aliases[raw] ?? k) as T;
  if (!(allowed as readonly string[]).includes(v)) throw new InputError(`Invalid ${name} "${raw}". Allowed: ${allowed.join(", ")}`);
  return v;
}

export function computeCheck(input: Input) {
  try {
    const status = pick(s(input.status ?? input.visa ?? input.residenceStatus), STATUSES, STATUS_ALIASES, "status", null);
    if (!status) throw new InputError(`Missing status. Allowed: ${STATUSES.join(", ")}`);
    const job = pick(s(input.job ?? input.work ?? input.workplace), JOBS, JOB_ALIASES, "job", null);
    if (!job) throw new InputError(`Missing job. Allowed: ${JOBS.join(", ")}`);
    const enrolled = b(input.enrolled);
    return checkWork({
      status,
      job,
      permission: pick(s(input.permission ?? input.perm), PERMISSIONS, PERM_ALIASES, "permission", "unknown")!,
      weeklyHours: n(input.weeklyHours ?? input.hours ?? input.hoursPerWeek, "weeklyHours"),
      dailyHours: s(input.dailyHours ?? input.days),
      longVacation: b(input.longVacation ?? input.vacation) ?? false,
      enrolled: enrolled ?? true,
      hasEmployeesOrOffice: b(input.hasEmployeesOrOffice ?? input.employees) ?? false,
      internshipEligible: b(input.internshipEligible ?? input.finalYear) ?? false,
      sameCategoryWork: b(input.sameCategoryWork ?? input.sameField) ?? false,
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanPartTimeWorkCheck",
    summary: "Can a foreign resident in Japan do this part-time job or side job on their status of residence, which permission (資格外活動許可) is needed, and are their hours within the 28-hour rule?",
    description:
      "Applies the Immigration Services Agency's permission-for-activities-outside-status rules (資格外活動許可, incl. the 2026-10-01 pachinko/mahjong/game-center change for Dependent holders) to one status + job. Returns verdict (ok | ok_if_hours | apply_first | individual_permission | status_change | not_allowed | no_restriction), headline, summary, permissionNeeded (none | comprehensive | individual | status_change | not_available), hours (weeklyLimit 28, dailyLimitOnVacation 8 for students, withinLimit, rolling 7-day windows when dailyHours is given), conditions, documents, steps, warnings, sources, rulesAsOf and disclaimer.",
    params: [
      { name: "status", type: "string", required: true, enum: STATUSES, description: "student (留学), dependent (家族滞在), designated_dependent, job_hunting, work_visa, specified_skilled, technical_intern, working_holiday, temporary_visitor, unrestricted (PR / spouse / long-term resident). Aliases: 留学, 家族滞在, tourist, pr…" },
      { name: "job", type: "string", required: true, enum: JOBS, description: "Kind of work/venue. Aliases: konbini, izakaya, uber_eats, eikaiwa, パチンコ, キャバクラ…" },
      { name: "permission", type: "string", enum: PERMISSIONS, default: "unknown", description: "Permission you already hold: none | comprehensive (28h stamp) | individual | unknown." },
      { name: "weeklyHours", type: "number", description: "Total hours in a 7-day period across ALL side jobs." },
      { name: "dailyHours", type: "string", description: "Optional day-by-day hours, comma separated, all jobs combined; suffix v marks a school long-vacation day (students), e.g. 8v,8v,8v,8v,8v,0,0,4,4. Checks every rolling 7-day window." },
      { name: "longVacation", type: "boolean", default: false, description: "Students: the hours fall in the school's official long vacation (8 h/day rule)." },
      { name: "enrolled", type: "boolean", default: true, description: "Students: still enrolled and attending (false after graduation/withdrawal/leave)." },
      { name: "hasEmployeesOrOffice", type: "boolean", default: false, description: "Freelance: you hire staff, set up a company or rent an office." },
      { name: "internshipEligible", type: "boolean", default: false, description: "Students: final-year undergrad with ~90%+ credits, final-year master's/PhD, or credit-bearing practicum." },
      { name: "sameCategoryWork", type: "boolean", default: false, description: "Work visa: the side job is the same kind of work your own status covers." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan Part-time Work Check",
  nameForModel: "japan_parttime_work_check",
  descriptionForHuman: "Can I work this job on my Japanese visa? 28-hour rule, 資格外活動許可, the new pachinko rule.",
  descriptionForModel:
    "Use when a foreign resident of Japan (student, dependent, job hunter, work visa, SSW, intern, working holiday, tourist, PR) asks whether they may take a part-time job, side job, gig delivery (Uber Eats), freelance work, internship, or work at a pachinko parlor, game center, izakaya or hostess bar; whether they need permission for activities outside status (資格外活動許可, comprehensive vs individual); or whether their hours fit the 28-hours-a-week / 8-hours-a-day-in-vacation rule. Applies ISA rules as of 2026-10-26 incl. the 2026-10-01 change allowing Dependent holders at pachinko/mahjong/game centers with individual permission. Relay the disclaimer (educational, not immigration advice; ISA decides).",
  logo: "/icon.svg",
};
