import assert from 'assert';

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
	assert.notStrictEqual(result, null);
	assert.strictEqual(result.get('hello'), 'world');

	const result2 = parseCookieHeader('a=b=c');
	assert.notStrictEqual(result2, null);
	assert.strictEqual(result2.get('a'), 'b=c');
});

test('Single quoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello="world"');
	assert.notStrictEqual(result, null);
	assert.strictEqual(result.get('hello'), 'world');

	const result2 = parseCookieHeader('a="b=c"');
	assert.notStrictEqual(result2, null);
	assert.strictEqual(result2.get('a'), 'b=c');
});

test('Multiple unquoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello=world; foo=bar');
	assert.notStrictEqual(result, null);
	assert.strictEqual(result.get('hello'), 'world');
	assert.strictEqual(result.get('foo'), 'bar');
});

test('Multiple quoted cookies are parsed correctly', () => {
	const result = parseCookieHeader('hello="world"; foo="bar"');
	assert.notStrictEqual(result, null);
	assert.strictEqual(result.get('hello'), 'world');
	assert.strictEqual(result.get('foo'), 'bar');
});

test('Long whitespace sequences parse in reasonable time', () => {
	const spaces = ' '.repeat(10000);
	const start = process.hrtime();
	const result = parseCookieHeader('hello="world' + spaces + '"');
	const time = process.hrtime(start);

	assert.strictEqual(result, null);
	assert.ok(time[0] + time[1] * 1e-9 < 0.01);
});

test('Optional whitespace is ignored', () => {
	const result = parseCookieHeader('    \thello=world    \t');
	assert.notStrictEqual(result, null);
	assert.strictEqual(result.get('hello'), 'world');
});

test('Invalid cookies are rejected', () => {
	assert.strictEqual(parseCookieHeader('hello'), null);
	assert.strictEqual(parseCookieHeader('=world'), null);
	assert.strictEqual(parseCookieHeader('hello = world'), null);
	assert.strictEqual(parseCookieHeader('hello=world;foo=bar'), null);
	assert.strictEqual(parseCookieHeader('/=separator'), null);
	assert.strictEqual(parseCookieHeader('a=white space'), null);
	assert.strictEqual(parseCookieHeader('a=comma,character'), null);
	assert.strictEqual(parseCookieHeader('a=double"quote'), null);
	assert.strictEqual(parseCookieHeader('name"="foo"'), null);
	assert.strictEqual(parseCookieHeader('helló=world'), null);
	assert.strictEqual(parseCookieHeader('hello=wórld'), null);
});

test('Name parsing matches RFC 2616 token', () => {
	for (let c = 0; c <= 127; c++) {
		const result = parseCookieHeader(String.fromCodePoint(c) + '=foo');

		if (isCtl(c) || SEPARATORS.has(c)) {
			assert.strictEqual(result, null);
		} else {
			assert.strictEqual(result.get(String.fromCharCode(c)), 'foo');
		}
	}
});

test('.parseCookieValue works as expected', () => {
	assert.strictEqual(parseCookieValue(' foo'), null);
	assert.strictEqual(parseCookieValue('foo'), 'foo');
	assert.strictEqual(parseCookieValue('"foo"'), 'foo');
});

test('.isCookieName works as expected', () => {
	assert.strictEqual(isCookieName('foo'), true);
	assert.strictEqual(isCookieName('m=m'), false);
});
