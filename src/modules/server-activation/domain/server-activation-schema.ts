import { z } from "zod";

export const serverActivationSchema = z.object({
	server_name: z.string().min(1, "Server name is required"),
	admin_username: z.string().min(1, "Username is required"),
	admin_password: z.string().min(1, "Admin password is required"),
});

export type ServerActivationPayload = z.infer<typeof serverActivationSchema>;
