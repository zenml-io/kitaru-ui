import { z } from "zod";

export const verificationFormSchema = z.object({
	trustDevice: z.boolean(),
});

export type VerificationForm = z.infer<typeof verificationFormSchema>;
