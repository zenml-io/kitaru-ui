import type { components } from "@zenml/shared-kitaru/api/openapi";

export {
	type KitaruUser,
	userFromApiToDomain,
} from "@zenml/shared-kitaru/api/domain/user";

export type UserUpdate = components["schemas"]["UserUpdate"];

export type CreateUserDialogSuccess = {
	userId: string;
	activationToken: string;
	username: string;
};
