import * as React from "react";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenml/hashi/primitives/avatar";
import type { WorkspaceType } from "@zenml/hashi/lib/state-styles";

interface WorkspaceData {
	slug: string;
	type: WorkspaceType;
	name: string;
}

interface WorkspaceAvatarProps {
	workspace: WorkspaceData;
	/** Proxies directly to the extended shadcn Avatar. */
	size?: "default" | "lg" | "xl" | "2xl";
	/** Optional override for user-uploaded image (future). */
	imageUrl?: string;
	className?: string;
}

// Type-anchored gradients. Each workspace's avatar reflects its own TYPE
// regardless of which theme the surrounding page is in — a Kitaru workspace
// stays orange when viewed from a ZenML-themed org page. Values are tuned to
// the warm/cool palette from Paper artboards 7E1-0 / 743-0.
//
// The zenml stops read from tokens because "the ZenML brand colour" is itself
// brand-dependent: the legacy Pro theme restates them in purple. Kitaru stays
// literal, since Kitaru marks are never theme-bound.
const GRADIENT_BY_TYPE: Record<WorkspaceType, string> = {
	zenml:
		"linear-gradient(135deg, var(--ws-mark-zenml-from) 0%, var(--ws-mark-zenml-mid) 50%, var(--ws-mark-zenml-to) 100%)",
	kitaru:
		"linear-gradient(135deg, oklch(0.82 0.1 70) 0%, oklch(0.74 0.13 55) 50%, oklch(0.7 0.15 35) 100%)",
};

// Per-workspace hue offset stays inside the brand-safe arc, currently ±12°.
// Single source of truth — the modulus is derived (2N+1 buckets) so the
// distribution stays symmetric around 0 if the constant is ever widened.
const MAX_HUE_OFFSET = 12;

function slugHueRotate(slug: string): number {
	// djb2-style hash → small offset in [-MAX_HUE_OFFSET, +MAX_HUE_OFFSET]deg.
	// Stays within the brand family while giving each workspace a
	// recognizable hue.
	let h = 5381;
	for (let i = 0; i < slug.length; i++) {
		h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
	}
	return (Math.abs(h) % (MAX_HUE_OFFSET * 2 + 1)) - MAX_HUE_OFFSET;
}

export function WorkspaceAvatar({
	workspace,
	size = "2xl",
	imageUrl,
	className,
}: WorkspaceAvatarProps) {
	const hue = slugHueRotate(workspace.slug);
	const style: React.CSSProperties = {
		backgroundImage: GRADIENT_BY_TYPE[workspace.type],
		filter: hue !== 0 ? `hue-rotate(${hue}deg)` : undefined,
	};
	return (
		<Avatar shape="square" size={size} className={className}>
			{imageUrl ? <AvatarImage src={imageUrl} alt={workspace.name} /> : null}
			<AvatarFallback style={style} />
		</Avatar>
	);
}
