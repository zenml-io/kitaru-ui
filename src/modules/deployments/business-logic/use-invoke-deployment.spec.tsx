import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { executionsQueryKeys } from "@/modules/executions/business-logic/executions-queries";
import { invokeDeployment } from "../domain/invoke-deployment";
import { useInvokeDeployment } from "./use-invoke-deployment";

vi.mock("../domain/invoke-deployment", () => ({
	invokeDeployment: vi.fn(),
}));

const mockedInvokeDeployment = vi.mocked(invokeDeployment);

function createWrapper(queryClient: QueryClient) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};
}

describe("useInvokeDeployment", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});
		mockedInvokeDeployment.mockResolvedValue({
			id: "run-1",
			name: "run-1",
			index: 1,
			logSources: [],
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		queryClient.clear();
	});

	it("invalidates both executions query keys on success", async () => {
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useInvokeDeployment("flow-1"), {
			wrapper: createWrapper(queryClient),
		});

		result.current.invokeDeployment({
			deploymentId: "snap-1",
			runConfiguration: { parameters: {} },
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		const invalidatedKeys = invalidateSpy.mock.calls.map(
			(call) => call[0]?.queryKey
		);
		expect(invalidatedKeys).toContainEqual(executionsQueryKeys.all("flow-1"));
		expect(invalidatedKeys).toContainEqual(
			executionsQueryKeys.listWithSnapshots("flow-1")
		);
	});

	it("calls the caller-provided onSuccess after invalidation", async () => {
		const onSuccess = vi.fn();
		const { result } = renderHook(
			() => useInvokeDeployment("flow-1", { onSuccess }),
			{ wrapper: createWrapper(queryClient) }
		);

		result.current.invokeDeployment({
			deploymentId: "snap-1",
			runConfiguration: { parameters: { topic: "hi" } },
		});

		await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
		expect(onSuccess.mock.calls[0][0]).toEqual({
			id: "run-1",
			name: "run-1",
			index: 1,
			logSources: [],
		});
		expect(onSuccess.mock.calls[0][1]).toEqual({
			deploymentId: "snap-1",
			runConfiguration: { parameters: { topic: "hi" } },
		});
	});

	it("exposes invokeDeployment and invokeDeploymentAsync aliases", () => {
		const { result } = renderHook(() => useInvokeDeployment("flow-1"), {
			wrapper: createWrapper(queryClient),
		});
		expect(typeof result.current.invokeDeployment).toBe("function");
		expect(typeof result.current.invokeDeploymentAsync).toBe("function");
	});
});
