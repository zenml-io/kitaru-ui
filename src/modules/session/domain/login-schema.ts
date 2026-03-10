import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().optional(),
});

export type LoginPayload = z.infer<typeof loginSchema>;
