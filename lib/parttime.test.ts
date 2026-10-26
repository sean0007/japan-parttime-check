import assert from "node:assert/strict";
import test from "node:test";
import { JOBS, RULES, RuleInputError, STATUSES, checkWork } from "./parttime";

test("dependent at pachinko → individual permission (2026-10-01 change)", () => {
  const r = checkWork({ status: "dependent", job: "pachinko", permission: "comprehensive", weeklyHours: 20 });
  assert.equal(r.verdict, "individual_permission");
  assert.equal(r.permissionNeeded, "individual");
  assert.ok(r.documents.some((d) => d.includes("pledge")));
  assert.ok(r.sources.includes("https://www.moj.go.jp/isa/10_00274.html"));
  assert.equal(r.hours.withinLimit, true);
});

test("student at pachinko / game center → not allowed", () => {
  for (const job of ["pachinko", "mahjong", "game_center"] as const) {
    assert.equal(checkWork({ status: "student", job, permission: "comprehensive" }).verdict, "not_allowed");
    assert.equal(checkWork({ status: "designated_dependent", job }).verdict, "not_allowed");
  }
});

test("hosting venues banned for everyone with a cap, even dependents", () => {
  for (const status of ["student", "dependent", "designated_dependent", "job_hunting", "work_visa", "working_holiday"] as const) {
    for (const job of ["hostess_bar", "nightclub", "adult"] as const) assert.equal(checkWork({ status, job }).verdict, "not_allowed", `${status}/${job}`);
  }
});

test("student konbini: ok within 28, over at 30, needs permission if none", () => {
  assert.equal(checkWork({ status: "student", job: "convenience_store", permission: "comprehensive", weeklyHours: 28 }).verdict, "ok");
  const over = checkWork({ status: "student", job: "convenience_store", permission: "comprehensive", weeklyHours: 30 });
  assert.equal(over.verdict, "ok_if_hours");
  assert.equal(over.hours.withinLimit, false);
  assert.equal(checkWork({ status: "student", job: "convenience_store", permission: "none" }).verdict, "apply_first");
});

test("student long vacation: 40 h ok, 8h/day rule via dailyHours", () => {
  assert.equal(checkWork({ status: "student", job: "restaurant", permission: "comprehensive", weeklyHours: 40, longVacation: true }).hours.withinLimit, true);
  const d = checkWork({ status: "student", job: "restaurant", permission: "comprehensive", dailyHours: "8v,8v,8v,8v,8v,0v,0v" });
  assert.equal(d.verdict, "ok");
  const nine = checkWork({ status: "student", job: "restaurant", permission: "comprehensive", dailyHours: "9v,8v,8v" });
  assert.deepEqual(nine.hours.overDays, [1]);
  assert.equal(nine.verdict, "ok_if_hours");
  // vacation ends: window mixing vacation and term days counts all hours against 28
  const mixed = checkWork({ status: "student", job: "restaurant", permission: "comprehensive", dailyHours: "8v,8v,8v,4,4,0,0" });
  assert.equal(mixed.hours.withinLimit, false);
});

test("rolling 7-day window catches split weeks", () => {
  const r = checkWork({ status: "dependent", job: "office", permission: "comprehensive", dailyHours: "0,0,0,0,7,7,7,7,0,0,0" });
  assert.equal(r.hours.withinLimit, true);
  const r2 = checkWork({ status: "dependent", job: "office", permission: "comprehensive", dailyHours: "0,0,0,8,8,8,0,8,0,0" });
  assert.equal(r2.hours.withinLimit, false);
  assert.equal(r2.hours.worstWindow?.hours, 32);
});

test("v marker only for students", () => {
  assert.throws(() => checkWork({ status: "dependent", job: "office", dailyHours: "8v" }), RuleInputError);
  assert.throws(() => checkWork({ status: "student", job: "office", dailyHours: "8,x" }), RuleInputError);
  assert.throws(() => checkWork({ status: "student", job: "office", weeklyHours: 200 }), RuleInputError);
});

test("gig delivery ok with conditions, freelance needs individual, business → status change", () => {
  const g = checkWork({ status: "student", job: "delivery_gig", permission: "comprehensive" });
  assert.equal(g.verdict, "ok");
  assert.ok(g.conditions.some((c) => c.includes("objectively")));
  assert.equal(checkWork({ status: "dependent", job: "freelance" }).verdict, "individual_permission");
  assert.equal(checkWork({ status: "dependent", job: "freelance", hasEmployeesOrOffice: true }).verdict, "status_change");
});

test("work visa: konbini not allowed, eikaiwa individual, same field ok", () => {
  assert.equal(checkWork({ status: "work_visa", job: "convenience_store" }).verdict, "not_allowed");
  assert.equal(checkWork({ status: "work_visa", job: "language_teacher" }).verdict, "individual_permission");
  assert.equal(checkWork({ status: "work_visa", job: "office", sameCategoryWork: true }).verdict, "ok");
});

test("SSW, TITP, tourist not allowed; PR no restriction; working holiday free except fuzoku", () => {
  assert.equal(checkWork({ status: "specified_skilled", job: "restaurant" }).verdict, "not_allowed");
  assert.equal(checkWork({ status: "technical_intern", job: "restaurant" }).verdict, "not_allowed");
  assert.equal(checkWork({ status: "temporary_visitor", job: "restaurant" }).verdict, "not_allowed");
  const pr = checkWork({ status: "unrestricted", job: "pachinko", weeklyHours: 50 });
  assert.equal(pr.verdict, "no_restriction");
  assert.equal(pr.hours.weeklyLimit, null);
  assert.equal(checkWork({ status: "working_holiday", job: "restaurant", weeklyHours: 40 }).verdict, "ok");
  assert.equal(checkWork({ status: "working_holiday", job: "pachinko" }).verdict, "not_allowed");
});

test("internships and graduates", () => {
  assert.equal(checkWork({ status: "student", job: "internship", internshipEligible: true }).verdict, "individual_permission");
  assert.equal(checkWork({ status: "student", job: "internship" }).verdict, "not_allowed");
  assert.equal(checkWork({ status: "student", job: "restaurant", enrolled: false }).verdict, "not_allowed");
});

test("every status × job combination returns a full result", () => {
  for (const status of STATUSES) for (const job of JOBS) {
    const r = checkWork({ status, job, weeklyHours: 10 });
    assert.ok(r.headline && r.summary && r.steps.length, `${status}/${job}`);
    assert.equal(r.rulesAsOf, "2026-10-26");
  }
  assert.equal(RULES.pachinkoChange2026.effective, "2026-10-01");
});

test("invalid enums throw", () => {
  assert.throws(() => checkWork({ status: "alien" as never, job: "restaurant" }), RuleInputError);
  assert.throws(() => checkWork({ status: "student", job: "astronaut" as never }), RuleInputError);
});
