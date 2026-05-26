import { queryClient } from "@/modules/root/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { TooltipProvider } from "@zenml/hashi/primitives/tooltip";

type RootProvidersProps = {
	children: ReactNode;
};

export function RootProviders({ children }: RootProvidersProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>{children}</TooltipProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
