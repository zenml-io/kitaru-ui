import { z } from "zod";

export const serverActivationSchema = z
	.object({
		server_name: z.string().min(1, "Server name is required"),
		admin_username: z.string().min(1, "Username is required"),
		admin_password: z.string().min(1, "Admin password is required"),
		admin_password_confirmation: z
			.string()
			.min(1, "Please confirm your admin password."),
	})
	.refine(
		({ admin_password, admin_password_confirmation }) => {
			if (!admin_password || !admin_password_confirmation) {
				return true;
			}

			return admin_password === admin_password_confirmation;
		},
		{
			path: ["admin_password_confirmation"],
			message: "Passwords do not match.",
		}
	);

export type ServerActivationPayload = z.infer<typeof serverActivationSchema>;
