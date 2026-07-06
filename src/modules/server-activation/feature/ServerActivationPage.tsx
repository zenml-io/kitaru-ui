import { MeshFormCard } from "@zenml/shared-kitaru/ui/MeshFormCard";
import { ServerActivationFormContainer } from "./ServerActivationFormContainer";

export function ServerActivationPage() {
	return (
		<MeshFormCard title="Activate server">
			<ServerActivationFormContainer />
		</MeshFormCard>
	);
}
