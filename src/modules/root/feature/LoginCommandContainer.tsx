import { env } from "../domain/env";
import { LoginCommand } from "../ui/LoginCommand";

export function LoginCommandContainer() {
	const url = env.VITE_API_BASE_URL || env.VITE_BACKEND_URL || location.origin;
	return (
		<div className="px-2 py-1.5">
			<span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
				Login
			</span>
			<div className="mt-1.5 flex items-center gap-1">
				<LoginCommand url={url} />
			</div>
		</div>
	);
}
