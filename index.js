'use strict';

const COOKIE_PAIR = /^([^\x00-\x20\x7f()<>@,;:\\"/[\]?={}]+)=(?:([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)|"([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)")$/;

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

const parseCookiePair = cookiePair => {
	const match = COOKIE_PAIR.exec(cookiePair);

	if (match === null) {
		return null;
	}

	const name = match[1];
	const value =
		match[2] === undefined ?
			match[3] :
			match[2];

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
	parseCookiePair,
	parseCookieHeader,
};
