// Compact Kitaru identity mark — the spinning torii ring extracted from the
// full text wordmark. Used inside AppMark's circle tile. Color is driven by
// the parent via `currentColor`. The full text wordmark for splash/login
// surfaces still lives in `kitaru-logo.tsx`.
export function KitaruMarkIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 81 81"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
		>
			<g className="animate-ring-spin origin-[40.5px_40.5px]">
				<path
					d="M40.5 0C18.1325 0 0 18.1325 0 40.5C0 62.8675 18.1325 81 40.5 81C62.8675 81 81 62.8675 81 40.5C81 18.1325 62.8675 0 40.5 0ZM40.5 11.5713C56.4767 11.5713 69.4285 24.5233 69.4287 40.5C69.4287 56.4768 56.4768 69.4287 40.5 69.4287C24.5234 69.4284 11.5723 56.4767 11.5723 40.5C11.5724 24.5235 24.5235 11.5715 40.5 11.5713Z"
					fill="currentColor"
				/>
			</g>
		</svg>
	);
}
