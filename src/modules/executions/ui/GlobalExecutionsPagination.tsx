import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";

type GlobalExecutionsPaginationProps = {
	page: number;
	totalPages: number;
	total: number;
	onPageChange: (page: number) => void;
};

export function GlobalExecutionsPagination({
	page,
	totalPages,
	total,
	onPageChange,
}: GlobalExecutionsPaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="text-muted-foreground flex items-center justify-between px-4 py-3 text-sm sm:px-6 lg:px-8">
			<span>
				Page {page} of {totalPages} · {total} total
			</span>
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft className="size-4" />
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					Next
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}
