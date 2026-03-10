import { MeshFormCard } from "@/shared/ui/layout/MeshFormCard";
import { ServerActivationFormContainer } from "./ServerActivationFormContainer";

export function ServerActivationPage() {
	return (
		<MeshFormCard title="Activate server">
			<ServerActivationFormContainer />
		</MeshFormCard>
	);
}
