import z from "zod";

export const getScoreResultsSchema = z.object({
  day: z.number(),
  category: z.string(),
});
export type getScoreResultsInput = z.infer<typeof getScoreResultsSchema>;
