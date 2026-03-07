import { LoginForm } from "@/features/session/ui/login-form";
import { Card, CardContent } from "@/shared/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const querySchema = z.object({
	next: z.string().optional(),
});

export const Route = createFileRoute("/(public)/_mesh/login")({
	validateSearch: querySchema,
	component: RouteComponent,
	head() {
		return {
			meta: [{ title: "Login to Kitaru" }],
		};
	},
});

function RouteComponent() {
	return (
		<Card className="w-full max-w-[400px] shadow-lg">
			<CardContent className="space-y-3 p-8">
				<h2 className="text-center text-lg font-semibold">Sign in to Kitaru</h2>
				<LoginForm />
			</CardContent>
		</Card>
	);
}
