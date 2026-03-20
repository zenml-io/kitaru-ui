import { z } from "zod";

export const createUserSchema = z.object({
	username: z.string().min(1, "Username is required"),
	isAdmin: z.boolean(),
});

export type CreateUserFormType = z.infer<typeof createUserSchema>;
