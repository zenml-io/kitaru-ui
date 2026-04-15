## Icons

- MUST use `lucide-react` for ALL icons — never use heroicons, react-icons, or any other icon package
- MUST import icons as React components: `import { Search, Check } from "lucide-react"`
- NEVER use inline `<svg>` for standard icons — always use the lucide-react component
- Size icons via className: `<Search className="w-4 h-4" />`
- Only exception for inline SVG: custom illustrations, animated graphics, or the product logo

## Colors

- ALL color values MUST use oklch() format — never hex, rgb, or hsl
- This applies to CSS variables, inline values, and any new tokens
- Base design tokens are defined in `src/styles/globals.css` using oklch()
- When adding a new color, convert it to oklch first
- Use existing theme tokens (e.g., `text-foreground`, `bg-card`) before introducing new values

## Component Rules

- MUST use shadcn/ui components as the base — never rebuild primitives
- MUST add `aria-label` to icon-only buttons
- NEVER mix component primitive systems in the same surface
- NEVER rebuild keyboard or focus behavior by hand

## Accessibility

- All interactive elements must be keyboard accessible
- WCAG AA minimum: 4.5:1 contrast for body text, 3:1 for large text and UI components
- Never use color alone to convey information — pair with icons or text
- Every image needs `alt` text; decorative images get `alt=""`
- Use semantic HTML elements (`nav`, `main`, `section`, `button`) — not divs with click handlers
- MUST use `AlertDialog` for destructive/irreversible actions

## Responsiveness

- Mobile-first: base styles for mobile, `min-width` queries to layer complexity
- NEVER use `h-screen` — use `h-dvh` instead
- MUST respect `safe-area-inset` for fixed/sticky elements
- Use `clamp()` for fluid spacing and font sizes where appropriate
- Touch targets must be at least 44x44px on touch devices

## Design Quality

- NEVER use gradients unless explicitly requested
- NEVER use glow effects as primary affordances
- NEVER use purple or multicolor gradients
- Use Tailwind default shadow scale — no arbitrary shadow values
- Limit accent color to one per view
- Use existing theme/Tailwind color tokens before introducing new hex values
- `tabular-nums` for all numeric data displays
- `text-balance` for headings, `text-pretty` for body text
- Use `truncate` or `line-clamp` for dense UI

## Animation

- NEVER add animation unless explicitly requested
- Animate only compositor props (`transform`, `opacity`)
- NEVER animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- Never exceed 200ms for interaction feedback
- MUST respect `prefers-reduced-motion`

## Resizable Panels

- Use CSS-based drag handlers (mousedown → document mousemove/mouseup) — NOT `react-resizable-panels`
- Each resizable panel needs: min width, max width, collapse threshold, default width constants
- Store cleanup functions in a ref and call them on unmount to prevent listener leaks
- Set `document.body.style.cursor = "col-resize"` and `document.body.style.userSelect = "none"` during drag
- Drag handle: `w-px bg-border hover:bg-primary/50 cursor-col-resize` with `after:` pseudo-element for larger hit area
- Auto-collapse: when dragged below threshold, set panel open state to false and render width 0
- Conditionally render panel content only when open to avoid layout of hidden elements

## Tooltips

- `TooltipProvider` wraps the entire app in `src/App.tsx` — do not add additional providers
- MUST wrap every icon-only button in a `Tooltip` with a descriptive `TooltipContent`
- Use `side="bottom"` for toolbar buttons, `side="top"` for bottom-positioned actions

## shadcn Component Usage

- NEVER override shadcn component styles with inline className when a variant or size prop exists
- Use standard `variant` and `size` props: `<Button variant="outline" size="sm">` — not `className="text-[12px] gap-1.5"`
- `TabsTrigger` and `ToggleGroupItem` should use default styles — override only `data-[state=on]` or `data-[state=active]` when needed
- When multiple toggle/filter elements share a toolbar, use consistent active state styling across all of them
