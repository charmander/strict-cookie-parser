export interface CookiePair {
	name: string;
	value: string;
}

export declare const isCookieName: (cookieName: string) => boolean;
export declare const parseCookieValue: (cookieValue: string) => string | null;
export declare const parseCookiePair: (cookiePair: string) => CookiePair | null;
export declare const parseCookieHeader: (cookieHeader: string) => Map<string, string> | null;
