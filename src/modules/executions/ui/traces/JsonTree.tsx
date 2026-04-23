import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

const jsonViewStyles = {
	...defaultStyles,
	container: "font-mono text-xs leading-relaxed",
	basicChildStyle: "my-0",
	label: "text-foreground mr-1",
	clickableLabel: "text-foreground mr-1 cursor-pointer",
	nullValue: "text-muted-foreground italic",
	undefinedValue: "text-muted-foreground italic",
	numberValue: "text-primary",
	stringValue: "text-success whitespace-pre-wrap",
	booleanValue: "text-primary",
	otherValue: "text-foreground",
	punctuation: `${defaultStyles.punctuation} !text-muted-foreground`,
	expandIcon: `${defaultStyles.expandIcon} !text-muted-foreground`,
	collapseIcon: `${defaultStyles.collapseIcon} !text-muted-foreground`,
	childFieldsContainer: "border-l border-border ml-2 pl-2",
	quotesForFieldNames: true,
};

export function JsonTree({ data }: { data: object }) {
	return (
		<div className="overflow-x-auto">
			<JsonView
				data={data}
				shouldExpandNode={allExpanded}
				clickToExpandNode
				style={jsonViewStyles}
			/>
		</div>
	);
}
