import { strict as assert } from 'assert';

import {
	isCookieName,
	parseCookieHeader,
	parseCookieValue,
} from 'strict-cookie-parser';

const isCtl = c =>
	c <= 31 || c === 127;

const SEPARATORS = new Set(
	Array.from('()<>@,;:\\"/[]?={} \t', c => c.codePointAt(0))
);

const test = (name, run) => {
	console.log(name);
	run();
};

test('Single unquoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello=world');
	assert.notEqual(result, null);
	assert.equal(result.get('hello'), 'world');

	const result2 = parseCookieHeader('a=b=c');
	assert.notEqual(result2, null);
	assert.equal(result2.get('a'), 'b=c');
});

test('Single quoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello="world"');
	assert.notEqual(result, null);
	assert.equal(result.get('hello'), 'world');

	const result2 = parseCookieHeader('a="b=c"');
	assert.notEqual(result2, null);
	assert.equal(result2.get('a'), 'b=c');
});

test('Multiple unquoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello=world; foo=bar');
	assert.notEqual(result, null);
	assert.equal(result.get('hello'), 'world');
	assert.equal(result.get('foo'), 'bar');
});

test('Multiple quoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello="world"; foo="bar"');
	assert.notEqual(result, null);
	assert.equal(result.get('hello'), 'world');
	assert.equal(result.get('foo'), 'bar');
});

test('Long whitespace sequences parse in reasonable time', () => {
	const spaces = ' '.repeat(10000);
	const start = process.hrtime();
	const result = parseCookieHeader('hello="world' + spaces + '"');
	const time = process.hrtime(start);

	assert.equal(result, null);
	assert.ok(time[0] + time[1] * 1e-9 < 0.01);
});

test('Optional whitespace is ignored', () => {
	const result = parseCookieHeader('    \thello=world    \t');
	assert.notEqual(result, null);
	assert.equal(result.get('hello'), 'world');
});

test('Invalid cookies are rejected', () => {
	assert.equal(parseCookieHeader('hello'), null);
	assert.equal(parseCookieHeader('=world'), null);
	assert.equal(parseCookieHeader('hello = world'), null);
	assert.equal(parseCookieHeader('hello=world;foo=bar'), null);
	assert.equal(parseCookieHeader('/=separator'), null);
	assert.equal(parseCookieHeader('a=white space'), null);
	assert.equal(parseCookieHeader('a=comma,character'), null);
	assert.equal(parseCookieHeader('a=double"quote'), null);
	assert.equal(parseCookieHeader('name"="foo"'), null);
	assert.equal(parseCookieHeader('helló=world'), null);
	assert.equal(parseCookieHeader('hello=wórld'), null);
});

test('Name parsing matches RFC 2616 token', () => {
	for (let c = 0; c <= 127; c++) {
		const result = parseCookieHeader(String.fromCodePoint(c) + '=foo');

		if (isCtl(c) || SEPARATORS.has(c)) {
			assert.equal(result, null);
		} else {
			assert.equal(result.get(String.fromCharCode(c)), 'foo');
		}
	}
});

test('.parseCookieValue works as expected', () => {
	assert.equal(parseCookieValue(' foo'), null);
	assert.equal(parseCookieValue('foo'), 'foo');
	assert.equal(parseCookieValue('"foo"'), 'foo');
});

test('.isCookieName works as expected', () => {
	assert.equal(isCookieName('foo'), true);
	assert.equal(isCookieName('m=m'), false);
});
