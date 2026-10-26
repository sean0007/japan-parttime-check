import assert from "node:assert/strict";
import test from "node:test";
import { EXAMPLES, EXAMPLE_SHARED, isIndexable, parseShared, resultPath, safeCheck, sharedQuery } from "./share";

test("share link round-trips", () => {
  for (const ex of EXAMPLES) {
    assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(ex))), ex);
    assert.ok(isIndexable(ex));
    assert.ok(safeCheck(ex));
  }
  assert.equal(resultPath(EXAMPLE_SHARED), "/r?s=dependent&j=pachinko&p=comprehensive&h=20");
  const d = { ...EXAMPLE_SHARED, status: "student" as const, job: "restaurant" as const, dailyHours: "8v,8v,4" };
  assert.ok(sharedQuery(d).includes("d=8v,8v,4"));
  assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(d))), d);
});

test("bad share params → null", () => {
  assert.equal(parseShared(new URLSearchParams("s=alien&j=pachinko")), null);
  assert.equal(parseShared(new URLSearchParams("s=student")), null);
});
