import { z } from "zod";

export const updateAvatarFormSchema = z.object({
	avatarUrl: z.string().trim(),
});

export type UpdateAvatarFormType = z.infer<typeof updateAvatarFormSchema>;
