import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { codeToHtml } from "shiki";
import {
	kitaruLight,
	kitaruDark,
} from "@/modules/executions/ui/traces/shiki-theme";
import { cn } from "@/shared/utils/styles";

interface CodeBlockProps {
	code: string;
	language?: string;
	/** wrap long lines instead of horizontal scroll (use for JSON, text) */
	wrap?: boolean;
	className?: string;
}

function useIsDark() {
	const [dark, setDark] = useState(() =>
		document.documentElement.classList.contains("dark")
	);
	useEffect(() => {
		const observer = new MutationObserver(() => {
			setDark(document.documentElement.classList.contains("dark"));
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => observer.disconnect();
	}, []);
	return dark;
}

export function CodeBlock({
	code,
	language = "text",
	wrap,
	className,
}: CodeBlockProps) {
	const [html, setHtml] = useState<string | null>(null);
	const isDark = useIsDark();

	useEffect(() => {
		let cancelled = false;
		const theme = isDark ? kitaruDark : kitaruLight;
		codeToHtml(code, { lang: language, theme })
			.then((result) => {
				if (!cancelled) setHtml(result);
			})
			.catch((err) => {
				console.error("[CodeBlock] shiki error:", err, "lang:", language);
				if (!cancelled) setHtml(null);
			});
		return () => {
			cancelled = true;
		};
	}, [code, language, isDark]);

	if (!html) {
		return (
			<pre
				className={cn(
					"text-2xs text-foreground p-4 font-mono leading-relaxed",
					wrap
						? "break-words whitespace-pre-wrap"
						: "overflow-x-auto whitespace-pre",
					className
				)}
			>
				{code}
			</pre>
		);
	}

	return (
		<div
			className={cn(
				"[&_pre]:text-2xs [&_pre]:m-0 [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:font-mono [&_pre]:leading-relaxed",
				"[&_.shiki]:!bg-transparent",
				wrap
					? "[&_pre]:break-words [&_pre]:whitespace-pre-wrap"
					: "[&_pre]:overflow-x-auto [&_pre]:whitespace-pre",
				className
			)}
			dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
		/>
	);
}
