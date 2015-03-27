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
