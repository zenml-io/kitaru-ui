import { Button } from "@zenml/hashi/primitives/button";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type CreateUserSuccessProps = {
	username: string;
	userId: string;
	activationToken: string;
};

export function CreateUserSuccessContainer({
	userId,
	activationToken,
	username,
}: CreateUserSuccessProps) {
	const router = useRouter();
	const activationLink = `${window.location.origin}${router.buildLocation({ to: "/activate-user", search: { user: userId, token: activationToken, username: username } }).publicHref}`;

	async function handleCopyLink() {
		try {
			await navigator.clipboard.writeText(activationLink);
			toast.success("Link copied to clipboard");
		} catch {
			toast.error("Failed to copy link");
		}
	}

	return (
		<div className="flex flex-col gap-4 overflow-hidden">
			<p className="text-muted-foreground text-sm">
				User invited successfully. Share the invitation link with the user to
				complete the registration.
			</p>
			<div className="flex items-center gap-2">
				<code className="bg-muted flex h-8 items-center overflow-hidden rounded-md px-3 text-sm">
					<span className="min-w-0 truncate">{activationLink}</span>
				</code>
				<Button variant="outline" size="sm" onClick={handleCopyLink}>
					Copy link
				</Button>
			</div>
		</div>
	);
}
