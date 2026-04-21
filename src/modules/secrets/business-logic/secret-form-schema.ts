import { z } from "zod";

const secretFormKeySchema = z.object({
	key: z.string(),
	value: z.string(),
});

export const secretFormSchema = z.object({
	name: z.string().trim().min(1, "Please enter a secret name."),
	keys: z.array(secretFormKeySchema).superRefine((keys, ctx) => {
		const nonEmpty = keys.filter((k) => k.key.trim() !== "");
		if (nonEmpty.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Add at least one key.",
			});
			return;
		}
		const seen = new Set<string>();
		keys.forEach((k, index) => {
			const trimmed = k.key.trim();
			if (trimmed === "") return;
			if (seen.has(trimmed)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Duplicate key: "${trimmed}".`,
					path: [index, "key"],
				});
			}
			seen.add(trimmed);
		});
	}),
});

export type SecretFormValues = z.infer<typeof secretFormSchema>;
