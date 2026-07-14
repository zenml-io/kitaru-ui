import { env } from "@/modules/root/domain/env";
import { queryClient } from "@/modules/root/query-client";
import { apiClient } from "@/shared/api/domain/api-client";
import { KITARU_SCOPE_KEY } from "@/shared/api/domain/kitaru-scope";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@zenml/hashi/primitives/tooltip";
import {
	KitaruApiClientProvider,
	KitaruProvider,
} from "@zenml/shared-kitaru/contexts";
import { LATEST_KITARU_VERSION_TARGET } from "@zenml/shared-kitaru/modules/versions";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

type RootProvidersProps = {
	children: ReactNode;
};

const apiBaseUrl = env.VITE_API_BASE_URL || env.VITE_BACKEND_URL || "";

export function RootProviders({ children }: RootProvidersProps) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<QueryClientProvider client={queryClient}>
				<KitaruApiClientProvider kitaruApiClient={apiClient}>
					<KitaruProvider
						scopeKey={KITARU_SCOPE_KEY}
						apiBaseUrl={apiBaseUrl}
						kitaruVersionTarget={LATEST_KITARU_VERSION_TARGET}
					>
						<TooltipProvider>{children}</TooltipProvider>
					</KitaruProvider>
				</KitaruApiClientProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}
