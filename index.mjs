const COOKIE_NON_NAME = /[^\x21\x23-\x27\x2a\x2b\x2d\x2e\x30-\x39\x41-\x5a\x5e-\x7a\x7c\x7e]/;
const COOKIE_NON_VALUE = /[^\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]/;

const isOptionalWhitespace = c =>
	c === 32 || c === 9;

const stripCookieHeader = header => {
	let start = 0;
	let end = header.length - 1;

	while (
		start < header.length &&
		isOptionalWhitespace(header.charCodeAt(start))
	) {
		start++;
	}

	while (
		end >= start &&
		isOptionalWhitespace(header.charCodeAt(end))
	) {
		end--;
	}

	return header.substring(start, end + 1);
};

export const isCookieName = cookieName =>
	cookieName !== '' &&
		!COOKIE_NON_NAME.test(cookieName);

export const parseCookieValue = cookieValue => {
	if (
		cookieValue.length >= 2 &&
		cookieValue.charCodeAt(0) === 34 &&
		cookieValue.charCodeAt(cookieValue.length - 1) === 34
	) {
		cookieValue = cookieValue.substring(1, cookieValue.length - 1);
	}

	return COOKIE_NON_VALUE.test(cookieValue) ?
		null :
		cookieValue;
};

export const parseCookiePair = cookiePair => {
	const splitAt = cookiePair.indexOf('=');

	if (splitAt === -1) {
		return null;
	}

	const name = cookiePair.slice(0, splitAt);
	const value = parseCookieValue(cookiePair.slice(splitAt + 1));

	if (!isCookieName(name) || value === null) {
		return null;
	}

	return {
		name,
		value,
	};
};

const parseStrippedCookieHeader = cookieHeader => {
	if (cookieHeader === '') {
		return null;
	}

	const cookiePairs = cookieHeader.split('; ');

	const cookies = new Map();

	for (let i = 0; i < cookiePairs.length; i++) {
		const cookiePair = parseCookiePair(cookiePairs[i]);

		// One unparseable cookie means that
		// the entire header is invalid.
		if (cookiePair === null) {
			return null;
		}

		cookies.set(cookiePair.name, cookiePair.value);
	}

	return cookies;
};

export const parseCookieHeader = cookieHeader =>
	parseStrippedCookieHeader(
		stripCookieHeader(cookieHeader)
	);
