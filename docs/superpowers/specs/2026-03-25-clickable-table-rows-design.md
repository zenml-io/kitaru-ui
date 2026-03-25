# Clickable Table Rows

**Date:** 2026-03-25
**Scope:** Flows table, Executions table

## Goal

Make entire table rows clickable for navigation, instead of only the name/execution cell link.

## Affected Files

- `src/shared/ui/Table/Table.tsx` — `TableRow` primitive
- `src/modules/flows/feature/FlowsTableContainer.tsx`
- `src/modules/executions/feature/ExecutionsTableContainer.tsx`

## Design

### 1. `TableRow` — conditional `cursor-pointer`

Extract `onClick` from props to conditionally apply `cursor-pointer`. No other change.

```tsx
function TableRow({
	className,
	onClick,
	...props
}: React.ComponentProps<"tr">) {
	return (
		<tr
			data-slot="table-row"
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
				onClick && "cursor-pointer",
				className
			)}
			onClick={onClick}
			{...props}
		/>
	);
}
```

Header rows are unaffected — they never receive `onClick`. Empty-state rows also pass no `onClick`, so they render without `cursor-pointer` as expected.

### 2. `FlowsTableContainer`

- Add `useNavigate` from `@tanstack/react-router`.
- Extract navigation to a module-level helper function.
- Pass `onClick` to each body `TableRow`.
- Remove the `<Link>` wrapper from the name column cell (redundant — row navigates to the same destination). Replace with plain `<TextRenderer>`.
- `flowColumns` stays a static module-level constant — `navigate` is captured at the row render site (in the `onClick` closure), not inside column cell renderers, so no factory function is needed.

```tsx
function navigateToFlow(navigate: ReturnType<typeof useNavigate>, flowId: string) {
  void navigate({ to: "/flows/$flowId/$tab", params: { flowId, tab: "overview" } });
}

// in render:
<TableRow key={row.id} onClick={() => navigateToFlow(navigate, row.original.id)}>
```

### 3. `ExecutionsTableContainer`

Same pattern as Flows.

- Add `useNavigate`.
- Extract navigation to a module-level helper.
- Pass `onClick` to each body `TableRow`.
- Remove the `<Link>` wrapper from the execution column cell. Replace with plain `<ExecutionName>`.

```tsx
function navigateToExecution(
  navigate: ReturnType<typeof useNavigate>,
  flowId: string,
  executionId: string,
) {
  void navigate({ to: "/flows/$flowId/executions/$executionId", params: { flowId, executionId } });
}

// in render:
<TableRow key={row.id} onClick={() => navigateToExecution(navigate, flowId, row.original.id)}>
```

## Out of Scope

- Members table — no navigation destination; row actions dropdown stays as-is.
- cmd+click / right-click "open in new tab" — not supported (no `<a>` tag). Acceptable trade-off.
- Keyboard navigation and screen reader support — `<tr onClick>` is not keyboard-focusable or activatable via Enter/Space without additional `tabIndex` and `onKeyDown` handling. This replaces the existing `<Link>` which was fully keyboard-navigable. Deferred; can be addressed in a follow-up by adding `tabIndex={0}` and `onKeyDown` to `TableRow` when `onClick` is present.
- Future tables with interactive row elements (buttons, dropdowns) — those elements should call `e.stopPropagation()` to prevent the row handler from firing.
