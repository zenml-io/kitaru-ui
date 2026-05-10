const STACK_COLOR_PALETTE = [
	"bg-emerald-500",
	"bg-sky-500",
	"bg-violet-500",
	"bg-amber-500",
	"bg-rose-500",
	"bg-teal-500",
	"bg-indigo-500",
	"bg-orange-500",
] as const;

export function getStackColor(stackKey: string | undefined): string {
	if (!stackKey) return "bg-muted-foreground";
	let hash = 0;
	for (let i = 0; i < stackKey.length; i++) {
		hash = (hash * 31 + stackKey.charCodeAt(i)) | 0;
	}
	const index = Math.abs(hash) % STACK_COLOR_PALETTE.length;
	return STACK_COLOR_PALETTE[index];
}
