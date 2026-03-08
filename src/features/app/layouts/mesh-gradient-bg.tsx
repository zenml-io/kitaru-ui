const palettes = {
	default: {
		blobs: [
			"oklch(94.99% 0.0148 70.89)",
			"oklch(86.20% 0.0538 59.63)",
			"oklch(94.07% 0.0347 70.17)",
			"oklch(70.18% 0.1717 48.81)",
		],
	},
	success: {
		blobs: [
			"oklch(91.28% 0.0266 159.55)",
			"oklch(83.36% 0.0603 158.45)",
			"oklch(89.70% 0.0435 153.64)",
			"oklch(57.74% 0.1079 154.38)",
		],
	},
} as const;

export type MeshGradientVariant = keyof typeof palettes;

export function MeshGradientBg({
	variant = "default",
}: {
	variant?: MeshGradientVariant;
}) {
	const p = palettes[variant];

	return (
		<div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1500 ease-out">
			<div
				className="not-motion-reduce:animate-drift-1 absolute h-[600px] w-[600px] rounded-full opacity-[0.15] blur-[100px] transition-[background-color] duration-1500 ease-out"
				style={{ background: p.blobs[0], top: "10%", left: "20%" }}
			/>
			<div
				className="not-motion-reduce:animate-drift-2 absolute h-[500px] w-[500px] rounded-full opacity-[0.12] blur-[120px] transition-[background-color] duration-1500 ease-out"
				style={{ background: p.blobs[1], top: "40%", right: "10%" }}
			/>
			<div
				className="not-motion-reduce:animate-drift-3 absolute h-[700px] w-[700px] rounded-full opacity-[0.08] blur-[140px] transition-[background-color] duration-1500 ease-out"
				style={{ background: p.blobs[2], bottom: "10%", left: "30%" }}
			/>
			<div
				className="not-motion-reduce:animate-drift-4 absolute h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[80px] transition-[background-color] duration-1500 ease-out"
				style={{ background: p.blobs[3], top: "60%", left: "60%" }}
			/>
		</div>
	);
}
