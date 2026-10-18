import { z } from "zod";
export const MAX_PRACTICE_NAME_LENGTH = 8;
export const practiceCountSchema = z.number().int().min(1).max(5);
const habitSchema = z.object({ name: z.string().trim().min(1).max(30), target: z.string().trim().min(1).max(30) });
export const habitDraftSchema = z.object({
  title: z.string().trim().min(3).max(180),
  habits: z.array(habitSchema).min(1).max(5),
  explanation: z.string().max(2400).optional(),
});
export const identifySchema = z.object({ goal: z.string().trim().min(10).max(1000), practiceCount: practiceCountSchema.default(5) });
// Keep saved/manual panels compatible with their existing names.
export function generatedHabitDraftSchema(practiceCount: number) {
  return habitDraftSchema.extend({ habits: z.array(habitSchema.extend({
    name: z.string().trim().min(1).max(MAX_PRACTICE_NAME_LENGTH).regex(new RegExp("^\\p{L}+$", "u"), "Use one word containing only letters."),
  })).length(practiceCountSchema.parse(practiceCount)) }).refine(
    draft => new Set(draft.habits.map(habit => habit.name.toLocaleLowerCase())).size === draft.habits.length,
    "Practice names must be distinct.",
  );
}
export const habitResponseFormat = {
  type: "json_schema" as const,
  json_schema: { name: "habit_panel", strict: true, schema: {
    type: "object", additionalProperties: false,
    properties: { title: { type: "string" }, habits: { type: "array", items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, target: { type: "string" } }, required: ["name", "target"] } }, explanation: { type: "string" } },
    required: ["title", "habits", "explanation"],
  } },
};
