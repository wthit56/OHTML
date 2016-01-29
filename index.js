var parse = /<(\w+)((?:\s+\w+(?:='[^'>]*'|"[^">]*"|[^\s>]*)?)*)?(\/)?>|<\/(\w+)>|([^<]+)/g;
/*
text
<tag><tag1 prop1><tag prop='1"2'><tag prop="1'2">
<tag prop= prop=value prop='val" ue' prop="val' ue">
</tag>
*/
var root, parent, current, _current;
var newAttrs = [];
function check(match, tagOpen, attrs, tagSelfClosing, tagClose, text, index, source) {
	var newNode;
	if (tagOpen) {
		if (!current) {
			newNode = parent.appendChild(parent.ownerDocument.createElement(tagOpen));
			addAttrs(attrs, newNode);
			if (tagSelfClosing) { current = current.nextSibling; }
			else { parent = newNode; current = undefined; }
		}
		else if ((current.nodeType !== 1) || (current.tagName !== tagOpen)) {
			newNode = current.ownerDocument.createElement(tagOpen);
			addAttrs(attrs, newNode);
			if (ohtml.updated) { newNode.updated = ohtml.updated; }
			current.parentNode.insertBefore(newNode, current);
			current.parentNode.removeChild(current);
			if (tagSelfClosing) { current = current.nextSibling; }
			else { parent = newNode; current = undefined; }
		}
		else { // same nodeType and tagName
			addAttrs(attrs, current, newAttrs); removeOldAttrs(newAttrs, current);
			if (ohtml.updated && (newAttrs.length > 0)) { current.updated = ohtml.updated; }
			newAttrs.length = 0;
			if (tagSelfClosing) { current = current.nextSibling; }
			else { parent = current; current = current.childNodes[0]; }
		}
	}
	else if (tagClose) {
		if (parent === root) {
			throw (new Error("Malformed HTML. Unable to close root element: " + JSON.stringify(match) + (match !== source ? " found in " + JSON.stringify(source) : "")));
		}
		else {
			current = parent.nextSibling;
			parent = parent.parentNode;
		}
	}
	else if (text) {
		if (!current) {
			parent.appendChild(parent.ownerDocument.createTextNode(text));
		}
		else if ((current.nodeType !== 3) || (current.text !== text)) {
			newNode = current.parentNode.insertBefore(current.ownerDocument.createTextNode(text), current);
			if (ohtml.updated) { newNode.updated = ohtml.updated; }
			removeNode();
			current = newNode.nextSibling;
		}
	}
	
	return match;
}
function sameTag(tagOpen, text, dom) {
	return (dom.nodeType === 1) && (dom.tagName === tagOpen);
}
function removeNode() {
	current.parentNode.removeChild(current);
	current = null;
}

var addAttrs = (function() {
	var parse = /(\w+)(?:=(?:'([^']*)'|"([^"]*)"|(\S*)))?/g, current, added;
	function addAttrs(attrs, node, addedRef) {
		if (!attrs) { return; }
		else {
			current = node; added = addedRef;
			attrs.replace(parse, add);
			current = added = null;
		}
	}
	function add(match, name, sqValue, dqValue, nqValue) {
		var value = sqValue || dqValue || nqValue || "";
		if (!(name in current.attributes) || (current.attributes[name].value !== value)) {
			current.setAttribute(name, value);
			if (ohtml.updated) { current.attributes.getNamedItem(name).updated = ohtml.updated; }
		}
		
		if (added) { added.push(name); }
		return match;
	}
	
	return addAttrs;
})();
function removeOldAttrs(newAttrs, node) {
	for (var i = 0, l = node.attributes.length; i < l; i++) {
		if (newAttrs.indexOf(node.attributes[i].name) === -1) {
			node.attributes.removeNamedItem(node.attributes[i].name);
		}
	}
}

var ohtml = function(html, target) {
	root = parent = target;
	current = root.childNodes[0];
	html.replace(parse, check);
	root = current = _current = parent = null;
};
ohtml.updated = null;


if (typeof module !== "undefined") { module.exports = ohtml; }
