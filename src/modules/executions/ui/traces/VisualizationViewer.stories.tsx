import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ArtifactVisualization } from "@/modules/checkpoints/domain/visualization";
import { VisualizationViewer } from "./VisualizationViewer";

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

const markdownComplianceReportArtifact: ArtifactVisualization = {
	type: "markdown",
	value: `# Compliance Report

## Summary

The latest memory audit found **three material changes** and one follow-up item.

The workflow executed \`collect_policy_changes\`, \`score_risk\`, and \`publish_report\`.

## Findings

| Area | Change | Risk |
|------|--------|------|
| Data retention | Retention window changed from 30 to 45 days | Medium |
| User consent | Consent copy now includes model-assisted review | Low |
| Exports | CSV export now includes run identifier | Low |

## Required Actions

- Notify the data governance owner.
- Update the public changelog entry.
- Re-run the audit after the next deployment.

## Evidence Query

\`\`\`sql
select area, risk, owner
from compliance_findings
where run_id = 'audit-2026-04-18';
\`\`\`

Normal paragraph with **bold emphasis** and inline \`code\` so the extracted Markdown renderer remains covered.
`,
};

const jsonMarkdownEnvelopeArtifact: ArtifactVisualization = {
	type: "json",
	value: JSON.stringify(`# Published Report

The JSON payload is a string envelope. Rendered mode should show this as Markdown, not as a quoted escaped JSON string.

## Highlights

- Report generation completed successfully.
- **Important:** line breaks should be real line breaks.
- Raw mode should still expose the original JSON string literal.

\`\`\`python
print("decoded markdown")
\`\`\``),
};

const jsonPydanticDoubleEncodedArtifact: ArtifactVisualization = {
	type: "json",
	value: JSON.stringify(
		JSON.stringify({
			result: `# Memory Audit Result

The Pydantic-style artifact was double encoded: the outer visualization value is JSON, and the decoded value is another JSON object string.

## Primary Findings

- The \`result\` field is the only Markdown-looking string field.
- It should be promoted as the main report.
- Remaining fields should stay available as collapsed metadata.

## Recommendation

Proceed with manual review of the two medium-risk changes.`,
			usage: {
				prompt_tokens: 1432,
				completion_tokens: 518,
				total_tokens: 1950,
			},
			model: "gpt-5.4-mini",
			request_id: "550e8400-e29b-41d4-a716-446655440000",
		})
	),
};

const jsonPrimitiveNullArtifact: ArtifactVisualization = {
	type: "json",
	value: "null",
};

const jsonPrimitiveNumberArtifact: ArtifactVisualization = {
	type: "json",
	value: "42",
};

const jsonPrimitiveUuidArtifact: ArtifactVisualization = {
	type: "json",
	value: JSON.stringify("550e8400-e29b-41d4-a716-446655440000"),
};

const htmlStyledReportArtifact: ArtifactVisualization = {
	type: "html",
	value: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
		font-family: Inter, system-ui, sans-serif;
      margin: 0;
      padding: 16px;
      background: #f9fafb;
      color: #111827;
    }
    h1 { font-size: 1.25rem; margin-bottom: 8px; }
	.summary { color: #4b5563; font-size: 0.875rem; margin-bottom: 16px; }
    .bar-container { display: flex; flex-direction: column; gap: 8px; }
    .bar-row { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 80px; font-size: 0.75rem; }
    .bar { height: 20px; border-radius: 4px; background: #6366f1; }
    .bar-value { font-size: 0.75rem; color: #6b7280; }
  </style>
</head>
<body>
	<h1>Evaluation Scores</h1>
	<p class="summary">Rendered inside a sandboxed iframe.</p>
  <div class="bar-container">
    <div class="bar-row">
		<span class="bar-label">Accuracy</span>
		<div class="bar" style="width: 92%"></div>
		<span class="bar-value">92%</span>
    </div>
    <div class="bar-row">
		<span class="bar-label">Recall</span>
		<div class="bar" style="width: 81%; background: #8b5cf6"></div>
		<span class="bar-value">81%</span>
    </div>
    <div class="bar-row">
		<span class="bar-label">Precision</span>
		<div class="bar" style="width: 88%; background: #a78bfa"></div>
		<span class="bar-value">88%</span>
    </div>
  </div>
</body>
</html>`,
};

const htmlHostileArtifact: ArtifactVisualization = {
	type: "html",
	value: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body>
	<h1>Hostile HTML fixture</h1>
	<p>This content should be confined to the sandboxed iframe.</p>
	<button onclick="window.top.document.body.dataset.hostileHtmlEscaped = 'false'">
	Attempt parent mutation
	</button>
	<img src="x" onerror="alert('sandbox should block this script path')" />
	<script>
	window.top.document.body.dataset.hostileHtmlEscaped = 'false';
	alert('sandbox should block this script path');
	</script>
</body>
</html>`,
};

const imageArtifact: ArtifactVisualization = {
	type: "image",
	value: "https://picsum.photos/seed/kitaru/800/400",
};

const csvEvalResultsArtifact: ArtifactVisualization = {
	type: "csv",
	value: `id,name,status,score
1,alpha,completed,0.92
2,beta,failed,0.41
3,gamma,completed,0.87
4,delta,running,0.00
5,epsilon,completed,0.76`,
};

const csvMessyArtifact: ArtifactVisualization = {
	type: "csv",
	value: `id,name,note,score
1,Alice,"quoted comma: one, two",0.91
2,Bob,"escaped quote: ""hello""",0.82
3,Carol,"multiline note line 1
multiline note line 2",0.77
4,Dan,,0.66`,
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

export const MarkdownComplianceReport: Story = {
	args: {
		artifact: markdownComplianceReportArtifact,
	},
};

export const JsonMarkdownEnvelope: Story = {
	args: {
		artifact: jsonMarkdownEnvelopeArtifact,
	},
};

export const JsonPydanticDoubleEncoded: Story = {
	args: {
		artifact: jsonPydanticDoubleEncodedArtifact,
	},
};

export const JsonPrimitiveNull: Story = {
	args: {
		artifact: jsonPrimitiveNullArtifact,
	},
};

export const JsonPrimitiveNumber: Story = {
	args: {
		artifact: jsonPrimitiveNumberArtifact,
	},
};

export const JsonPrimitiveUuid: Story = {
	args: {
		artifact: jsonPrimitiveUuidArtifact,
	},
};

export const HtmlStyledReport: Story = {
	args: {
		artifact: htmlStyledReportArtifact,
	},
};

export const HtmlHostile: Story = {
	args: {
		artifact: htmlHostileArtifact,
	},
};

export const CsvEvalResults: Story = {
	args: {
		artifact: csvEvalResultsArtifact,
	},
};

export const CsvMessy: Story = {
	args: {
		artifact: csvMessyArtifact,
	},
};

export const Image: Story = {
	args: {
		artifact: imageArtifact,
	},
};
