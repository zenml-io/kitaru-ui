import { Button } from "@zenml/hashi/primitives/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcherContainer() {
	const { theme, setTheme } = useTheme();
	return (
		<div className="px-2 py-1.5">
			<span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
				Theme
			</span>
			<div className="mt-1.5 flex items-center gap-1">
				<Button
					variant={theme === "light" ? "default" : "outline"}
					size="icon"
					className="h-7 w-7"
					aria-label="Light theme"
					onClick={() => setTheme("light")}
				>
					<Sun className="h-4 w-4" />
				</Button>
				<Button
					variant={theme === "dark" ? "default" : "outline"}
					size="icon"
					className="h-7 w-7"
					aria-label="Dark theme"
					onClick={() => setTheme("dark")}
				>
					<Moon className="h-4 w-4" />
				</Button>
				<Button
					variant={theme === "system" ? "default" : "outline"}
					size="icon"
					className="h-7 w-7"
					aria-label="System theme"
					onClick={() => setTheme("system")}
				>
					<Monitor className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
