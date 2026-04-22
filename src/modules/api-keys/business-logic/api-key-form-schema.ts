import { z } from "zod";

export const apiKeyFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Please enter a name.")
		.max(50, "Name must be 50 characters or less."),
	description: z.string().max(500, "Description is too long.").optional(),
});

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;
