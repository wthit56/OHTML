var ohtml = require("../index.js");
var doc = require("./doc.js"), same = require("./same.js");

function json(obj) {
	return JSON.stringify(obj, function(key, value) {
		if (key === "parentNode") { return undefined; }
		else { return value; }
	}, "  ");
}
function test(html, dom, expected) {
	var root = doc.createElement("HTML");
	dom.forEach(function(d) {
		var child = wrap(d);
		root.appendChild(child);
	});
	current = root.childNodes[0];
	expected = expected.map(function(d) { return wrap(d); });
	
	//console.log(expected);
	
	ohtml(html, root);
	if (!same.childNodes(root.childNodes, expected)) {
		console.log("[fail]\nwas:", json(root.childNodes), "\nexp:", json(expected));
		return false;
	}
	else { return true; }
}

function wrap(node) {
	if (!node.nodeType) {
		if (typeof node === "string") { return doc.createTextNode(node); }
		else {
			var newNode = doc.createElement(node.tagName);
			if (node.attrs) {
				node.attrs.forEach(function(attr) {
					attr = wrap.attr(attr);
					//if (attr.name.name) { console.log("sni", node); return; }
					newNode.attributes.setNamedItem(attr);
				});
			}
			if (node.childNodes) {
				node.childNodes.forEach(function(child) {
					newNode.appendChild(wrap(child));
				});
			}
			return newNode;
		}
	}
	return node;
}
wrap.attr = function(name, value) {
	if (typeof name === "string") {
		if (value != null) {
			return doc.createAttribute(name, value);
		}
		else {
			return doc.createAttribute(name, "");
		}
	}
	else {
		return name;
	}
};
function attr(name, value) { return doc.createAttribute(name, value); }
function updated(node, ref) {
	node = wrap(node); node.updated = updated.tag; if (ref) { node.ref = ref; } return node;
}
updated.attr = function(name, value, ref) {
	var attr = wrap.attr(name, value);
	attr.updated = updated.tag;
	if (ref) { attr.ref = ref; }
	return attr;
};

module.exports = {
	test: test, json: json,
	attr: attr, wrap: wrap, updated: updated
};