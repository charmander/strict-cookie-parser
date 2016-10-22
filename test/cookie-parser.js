"use strict";

var tap = require("tap");

var strictCookieParser = require("../");
var parseCookieHeader = strictCookieParser.parseCookieHeader;

tap.test("Valid cookies should be parsed correctly", function (t) {
	t.test("Single unquoted cookies should be parsed correctly", function (t) {
		var result = parseCookieHeader("hello=world");
		t.notEqual(result, null);
		t.equal(result.get("hello"), "world");
		t.end();
	});

	t.test("Single quoted cookies should be parsed correctly", function (t) {
		var result = parseCookieHeader('hello="world"');
		t.notEqual(result, null);
		t.equal(result.get("hello"), "world");
		t.end();
	});

	t.test("Multiple unquoted cookies should be parsed correctly", function (t) {
		var result = parseCookieHeader("hello=world; foo=bar");
		t.notEqual(result, null);
		t.equal(result.get("hello"), "world");
		t.equal(result.get("foo"), "bar");
		t.end();
	});

	t.test("Multiple quoted cookies should be parsed correctly", function (t) {
		var result = parseCookieHeader('hello="world"; foo="bar"');
		t.notEqual(result, null);
		t.equal(result.get("hello"), "world");
		t.equal(result.get("foo"), "bar");
		t.end();
	});

	t.test("Long whitespace sequences parse in reasonable time", function (t) {
		var spaces = new Array(10001).join(" ");
		var start = process.hrtime();
		var result = parseCookieHeader('hello="world' + spaces + '"');
		var time = process.hrtime(start);

		t.equal(result, null);
		t.ok(time[0] + time[1] * 1e-9 < 0.01);
		t.end();
	});

	t.test("Optional whitespace is ignored", function (t) {
		var result = parseCookieHeader("    \thello=world    \t");
		t.notEqual(result, null);
		t.equal(result.get("hello"), "world");
		t.end();
	});

	t.end();
});

tap.test("Invalid cookies should be rejected", function (t) {
	t.equal(parseCookieHeader("hello"), null);
	t.equal(parseCookieHeader("=world"), null);
	t.equal(parseCookieHeader("hello = world"), null);
	t.equal(parseCookieHeader("hello=world;foo=bar"), null);
	t.equal(parseCookieHeader("/=separator"), null);
	t.equal(parseCookieHeader("a=white space"), null);
	t.equal(parseCookieHeader("a=comma,character"), null);
	t.equal(parseCookieHeader('a=double"quote'), null);
	t.end();
});
