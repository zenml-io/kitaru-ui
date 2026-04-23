import { Play } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function InvokeButton({
	onClick,
	disabled,
}: {
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<Button size="sm" onClick={onClick} disabled={disabled}>
			<Play className="size-3.5" />
			Invoke
		</Button>
	);
}
