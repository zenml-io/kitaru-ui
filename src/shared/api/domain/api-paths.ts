export const apiPaths = {
	activateServer: "/activate",
	currentUser: "/current-user",
	info: "/info",
	login: "/login",
	devices: {
		detail: (deviceId: string) => `/devices/${deviceId}`,
		verify: (deviceId: string) => `/devices/${deviceId}/verify`,
	},
};
