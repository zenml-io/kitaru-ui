import figma from "@figma/code-connect";

import { TimelineRow } from "./TimelineRow";

// status and hierarchy are host-supplied presentation in code: status maps to
// node.colorClass (+ accent for cached), hierarchy to hasChildren +
// node.expanded. The badge / nameBadge / accent slot rows shown under the set
// are ReactNode slots the host composes; they have no Figma property.
figma.connect(
	TimelineRow,
	"https://www.figma.com/design/IZhfgAOIPjDObsCtpFKhRY/Hashi-Design-System?node-id=353-1249",
	{
		props: {
			isSelected: figma.boolean("isSelected"),
			colorClass: figma.enum("status", {
				completed: "bg-success",
				running: "bg-warning",
				failed: "bg-destructive",
				cached: "bg-muted-foreground/40",
			}),
			accent: figma.enum("status", {
				cached: "muted",
			}),
			hasChildren: figma.enum("hierarchy", {
				leaf: false,
				"parent-collapsed": true,
				"parent-expanded": true,
			}),
			expanded: figma.enum("hierarchy", {
				"parent-expanded": true,
			}),
		},
		example: ({ isSelected, colorClass, accent, hasChildren, expanded }) => (
			<TimelineRow
				node={{
					id: "train_classifier",
					label: "train_classifier",
					startMs: 105200,
					durationMs: 53000,
					children: [],
					colorClass,
					accent,
					expanded,
				}}
				depth={0}
				isSelected={isSelected}
				onSelect={() => {}}
				onToggle={() => {}}
				hasChildren={hasChildren}
				nameColWidth={264}
				timeMap={timeMap}
				rightPadPx={80}
				leftPadPx={6}
			/>
		),
	}
);
