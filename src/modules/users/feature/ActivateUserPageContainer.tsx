import { MeshFormCard } from "@zenml/shared-kitaru/ui/MeshFormCard";
import { ActivateUserFormContainer } from "./ActivateUserFormContainer";

export function ActivateUserPageContainer() {
	return (
		<MeshFormCard title="Activate your user">
			<ActivateUserFormContainer />
		</MeshFormCard>
	);
}
