import { z } from "zod";

export const UpdateProfileFormSchema = z
	.object({
		fullName: z.string().trim(),
		username: z.string().trim(),
		email: z
			.string()
			.trim()
			.pipe(z.union([z.literal(""), z.email()])),
	})
	.refine(
		(data) => {
			return data.fullName !== "" || data.username !== "" || data.email !== "";
		},
		{
			message: "At least one field must be provided.",
		}
	);

export type UpdateProfileForm = z.infer<typeof UpdateProfileFormSchema>;
