import { z } from "zod";

export const rotateApiKeyFormSchema = z
	.object({
		enableRetention: z.boolean(),
		retainPeriodMinutes: z.string(),
	})
	.superRefine((values, ctx) => {
		if (!values.enableRetention) return;
		const raw = values.retainPeriodMinutes.trim();
		if (raw === "") {
			ctx.addIssue({
				code: "custom",
				path: ["retainPeriodMinutes"],
				message: "Enter a retention period in minutes.",
			});
			return;
		}
		const parsed = Number(raw);
		if (!Number.isInteger(parsed) || parsed <= 0) {
			ctx.addIssue({
				code: "custom",
				path: ["retainPeriodMinutes"],
				message: "Enter a positive whole number of minutes.",
			});
		}
	});

export type RotateApiKeyFormValues = z.infer<typeof rotateApiKeyFormSchema>;
