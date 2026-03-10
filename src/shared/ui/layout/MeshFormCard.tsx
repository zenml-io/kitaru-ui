import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/ui/card";

type MeshFormCardProps = {
	children: ReactNode;
	title: string;
};

export function MeshFormCard({ children, title }: MeshFormCardProps) {
	return (
		<Card className="w-full max-w-[400px] shadow-lg">
			<CardContent className="space-y-3 p-8">
				<h1 className="text-center text-lg font-semibold">{title}</h1>
				{children}
			</CardContent>
		</Card>
	);
}
