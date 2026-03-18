import { ActivateUserPageContainer } from "@/modules/users/feature/ActivateUserPageContainer";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const querySchema = z.object({
	user: z.string().min(1),
	username: z.string(),
	token: z.string().min(1),
});

export const Route = createFileRoute("/(public)/_mesh/activate-user")({
	validateSearch: querySchema,
	component: ActivateUserPageContainer,
	head() {
		return {
			meta: [{ title: buildPageTitles("Activate User") }],
		};
	},
});
