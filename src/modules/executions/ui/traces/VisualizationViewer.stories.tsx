import type { Meta, StoryObj } from "@storybook/react-vite";
import { VisualizationViewer } from "./VisualizationViewer";
import type { ArtifactVisualization } from "@/modules/checkpoints/domain/visualization";

const meta: Meta<typeof VisualizationViewer> = {
	title: "Executions/Traces/VisualizationViewer",
	component: VisualizationViewer,
	parameters: {
		layout: "padded",
	},
};

export default meta;

type Story = StoryObj<typeof VisualizationViewer>;

const jsonSimpleArtifact: ArtifactVisualization = {
	type: "json",
	value: JSON.stringify({ name: "Alice", age: 30, active: true }, null, 2),
};

const jsonEmbeddedCodeArtifact: ArtifactVisualization = {
	type: "json",
	value: JSON.stringify({
		code: `def process_data(items):
    """Process a list of items and return aggregated results."""
    results = []
    for item in items:
        if item.get('active'):
            transformed = {
                'id': item['id'],
                'label': item['name'].upper(),
                'score': item.get('score', 0) * 1.5,
            }
            results.append(transformed)
    return sorted(results, key=lambda x: x['score'], reverse=True)


if __name__ == '__main__':
    sample = [
        {'id': 1, 'name': 'alpha', 'active': True, 'score': 42},
        {'id': 2, 'name': 'beta', 'active': False, 'score': 99},
        {'id': 3, 'name': 'gamma', 'active': True, 'score': 17},
    ]
    print(process_data(sample))
`,
	}),
};

const markdownArtifact: ArtifactVisualization = {
	type: "markdown",
	value: `# Analysis Report

## Summary

This report covers the **key findings** from the latest run.

The pipeline executed \`process_data\` across 3 datasets.

## Results

| Dataset | Records | Status |
|---------|---------|--------|
| alpha   | 1,200   | ok     |
| beta    | 450     | ok     |
| gamma   | 87      | failed |

## Steps Completed

- Data ingestion from S3
- Schema validation with \`jsonschema\`
- **Transformation** applied to all active records
- Output written to \`output/results.json\`

## Code Used

\`\`\`python
def run():
    data = load()
    result = transform(data)
    save(result)
\`\`\`

Normal paragraph with some **bold text** and inline \`code\` sprinkled in for good measure.
`,
};

const htmlArtifact: ArtifactVisualization = {
	type: "html",
	value: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 16px;
      background: #f9fafb;
      color: #111827;
    }
    h1 { font-size: 1.25rem; margin-bottom: 8px; }
    .bar-container { display: flex; flex-direction: column; gap: 8px; }
    .bar-row { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 80px; font-size: 0.75rem; }
    .bar { height: 20px; border-radius: 4px; background: #6366f1; }
    .bar-value { font-size: 0.75rem; color: #6b7280; }
  </style>
</head>
<body>
  <h1>Bar Chart</h1>
  <div class="bar-container">
    <div class="bar-row">
      <span class="bar-label">Alpha</span>
      <div class="bar" style="width: 80%"></div>
      <span class="bar-value">80%</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Beta</span>
      <div class="bar" style="width: 55%; background: #8b5cf6"></div>
      <span class="bar-value">55%</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Gamma</span>
      <div class="bar" style="width: 30%; background: #a78bfa"></div>
      <span class="bar-value">30%</span>
    </div>
  </div>
</body>
</html>`,
};

const imageArtifact: ArtifactVisualization = {
	type: "image",
	value: "https://picsum.photos/seed/kitaru/800/400",
};

const csvArtifact: ArtifactVisualization = {
	type: "csv",
	value: `id,name,status,score
1,alpha,completed,0.92
2,beta,failed,0.41
3,gamma,completed,0.87
4,delta,running,0.00
5,epsilon,completed,0.76`,
};

export const JsonSimpleObject: Story = {
	args: {
		artifact: jsonSimpleArtifact,
	},
};

export const JsonEmbeddedCode: Story = {
	args: {
		artifact: jsonEmbeddedCodeArtifact,
	},
};

export const Markdown: Story = {
	args: {
		artifact: markdownArtifact,
	},
};

export const Html: Story = {
	args: {
		artifact: htmlArtifact,
	},
};

export const Image: Story = {
	args: {
		artifact: imageArtifact,
	},
};

export const Csv: Story = {
	args: {
		artifact: csvArtifact,
	},
};
