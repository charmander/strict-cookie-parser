"use strict";

var COOKIE_PAIR = /^([^\x00-\x20\x7f()<>@,;:\\"/[\]?={}]+)=(?:([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)|"([\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)")$/;

function isOptionalWhitespace(c) {
	return c === " " || c === "\t";
}

function stripCookieHeader(header) {
	var start = 0;
	var end = header.length - 1;

	while (
		start < header.length &&
		isOptionalWhitespace(header.charAt(start))
	) {
		start++;
	}

	while (
		end >= start &&
		isOptionalWhitespace(header.charAt(end))
	) {
		end--;
	}

	return header.substring(start, end + 1);
}

function parseStrippedCookieHeader(cookieHeader) {
	if (cookieHeader === "") {
		return null;
	}

	var cookiePairs = cookieHeader.split("; ");

	var cookies = new Map();

	for (var i = 0; i < cookiePairs.length; i++) {
		var cookiePair = cookiePairs[i];
		var match = COOKIE_PAIR.exec(cookiePair);

		// One unparseable cookie means that
		// the entire header is invalid.
		if (match === null) {
			return null;
		}

		var cookieName = match[1];
		var cookieValue =
			match[2] === undefined ?
				match[3] :
				match[2];

		cookies.set(cookieName, cookieValue);
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

exports.parseCookieHeader = parseCookieHeader;
exports.middleware = middleware;
