import { openapiDoc, preflight, staticJson } from "@/lib/agent-api";
import { API_INFO, ENDPOINTS, PUBLIC_URL } from "@/lib/api";

export function GET() {
  const base = openapiDoc(API_INFO, PUBLIC_URL, Object.values(ENDPOINTS)) as {
    paths: Record<string, unknown>;
    [k: string]: unknown;
  };
  base.paths["/api/rules"] = {
    get: {
      operationId: "japanPartTimeWorkRules",
      summary: "Japan part-time work permission rules (資格外活動許可): who may work, comprehensive vs individual permission, 28-hour and 8-hour limits, 2026-10-01 amusement-venue change, sources",
      description: "Returns the rules the checker applies, with ISA sources and disclaimer. No inputs.",
      responses: {
        "200": {
          description: "Rules JSON with rulesAsOf and sources.",
          content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
        },
      },
    },
  };
  return staticJson(base);
}
export const OPTIONS = preflight;
