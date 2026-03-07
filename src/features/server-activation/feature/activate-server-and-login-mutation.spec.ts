import { loginUser } from "@/features/session/domain/mutations/login-mutation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { activateServer } from "../domain/mutations/activate-server-mutation";
import { activateServerAndLogin } from "./activate-server-and-login-mutation";

vi.mock("../domain/mutations/activate-server-mutation", () => ({
	activateServer: vi.fn(),
}));

vi.mock("@/features/session/domain/mutations/login-mutation", () => ({
	loginUser: vi.fn(),
}));

const mockedActivateServer = vi.mocked(activateServer);
const mockedLoginUser = vi.mocked(loginUser);

const payload = {
	server_name: "My Kitaru Server",
	admin_username: "admin",
	admin_password: "secret-password",
};

describe("activateServerAndLogin", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("activates the server first and then logs the user in", async () => {
		const callOrder: string[] = [];
		const loginResponse = {
			access_token: "token",
			token_type: "bearer",
		};

		mockedActivateServer.mockImplementation(async () => {
			callOrder.push("activate");
			return null;
		});

		mockedLoginUser.mockImplementation(async () => {
			callOrder.push("login");
			return loginResponse;
		});

		const result = await activateServerAndLogin(payload);

		expect(result).toBe(loginResponse);
		expect(callOrder).toEqual(["activate", "login"]);
		expect(mockedActivateServer).toHaveBeenCalledWith(payload);
		expect(mockedLoginUser).toHaveBeenCalledWith({
			username: payload.admin_username,
			password: payload.admin_password,
		});
	});

	it("propagates activation errors and does not attempt login", async () => {
		const error = new Error("Activation failed");
		mockedActivateServer.mockRejectedValue(error);

		await expect(activateServerAndLogin(payload)).rejects.toBe(error);
		expect(mockedLoginUser).not.toHaveBeenCalled();
	});

	it("propagates login errors after successful activation", async () => {
		const error = new Error("Login failed");
		mockedActivateServer.mockResolvedValue(null);
		mockedLoginUser.mockRejectedValue(error);

		await expect(activateServerAndLogin(payload)).rejects.toBe(error);
		expect(mockedActivateServer).toHaveBeenCalledWith(payload);
		expect(mockedLoginUser).toHaveBeenCalledWith({
			username: payload.admin_username,
			password: payload.admin_password,
		});
	});
});
