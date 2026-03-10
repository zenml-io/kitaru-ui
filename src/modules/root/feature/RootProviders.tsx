import { queryClient } from "@/modules/root/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type RootProvidersProps = {
	children: ReactNode;
};

export function RootProviders({ children }: RootProvidersProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeProvider>
	);
}
