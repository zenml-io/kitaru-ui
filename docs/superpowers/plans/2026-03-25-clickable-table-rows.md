# Clickable Table Rows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make entire table rows in the Flows and Executions tables navigate on click, replacing the existing per-cell link with a row-level `onClick` handler.

**Architecture:** Add conditional `cursor-pointer` to `TableRow` when an `onClick` is present. In each feature container, use `useNavigate` from TanStack Router to navigate on row click, and remove the now-redundant `<Link>` wrappers from individual cells.

**Tech Stack:** React 19, TanStack Router (`useNavigate`), TanStack React Table, Tailwind CSS v4, Vitest (no component test infra — skip component tests).

---

## File Map

| File                                                          | Change                                                                                              |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/shared/ui/Table/Table.tsx`                               | Extract `onClick` from props; add `cursor-pointer` when present                                     |
| `src/modules/flows/feature/FlowsTableContainer.tsx`           | Add `useNavigate`, `navigateToFlow` helper, row `onClick`; remove `<Link>` from name cell           |
| `src/modules/executions/feature/ExecutionsTableContainer.tsx` | Add `useNavigate`, `navigateToExecution` helper, row `onClick`; remove `<Link>` from execution cell |

---

### Task 1: Update `TableRow` to show pointer cursor when clickable

**Files:**

- Modify: `src/shared/ui/Table/Table.tsx`

- [ ] **Step 1: Update `TableRow` to extract `onClick` and apply `cursor-pointer` conditionally**

Open `src/shared/ui/Table/Table.tsx`. Find the `TableRow` function (line 55). Replace it with:

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

Note: `onClick` was previously passed through `...props` so behavior for existing callers is unchanged. The only new behaviour is `cursor-pointer` appearing when `onClick` is provided.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm build 2>&1 | grep -E "error|warning" | head -20
```

Expected: no TypeScript errors related to `TableRow`.

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/Table/Table.tsx
git commit -m "feat: add cursor-pointer to TableRow when onClick is provided"
```

---

### Task 2: Make Flows table rows clickable

**Files:**

- Modify: `src/modules/flows/feature/FlowsTableContainer.tsx`

- [ ] **Step 1: Add `useNavigate` import and `navigateToFlow` helper**

Open `src/modules/flows/feature/FlowsTableContainer.tsx`.

Add `useNavigate` to the TanStack Router import (line 11):

```tsx
import { Link, useNavigate } from "@tanstack/react-router";
```

Then remove `Link` from the import (it will no longer be used):

```tsx
import { useNavigate } from "@tanstack/react-router";
```

Add this helper function just above `FlowsTableContainer` (before line 22):

```tsx
function navigateToFlow(
	navigate: ReturnType<typeof useNavigate>,
	flowId: string
) {
	void navigate({
		to: "/flows/$flowId/$tab",
		params: { flowId, tab: "overview" },
	});
}
```

- [ ] **Step 2: Add `useNavigate` call inside the component**

Inside `FlowsTableContainer`, after the `useState` call (around line 24), add:

```tsx
const navigate = useNavigate();
```

- [ ] **Step 3: Pass `onClick` to body `TableRow`s**

Find the body row render (around line 66):

```tsx
rows.map((row) => (
    <TableRow key={row.id}>
```

Change it to:

```tsx
rows.map((row) => (
    <TableRow key={row.id} onClick={() => navigateToFlow(navigate, row.original.id)}>
```

The header `TableRow` (inside `headerGroups.map`) and the empty-state `TableRow` do not get `onClick` — leave them unchanged.

- [ ] **Step 4: Remove the `<Link>` wrapper from the name column cell**

Find the `name` column definition in `flowColumns` (around line 93). Replace:

```tsx
cell: ({ row }) => (
    <Link
        to="/flows/$flowId/$tab"
        params={{ flowId: row.original.id, tab: "overview" }}
        className="hover:underline"
    >
        <TextRenderer>{row.original.name}</TextRenderer>
    </Link>
),
```

With:

```tsx
cell: ({ row }) => <TextRenderer>{row.original.name}</TextRenderer>,
```

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```bash
pnpm build 2>&1 | grep -E "error" | head -20
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/modules/flows/feature/FlowsTableContainer.tsx
git commit -m "feat: make flows table rows clickable"
```

---

### Task 3: Make Executions table rows clickable

**Files:**

- Modify: `src/modules/executions/feature/ExecutionsTableContainer.tsx`

- [ ] **Step 1: Add `useNavigate` import and `navigateToExecution` helper**

Open `src/modules/executions/feature/ExecutionsTableContainer.tsx`.

Replace the TanStack Router import (line 15):

```tsx
import { Link } from "@tanstack/react-router";
```

With:

```tsx
import { useNavigate } from "@tanstack/react-router";
```

Add this helper function just above `ExecutionsTableContainer` (before line 27):

```tsx
function navigateToExecution(
	navigate: ReturnType<typeof useNavigate>,
	flowId: string,
	executionId: string
) {
	void navigate({
		to: "/flows/$flowId/executions/$executionId",
		params: { flowId, executionId },
	});
}
```

- [ ] **Step 2: Add `useNavigate` call inside the component**

Inside `ExecutionsTableContainer`, after the `useState` call (around line 35), add:

```tsx
const navigate = useNavigate();
```

- [ ] **Step 3: Pass `onClick` to body `TableRow`s**

Find the body row render (around line 77):

```tsx
rows.map((row) => (
    <TableRow key={row.id}>
```

Change it to:

```tsx
rows.map((row) => (
    <TableRow key={row.id} onClick={() => navigateToExecution(navigate, flowId, row.original.id)}>
```

The header and empty-state `TableRow`s do not get `onClick` — leave them unchanged.

- [ ] **Step 4: Remove the `<Link>` wrapper from the execution column cell**

Find the `execution` column definition in `buildExecutionColumns` (around line 107). Replace:

```tsx
cell: ({ row }) => (
    <Link
        to="/flows/$flowId/executions/$executionId"
        params={{ flowId, executionId: row.original.id }}
        className="hover:underline"
    >
        <ExecutionName index={row.original.index} />
    </Link>
),
```

With:

```tsx
cell: ({ row }) => <ExecutionName index={row.original.index} />,
```

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```bash
pnpm build 2>&1 | grep -E "error" | head -20
```

Expected: no errors.

- [ ] **Step 6: Run the unit test suite to check nothing is broken**

```bash
pnpm test:unit
```

Expected: all tests pass (green).

- [ ] **Step 7: Commit**

```bash
git add src/modules/executions/feature/ExecutionsTableContainer.tsx
git commit -m "feat: make executions table rows clickable"
```
