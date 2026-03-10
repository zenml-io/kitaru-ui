import { MeshFormCard } from "@/shared/ui/layout/MeshFormCard";
import { LoginFormContainer } from "./LoginFormContainer";

export function LoginPage() {
	return (
		<MeshFormCard title="Sign in to Kitaru">
			<LoginFormContainer />
		</MeshFormCard>
	);
}
