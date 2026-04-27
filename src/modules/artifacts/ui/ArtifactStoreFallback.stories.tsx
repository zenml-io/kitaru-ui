import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	DepsMissingArtifactStoreFallback,
	LocalArtifactStoreFallback,
	NoConnectorArtifactStoreFallback,
} from "./ArtifactStoreFallback";

const meta: Meta = {
	title: "Artifacts/ArtifactStoreFallback",
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj;

export const Local: Story = {
	render: () => (
		<LocalArtifactStoreFallback uri="/Users/devs/.config/kitaru/local_stores/default/artifacts/example-run/output.json" />
	),
};

export const LocalNoUri: Story = {
	render: () => <LocalArtifactStoreFallback />,
};

export const LocalLongUri: Story = {
	render: () => (
		<LocalArtifactStoreFallback uri="/Users/devs/.config/kitaru/local_stores/default/artifacts/long_pipeline_name/2026_04_27_run_a3f1c8e9d4b27e1f-output-with-very-long-suffix-name/checkpoint_step_evaluation_outputs/output_artifact_payload_v1.json" />
	),
};

export const NoConnector: Story = {
	render: () => (
		<NoConnectorArtifactStoreFallback uri="s3://kitaru-staging/artifacts/example-run/output.json" />
	),
};

export const NoConnectorNoUri: Story = {
	render: () => <NoConnectorArtifactStoreFallback />,
};

export const NoConnectorLongUri: Story = {
	render: () => (
		<NoConnectorArtifactStoreFallback uri="s3://kitaru-staging-artifacts-prod-us-east-1-bucket/projects/long_pipeline_name/2026_04_27_run_a3f1c8e9d4b27e1f/checkpoint_step_evaluation_outputs/output_artifact_payload_v1.json" />
	),
};

export const DepsMissing: Story = {
	render: () => <DepsMissingArtifactStoreFallback />,
};
