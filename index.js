'use strict';

const COOKIE_NAME = /^[^\x00-\x20\x7f()<>@,;:\\"/[\]?={}]+$/;
const COOKIE_VALUE = /^(?:([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)|"([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)")$/;

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

const isCookieName = cookieName => COOKIE_NAME.test(cookieName);

const parseCookieValue = cookieValue => {
	const valueMatch = COOKIE_VALUE.exec(cookieValue);
	if (valueMatch === null) {
		return null;
	}
	return valueMatch[1] === undefined ?
		valueMatch[2] :
		valueMatch[1];
};

const parseCookiePair = cookiePair => {
	const parts = cookiePair.split('=', 2);

	if (parts.length !== 2) {
		return null;
	}

	const name = parts[0];
	const value = parseCookieValue(parts[1]);

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

const parseCookieHeader = cookieHeader =>
	parseStrippedCookieHeader(
		stripCookieHeader(cookieHeader)
	);

module.exports = {
	isCookieName,
	parseCookieValue,
	parseCookiePair,
	parseCookieHeader,
};
