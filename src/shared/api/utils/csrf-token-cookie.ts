import Cookies from "js-cookie";
import { buildCookieKey } from "@/shared/utils/storage-key";

export const csrfTokenCookieName = buildCookieKey("csrf-token");

function shouldUseSecureCookies() {
	return window.location.protocol === "https:";
}

function getCsrfCookieAttributes(): Cookies.CookieAttributes {
	return {
		path: "/",
		sameSite: "strict",
		...(shouldUseSecureCookies() ? { secure: true } : {}),
	};
}

export function setCsrfToken(token: string) {
	Cookies.set(csrfTokenCookieName, token, getCsrfCookieAttributes());
}

export function getCsrfToken(): string | undefined {
	return Cookies.get(csrfTokenCookieName);
}

export function clearCsrfToken() {
	Cookies.remove(csrfTokenCookieName, getCsrfCookieAttributes());
}
