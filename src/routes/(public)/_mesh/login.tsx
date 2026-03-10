import { LoginPage } from "@/modules/session/feature/LoginPage";
import { buildPageTitles } from "@/shared/utils/build-page-titles";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const querySchema = z.object({
	next: z.string().optional(),
});

export const Route = createFileRoute("/(public)/_mesh/login")({
	validateSearch: querySchema,
	component: LoginPage,
	head() {
		return {
			meta: [{ title: buildPageTitles("Login") }],
		};
	},
});
