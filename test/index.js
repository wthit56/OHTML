console.log(require("inline-test/markup")(eval("(" + require("inline-test")(function() {
var ohtml = require("../index.js");
var helpers = require("./helpers.js"), test = helpers.test, wrap = helpers.wrap, attr = helpers.attr, updated = helpers.updated;
updated.tag = ohtml.updated = {};

//*
var saved;
test("new text", [], [updated("new text")]); /// empty root; text should be injected
test("same text", [saved = wrap("same text")], [saved]); /// no change
test("new text", [saved = wrap("old text")], [updated("new text")]); /// text should be swapped out

test("<a></a>", [], [updated({ tagName: "a" })]); /// empty root; tag should be injected
test("<a></a>", [{ tagName: "a" }], [{ tagName: "a" }]); /// no change
test("<b></b>", [{ tagName: "a" }], [updated({ tagName: "b" })]); /// should insert new tag

test("<a>inner text</a>outer text", [{ tagName: "a" }], [updated({ tagName: "a", childNodes: [updated("inner text")] }), updated("outer text")]); ///

//*

test("<a download></a>", [{ tagName: "a" }], [{ tagName: "a", attrs: [updated.attr("download")] }]); /// add attribute
test("<a></a>", [{ tagName: "a", attrs: ["download"] }], [{ tagName: "a" }]); /// remove attribute
test("<a download=true></a>", [{ tagName: "a", attrs: ["download"] }], [{ tagName: "a", attrs: [updated.attr("download", "true")] }]); /// set attribute value
test("<a download=true></a>", [{ tagName: "a", attrs: [attr("download", "false")] }], [{ tagName: "a", attrs: [updated.attr("download", "true")] }]); /// change attribute value

test("<a download=true></a>", [{ tagName: "a", attrs: [attr("download", "true")] }], [{ tagName: "a", attrs: [attr("download", "true")] }]); /// same attribute value (ignored)
test("<a download=true></a>", [], [{ tagName: "a", attrs: [updated.attr("download", "true")] }]); /// inject with attribute with value
test("<a download='true'></a>", [], [{ tagName: "a", attrs: [updated.attr("download", "true")] }]); /// inject with attribute with single-quoted value
test('<a download="true"></a>', [], [{ tagName: "a", attrs: [updated.attr("download", "true")] }]); /// inject with attribute with double-quoted value

test("<a download=tr'\"ue></a>", [], [{ tagName: "a", attrs: [updated.attr("download", "tr'\"ue")] }]); /// complex non-terminating characters
test("<a b=tr ue c=\nd e=\tf>", [], [{ tagName: "a", attrs: [updated.attr("b", "tr"), updated.attr("ue"), updated.attr("c"), updated.attr("d"), updated.attr("e"), updated.attr("f")] }]); /// un-quoted whitespace
//*/
test("<a b=tr>ue", [], [{ tagName: "a", attrs: [updated.attr("b", "tr")], childNodes: ["ue"] }]); /// un-quoted angle-bracket
//*/

}) + ")")()));