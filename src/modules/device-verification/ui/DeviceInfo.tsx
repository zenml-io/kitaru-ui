type DeviceInfoProps = {
	ipAddress: string | undefined;
	location: string | undefined;
	hostname: string | undefined;
};

export function DeviceInfo({ ipAddress, location, hostname }: DeviceInfoProps) {
	return (
		<div className="border-border rounded-md border text-sm">
			{!!ipAddress && (
				<div className="border-border flex border-b px-4 py-2.5">
					<span className="text-muted-foreground w-24 shrink-0">
						IP Address
					</span>
					<span className="text-foreground tabular-nums">{ipAddress}</span>
				</div>
			)}
			{!!location && (
				<div className="border-border flex border-b px-4 py-2.5">
					<span className="text-muted-foreground w-24 shrink-0">Location</span>
					<span className="text-foreground">{location}</span>
				</div>
			)}
			{!!hostname && (
				<div className="flex px-4 py-2.5">
					<span className="text-muted-foreground w-24 shrink-0">Hostname</span>
					<span className="text-foreground">{hostname}</span>
				</div>
			)}
		</div>
	);
}
