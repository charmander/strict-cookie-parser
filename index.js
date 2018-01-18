"use strict";

var COOKIE_PAIR = /^([^\x00-\x20\x7f()<>@,;:\\"/[\]?={}]+)=(?:([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)|"([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)")$/;

function isOptionalWhitespace(c) {
	return c === 32 || c === 9;
}

function stripCookieHeader(header) {
	var start = 0;
	var end = header.length - 1;

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
}

function parseCookiePair(cookiePair) {
	var match = COOKIE_PAIR.exec(cookiePair);

	if (match === null) {
		return null;
	}

	var name = match[1];
	var value =
		match[2] === undefined ?
			match[3] :
			match[2];

	return {
		name: name,
		value: value,
	};
}

function parseStrippedCookieHeader(cookieHeader) {
	if (cookieHeader === "") {
		return null;
	}

	var cookiePairs = cookieHeader.split("; ");

	var cookies = new Map();

	for (var i = 0; i < cookiePairs.length; i++) {
		var cookiePair = parseCookiePair(cookiePairs[i]);

		// One unparseable cookie means that
		// the entire header is invalid.
		if (cookiePair === null) {
			return null;
		}

		cookies.set(cookiePair.name, cookiePair.value);
	}

	return cookies;
}

function parseCookieHeader(cookieHeader) {
	return parseStrippedCookieHeader(
		stripCookieHeader(cookieHeader)
	);
}

function middleware(request, response, next) {
	if ("cookie" in request.headers) {
		var cookieHeader = request.headers.cookie;
		var cookies = parseCookieHeader(cookieHeader);

		if (cookies) {
			request.cookies = cookies;
			next();
			return;
		}
	}

	request.cookies = new Map();
	next();
}

exports.parseCookiePair = parseCookiePair;
exports.parseCookieHeader = parseCookieHeader;
exports.middleware = middleware;
