import { z } from "zod";

export const apiKeyFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Please enter a name.")
		.max(255, "Name must be 255 characters or less."),
	description: z.string().max(65535, "Description is too long.").optional(),
});

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;
