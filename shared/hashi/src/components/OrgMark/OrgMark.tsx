import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zenml/hashi/primitives/avatar";

interface OrgMarkProps {
	name: string;
	imageSrc: string;
	size?: "sm" | "xl";
}

export function OrgMark({ name, imageSrc, size = "sm" }: OrgMarkProps) {
	const label = `${name} organization`;
	return (
		<Avatar shape="square" size={size}>
			<AvatarImage src={imageSrc} alt={label} />
			<AvatarFallback className="bg-primary text-primary-foreground" />
		</Avatar>
	);
}
