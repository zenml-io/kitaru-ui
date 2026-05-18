import { z } from "zod";

export const replayExecutionSchema = z.object({
	skipSuccessfulSteps: z.boolean(),
});

export type ReplayExecutionFormValues = z.infer<typeof replayExecutionSchema>;
