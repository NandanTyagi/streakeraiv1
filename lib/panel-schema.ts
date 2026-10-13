import { z } from "zod";
export const habitDraftSchema = z.object({
  title: z.string().trim().min(3).max(180),
  habits: z.array(z.object({ name: z.string().trim().min(1).max(30), target: z.string().trim().min(1).max(30) })).length(5),
  explanation: z.string().max(2400).optional(),
});
export const identifySchema = z.object({ goal: z.string().trim().min(10).max(1000) });
export const habitResponseFormat = {
  type: "json_schema" as const,
  json_schema: { name: "habit_panel", strict: true, schema: {
    type: "object", additionalProperties: false,
    properties: { title: { type: "string" }, habits: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, target: { type: "string" } }, required: ["name", "target"] } }, explanation: { type: "string" } },
    required: ["title", "habits", "explanation"],
  } },
};
