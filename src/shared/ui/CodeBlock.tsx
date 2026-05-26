import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
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

const SUPPORTED_LANGS = [
	"json",
	"html",
	"python",
	"sql",
	"bash",
	"yaml",
	"csv",
	"javascript",
	"dockerfile",
] as const;

type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function isSupportedLang(lang: string): lang is SupportedLang {
	return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighterCore({
			themes: [kitaruLight, kitaruDark],
			langs: [
				import("shiki/langs/json.mjs"),
				import("shiki/langs/html.mjs"),
				import("shiki/langs/python.mjs"),
				import("shiki/langs/sql.mjs"),
				import("shiki/langs/bash.mjs"),
				import("shiki/langs/yaml.mjs"),
				import("shiki/langs/csv.mjs"),
				import("shiki/langs/javascript.mjs"),
				import("shiki/langs/dockerfile.mjs"),
			],
			engine: createJavaScriptRegexEngine(),
		});
	}
	return highlighterPromise;
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
	const [rendered, setRendered] = useState<{
		key: string;
		html: string;
	} | null>(null);
	const isDark = useIsDark();
	const supported = isSupportedLang(language);
	const renderKey = `${language}::${isDark ? "dark" : "light"}::${code}`;
	const html = rendered?.key === renderKey ? rendered.html : null;

	useEffect(() => {
		if (!supported) return;
		let cancelled = false;
		const themeName = isDark ? "kitaru-dark" : "kitaru-light";
		getHighlighter()
			.then((highlighter) => {
				if (cancelled) return;
				const next = highlighter.codeToHtml(code, {
					lang: language,
					theme: themeName,
				});
				setRendered({ key: renderKey, html: next });
			})
			.catch((err) => {
				console.error("[CodeBlock] shiki error:", err, "lang:", language);
			});
		return () => {
			cancelled = true;
		};
	}, [code, language, isDark, supported, renderKey]);

	if (!html) {
		return (
			<pre
				className={cn(
					"text-foreground p-4 font-mono text-xs leading-relaxed",
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
				"[&_pre]:m-0 [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed",
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
