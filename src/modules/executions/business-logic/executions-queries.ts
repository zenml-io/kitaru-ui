import { queryOptions } from "@tanstack/react-query";
import { fetchExecutions } from "../domain/fetch-executions";
import { fetchExecution } from "../domain/fetch-execution";
import { fetchSteps } from "../domain/fetch-steps";
import { fetchStepArtifacts } from "../domain/step-artifacts";

export const executionsQueryKeys = {
	all: (flowId: string) => ["executions", flowId] as const,
	detail: (execId: string) => ["executions", "detail", execId] as const,
	steps: (execId: string) => ["executions", "steps", execId] as const,
	stepArtifacts: (stepId: string) =>
		["executions", "step-artifacts", stepId] as const,
};

export const executionsQueries = {
	all: (flowId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.all(flowId),
			queryFn: () => fetchExecutions(flowId),
		}),
	detail: (execId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.detail(execId),
			queryFn: () => fetchExecution(execId),
		}),
	steps: (execId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.steps(execId),
			queryFn: () => fetchSteps(execId),
		}),
	stepArtifacts: (stepId: string) =>
		queryOptions({
			queryKey: executionsQueryKeys.stepArtifacts(stepId),
			queryFn: () => fetchStepArtifacts(stepId),
		}),
};
