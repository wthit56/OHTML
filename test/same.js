var updated = require("./helpers.js").updated;
function same(a, b) {
	if (
		(a.nodeType === b.nodeType) &&
		(
			a.nodeType === 1 ? a.tagName === b.tagName :
			a.nodeType === 3 ? a.text === b.text :
				true
		) &&
		(a.nodeType === 1 ? same.attributes(a.attributes, b.attributes) && same.childNodes(a.childNodes, b.childNodes) : true)
	) { }
	else {
		console.log("diff tag", same.attributes(a.attributes, b.attributes));
		return false;
	}
	
	if (a.ref) {
		if (a.ref !== b) {
			console.log("diff ref");
			return false;
		}
		else if (a.update !== updated.tag) {
			console.log("diff update");
			return false;
		}
	}
	
	return true;
}
same.attributes = function(a, b) {
	if (a == null) { console.log("an", a); return; }
	var l = a.length;
	if (l !== b.length) { return false; }
	else {
		for (var i = 0; i < l; i++) {
			if (
				(a[i].name !== b[i].name) ||
				(a[i].value !== b[i].value) ||
				(a[i].updated !== b[i].updated)
			) {
				console.log("failed attribute compare",
					/*
						(a[i].name !== b[i].name),
						(a[i].value !== b[i].value),
						(a[i].updated !== b[i].updated),
					//*/
					a[i].value, b[i].value,
					a[i].value === b[i].value
				);
				return false;
			}
		}
		
		return true;
	}
};
same.childNodes = function(a, b) {
	var l = a.length;
	if (l !== b.length) { return false; }
	else {
		for (var i = 0; i < l; i++) {
			if (!same(a[i], b[i])) { return false; }
		}
		
		return true;
	}
};

module.exports = same;