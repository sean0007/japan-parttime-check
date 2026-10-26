import assert from "node:assert/strict";
import test from "node:test";
import { apiHandler, openapiDoc, preflight } from "./agent-api";
import { API_DISCLAIMER, API_INFO, ENDPOINTS, EXAMPLE_GET, PUBLIC_URL } from "./api";

const e = ENDPOINTS.check;
const handler = apiHandler(e.compute, { disclaimer: API_DISCLAIMER, docs: `${PUBLIC_URL}/openapi.json`, example: `${PUBLIC_URL}${e.example}` });

test(`GET ${EXAMPLE_GET} → individual permission`, async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${EXAMPLE_GET}`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const body = await res.json();
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.equal(body.verdict, "individual_permission");
  assert.equal(body.hours.weeklyLimit, 28);
  assert.ok(body.sources.length);
});

test("POST JSON body matches GET", async () => {
  const url = new URL(`${PUBLIC_URL}${EXAMPLE_GET}`);
  const post = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(url.searchParams)) }));
  const get = await handler(new Request(url));
  assert.equal(post.status, 200);
  assert.deepEqual(await post.json(), await get.json());
});

test("aliases", async () => {
  const a = await (await handler(new Request(`${PUBLIC_URL}${e.path}?status=${encodeURIComponent("留学")}&job=konbini&permission=yes&hours=${encodeURIComponent("30時間")}`))).json();
  assert.equal(a.status, "student");
  assert.equal(a.job, "convenience_store");
  assert.equal(a.verdict, "ok_if_hours");
  const b = await (await handler(new Request(`${PUBLIC_URL}${e.path}?visa=tourist&work=uber_eats`))).json();
  assert.equal(b.verdict, "not_allowed");
  const c = await (await handler(new Request(`${PUBLIC_URL}${e.path}?status=${encodeURIComponent("家族滞在")}&job=${encodeURIComponent("パチンコ")}`))).json();
  assert.equal(c.verdict, "individual_permission");
});

test("bad inputs → 400 with example", async () => {
  for (const q of ["job=restaurant", "status=student", "status=alien&job=restaurant", "status=student&job=astronaut", "status=student&job=restaurant&weeklyHours=abc", "status=student&job=restaurant&permission=maybe", "status=dependent&job=office&dailyHours=8v"]) {
    const res = await handler(new Request(`${PUBLIC_URL}${e.path}?${q}`));
    assert.equal(res.status, 400, q);
    const body = await res.json();
    assert.equal(body.disclaimer, API_DISCLAIMER);
    assert.ok(body.example);
  }
});

test("malformed JSON body → 400", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{nope" }));
  assert.equal(res.status, 400);
});

test("OPTIONS preflight is CORS open", () => {
  const res = preflight();
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("OpenAPI lists /api/check GET and POST", () => {
  const spec = openapiDoc(API_INFO, PUBLIC_URL, [e]) as { openapi: string; paths: Record<string, { get: { parameters: { name: string }[] }; post: unknown }> };
  assert.ok(spec.openapi.startsWith("3."));
  assert.ok(spec.paths["/api/check"]?.post);
  assert.ok(spec.paths["/api/check"].get.parameters.find((p) => p.name === "dailyHours"));
});
