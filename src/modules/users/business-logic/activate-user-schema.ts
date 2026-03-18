import { z } from "zod";

export const activateUserSchema = z
	.object({
		username: z.string().min(1),
		password: z.string().min(1),
		password_confirmation: z.string().min(1),
	})
	.refine(
		({ password, password_confirmation }) => {
			return password === password_confirmation;
		},
		{
			path: ["password_confirmation"],
			message: "Passwords do not match.",
		}
	);

export type ActivateUserPayload = z.infer<typeof activateUserSchema>;
