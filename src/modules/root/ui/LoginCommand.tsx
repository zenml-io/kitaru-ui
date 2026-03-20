import { CopyCommand } from "@/shared/ui/CopyCommand";

export function LoginCommand({ url }: { url: string }) {
	const command = `kitaru login ${url}`;

	return (
		<CopyCommand
			code={command}
			className="border-border text-muted-foreground bg-muted/30 hidden w-full max-w-3xs items-center gap-1 rounded-lg border px-3 py-1.5 !text-xs sm:flex"
		/>
	);
}
