class RptLinkedNode {
	constructor(ll, o, p, n) {
		this.linkedList = ll;
		this.object = o;
		this.previous = p;
		if (p) p.next = this;
		else ll.first = this;
		this.next = n;
		if (n) n.previous = this;
		else ll.last = this;
	}
}

class RptLinkedList {
	constructor() {
		this.linkedNodeCount = 0;
		this.linkedNodeIndex = -1;
		this.first = null;
		this.last = null;
		this.clearList();
	}

	clearList() {
		while (this.last !== null) {
			this.last = this.last.previous;
			this.last.next = null;
		}
		this.first = null;
	}

	count() {
		return this.linkedNodeCount;
	}

	index() {
		return this.linkedNodeIndex;
	}

	replace(index, object) {
		this.delete(index);
		this.insert(index, object);
	}

	delete(index) {
		var linkedNode = this.getLinkedNode(index);
		if (index === 0) {
			if (linkedNode.next) linkedNode.next.previous = null;
			this.first = linkedNode.next;
		} else {
			if (linkedNode.next) linkedNode.next.previous = linkedNode.previous;
			else this.last = linkedNode.previous;
			linkedNode.previous.next = linkedNode.next;
		}
		this.linkedNodeCount--;
	}

	insert(index, object) {
		if ((index < 0) || (index > this.linkedNodeCount))
			return null;
		var linkedNode = null;
		if (this.linkedNodeCount === 0) {
			linkedNode = new RptLinkedNode(this, object, null, null);
			// this.first = linkedNode;
			// this.last = linkedNode;
		} else if (index === 0) {
			linkedNode = new RptLinkedNode(this, object, null, this.first);
			// this.first = linkedNode;
		} else if (index === this.linkedNodeCount) {
			linkedNode = new RptLinkedNode(this, object, this.last, null);
			// this.last = linkedNode;
		} else {
			var linkedNodeAtIndex = this.getLinkedNode(index);
			linkedNode = new RptLinkedNode(this, object, linkedNodeAtIndex.previous, linkedNodeAtIndex);
		}
		this.linkedNodeCount++;
		return linkedNode;
	}

	getLinkedNode(index) {
		if ((index < 0) || (index >= this.linkedNodeCount))
			return null;
		var linkedNode = this.first;
		for (var i = 0; i < index; i++) {
			linkedNode = linkedNode.next;
		}
		return linkedNode;
	}

	remove(index) {
		var linkedNode = this.getLinkedNode(index);

		if (!linkedNode)
			return null;

		if (linkedNode.previous)
			linkedNode.previous.next = linkedNode.next;

		if (linkedNode.next)
			linkedNode.next.previous = linkedNode.previous;

		if (linkedNode === this.first)
			this.first = linkedNode.next;

		if (linkedNode === this.last)
			this.last = linkedNode.previous;

		this.linkedNodeCount--;

		return linkedNode;
	}
	
	/*
	forEach(maxIndex, func) {
		var nextX = 0;
		var sep = 20;
		var node = this.first;
		for (var i = 0; i < maxIndex; i++) {
			var o = node.object;
			if (func) func(o, nextX);
			var cg = o.charGeometry;
			nextX += sep + (cg.str === " ") ? 30 : Math.abs(cg.max.x - cg.min.x);
			node = node.next;
		}
		return nextX;
	}
	*/
}
