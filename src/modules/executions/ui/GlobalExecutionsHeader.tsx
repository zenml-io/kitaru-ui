import {
	PageHeader,
	PageHeaderBody,
	PageHeaderContent,
	PageHeaderDescription,
	PageHeaderTitle,
} from "@/shared/ui/PageHeader";

export function GlobalExecutionsHeader() {
	return (
		<PageHeader>
			<PageHeaderContent>
				<PageHeaderBody>
					<PageHeaderTitle>Executions</PageHeaderTitle>
					<PageHeaderDescription>
						Every execution across every flow, version, and stack.
					</PageHeaderDescription>
				</PageHeaderBody>
			</PageHeaderContent>
		</PageHeader>
	);
}
