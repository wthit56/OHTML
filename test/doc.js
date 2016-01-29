if (typeof DOMException === "undefined") { DOMException = Error; }

var doc = {
	createTextNode: function(text) {
		var newNode = Object.create(node, { nodeType: { value: 3 }, text: { value: text, enumerable: true } });
		return newNode;
	},
	createElement: function(tagName) {
		var attributes = []; Object.defineProperties(attributes, attrs);
		var newNode = Object.create(node, { tagName: { value: tagName, enumerable: true }, nodeType: { value: 1 }, attributes: { value: attributes, enumerable: true }, childNodes: { value: [], enumerable: true } });
		return newNode;
	},
	createAttribute: function(name, value) {
		var newAttr = Object.create(attr, { name: { value: name, enumerable: true }, value: { value: value == null ? "" : value, writable: true, enumerable: true } });
		return newAttr;
	}
};
var node = Object.create(null, {
	ownerDocument: { value: doc }, updated: { value: null, writable: true }, parentNode: { value: null, writable: true, enumerable: false },
	
	nextSibling: { get: function() {
		var next = this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
		return next;
	} },
	previousSibling: { get: function() {
		return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1];
	} },
	
	insertBefore: { value: function(newNode, referenceNode) {
		var index = this.childNodes.indexOf(referenceNode);
		if (index === -1) { throw new DOMException("Failed to execute 'insertBefore' on 'Node'."); }
		else {
			if (newNode.parentNode) { newNode.parentNode.removeChild(newNode); }
			this.childNodes.splice(index, 0, newNode);
			newNode.parentNode = this;
			//console.log(newNode.parentNode === this, newNode);
			return newNode;
		}
	} },
	appendChild: { value: function(child) {
		if (this.nodeType !== 1) {
			throw new DOMException("Failed to execute 'appendChild' on 'Node': this node type does not support this method.");
		}
		else {
			if (child.parentNode) { child.parentNode.removeChild(child); }
			this.childNodes.push(child);
			child.parentNode = this;
			return child;
		}
	} },
	removeChild: { value: function(child) {
		var index = this.childNodes.indexOf(child);
		if (index === -1) { throw new DOMException("Failed to execute 'removeChild' on 'Node'."); }
		else {
			this.childNodes.splice(index, 1);
			child.parentNode = null;
			return child;
		}
	} },
	
	setAttribute: { value: function(name, value) {
		var attr = this.attributes[name];
		if (attr) { attr.value = value; }
		else { this.attributes.push(this.attributes[name] = doc.createAttribute(name, value)); }
	} },
	getAttribute: { value: function(name) {
		var attr = this.attributes[name];
		if (attr) { return attr.value; }
		else { return null; }
	} },
	removeAttribute: { value: function(name) {
		this.attributes.removeNamedItem(name);
	} }
});
var attrs = {
	getNamedItem: { value: function(name) {
		return this[name] || null;
	} },
	setNamedItem: { value: function(item) {
		var oldAttr;
		//try { item.name in this; } catch(e) { console.log("in", item); return; }
		if (item.name in this) { oldAttr = this.removeNamedItem(item.name); }
		this.push(this[item.name] = item);
		return oldAttr;
	} },
	removeNamedItem: { value: function(name) {
		var oldAttr;
		for (var i = 0, l = this.length; i < l; i++) {
			if (this[i].name === name) {
				oldAttr = this.splice(i, 1)[0];
			}
		}
		delete this[name];
		
		return oldAttr;
	} }
};
var attr = Object.create(null, { ownerDocument: { value: doc } });

module.exports = doc;