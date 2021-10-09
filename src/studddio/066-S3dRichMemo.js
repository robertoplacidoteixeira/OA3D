class S3dRichMemo extends S3dObject3D {

	afterPrepare() {
		super.afterPrepare();
		this.richTextLL = new RptLinkedList();
		this.richTextIndex = -1;
		this.cursorIndex = 0;
		this.richTextNode = null;
		this.richText = null;
		this.createCursorBox();
		if (this.addLine) {
			this.richTextNode = this.addRichText(0, true);
		}
	}

	createCursorBox() {
		var g = new THREE.CubeGeometry(10, 70, 20, 1, 1, 1);
		var m = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true});
		this.cursorMesh = new THREE.Mesh(g, m);
		this.cursorMesh.position.y = 35;
		this.cursorMesh.position.z = 10;
		this.add(this.cursorMesh);
	}

	clearStr() {
		while (this.richTextLL.linkedNodeCount > 0) {
			var rtn = this.richTextLL.getLinkedNode(0);
			var rt = rtn.object;
			if (rt) {
				rt.clearStr();
				this.remove(rt);
			}
			this.richTextLL.delete(0);
		}
	}

	setStr(str) {
		this.clearStr();
		if (str instanceof Array) {
			var l = str.length;
			this.richTextIndex = -1;
			for (var i = 0; i < l; i++) {
				var nextStr = str[i];
				this.richTextIndex++;
				var newRichTextNode = this.addRichText(this.richTextIndex, false);
				var newRichText = newRichTextNode.object;
				newRichText.setStr(nextStr);
			}
		}
	}

	addRichText(index, focus) {
		data = $g.factory.data.s3d.richText(this, this, null, null, null);
		var newRichText = new S3dRichText(data);
		var newRichTextNode = this.richTextLL.insert(index, newRichText);
		if (this.richTextNode) {
			var oldRichText = this.richTextNode.object;
			if (this.cursorIndex === oldRichText.richCharLL.linkedNodeCount) {
				newRichText.richCharLL.first = null;
				newRichText.richCharLL.last = null;
			} else {
				var dif = 0;
				for (var i = this.cursorIndex; i < oldRichText.richCharLL.linkedNodeCount; i++) {
					var richCharNode = oldRichText.richCharLL.getLinkedNode(i);
					var richChar = richCharNode.object;
					richChar.richText = newRichText;
					oldRichText.remove(richChar);
					newRichText.add(richChar);
					dif++;
				}
				if (this.cursorIndex === 0) {
					newRichText.richCharLL.first = oldRichText.richCharLL.first;
					newRichText.richCharLL.last = oldRichText.richCharLL.last;
					oldRichText.richCharLL.first = null;
					oldRichText.richCharLL.last = null;
				} else if (this.cursorIndex < oldRichText.richCharLL.linkedNodeCount) {
					var charNode = oldRichText.richCharLL.getLinkedNode(this.cursorIndex);
					newRichText.richCharLL.first = charNode;
					oldRichText.richCharLL.last = charNode.previous;
					newRichText.richCharLL.first.previous = null;
					oldRichText.richCharLL.last.next = null;
				}
				oldRichText.richCharLL.linkedNodeCount -= dif;
				newRichText.richCharLL.linkedNodeCount += dif;
			}
		}
		if ((newRichTextNode) && (focus))
			this.setIndex(index);
		this.cursorIndex = 0;
		return newRichTextNode;
	}

	setIndex(index) {
		this.richTextIndex = index;
		this.richTextNode = this.richTextLL.getLinkedNode(this.richTextIndex);
		this.richText = this.richTextNode.object;
		if (this.cursorIndex > this.richTextNode.object.richCharLL.linkedNodeCount)
			this.cursorIndex = this.richTextNode.object.richCharLL.linkedNodeCount;
	}

	getRichText() {
		return this.richTextNode.object;
	}

	moveUp() {
		if (this.richTextIndex > 0) {
			this.setIndex(this.richTextIndex - 1);
		}
	}

	moveDown() {
		if (this.richTextIndex < (this.richTextLL.linkedNodeCount - 1)) {
			this.setIndex(this.richTextIndex + 1);
		}
	}

	editChar(data) {
		var rt = this.richTextNode.object;
		if (rt) {
			rt.editChar(this.cursorIndex, data);
		}
	}

	recalcCharsPos() {
		var nextY = 0;
		var richTextNode = this.richTextLL.first;
		for (var i = 0; i < this.richTextLL.linkedNodeCount; i++) {
			richTextNode.object.position.y = nextY;
			richTextNode = richTextNode.next;
			nextY -= 70;
		}
		if (this.richTextNode) {
			var o = this.richTextNode.object;
			if (o) o.recalcCharsPos();
		}
	}

	calcCursorPos() {
		if (!this.richTextNode)
			return 0;
		var cursorX = this.richTextNode.object.calcCursorPos(this.cursorIndex, this.cursorMesh);
		this.cursorMesh.position.x = cursorX;
		this.cursorMesh.position.y = -(this.richTextIndex * 70) + 35;
		return cursorX;
	}

	moveLeft() {
		if (this.cursorIndex > 0) {
			this.cursorIndex--;
		} else {
			if (this.richTextIndex > 0) {
				this.setIndex(this.richTextIndex - 1);
				this.cursorIndex = this.richTextNode.object.richCharLL.linkedNodeCount;
			}
		}
	}

	moveRight() {
		if (this.cursorIndex < this.richTextNode.object.richCharLL.linkedNodeCount) {
			this.cursorIndex++;
		} else {
			if (this.richTextIndex < (this.richTextLL.linkedNodeCount - 1)) {
				this.setIndex(this.richTextIndex + 1);
				this.cursorIndex = 0;
			}
		}
	}

	moveCursorPos(num) {
		var ll = this.richText.richCharLL;
		this.cursorIndex += num;
		if (this.cursorIndex < 0) {
			this.cursorIndex = 0;
		} else {
			var rt = this.richTextNode.object;
			var ll = rt.richCharLL;
			if (this.cursorIndex > ll.linkedNodeCount) {
				this.cursorIndex = ll.linkedNodeCount;
			}
		}
		this.calcCursorPos();
	}

	del() {
		var ll = this.richText.richCharLL;
		if (this.cursorIndex < ll.linkedNodeCount) {
			var n = ll.getLinkedNode(this.cursorIndex);
			var rc = n.object;
			var rt = this.richText;
			rt.remove(rc);
			rt.richCharLL.delete(this.cursorIndex);
		} else
			this.verifyDelFromTail();
	}

	verifyDelFromTail() {
		var richCharCount = this.richText.richCharLL.linkedNodeCount;
		if (this.cursorIndex !== richCharCount)
			return;
		var nextRichTextNode = null;
		var nextRichText = null;
		var firstCharFromNextRichTextNode = null;
		var firstCharFromNextRichText = null;
		var lastCharFromRichTextNode = null;
		var lastCharFromRichText = null;
		var nextRichTextIndex = this.richTextIndex + 1;
		if (nextRichTextIndex < this.richTextLL.linkedNodeCount) {
			nextRichTextNode = this.richTextLL.getLinkedNode(nextRichTextIndex);
			nextRichText = nextRichTextNode.object;
			var rcll = this.richText.richCharLL;
			var nrcll = nextRichText.richCharLL;
			lastCharFromRichTextNode = rcll.getLinkedNode(rcll.linkedNodeCount - 1);
			if (lastCharFromRichTextNode)
				lastCharFromRichText = lastCharFromRichTextNode.object;
			firstCharFromNextRichTextNode = nrcll.getLinkedNode(0);
			if (firstCharFromNextRichTextNode)
				firstCharFromNextRichText = firstCharFromNextRichTextNode.object;
			if (nextRichText) {
				if (lastCharFromRichTextNode)
				lastCharFromRichTextNode.next = firstCharFromNextRichTextNode;
				if (firstCharFromNextRichTextNode)
				firstCharFromNextRichTextNode.previous = lastCharFromRichTextNode;
				if (nrcll.linkedNodeCount > 0) {
				var richCharAux = null;
				var richCharNodeAux = firstCharFromNextRichTextNode;
				while (richCharNodeAux) {
					richCharAux = richCharNodeAux.object;
					richCharAux.owner = this.richText;
					richCharAux.scene = this.richText;
					nextRichText.remove(richCharAux);
					this.richText.add(richCharAux);
					richCharNodeAux = richCharNodeAux.next;
				}
				/* */
				rcll.last = nrcll.getLinkedNode(nrcll.linkedNodeCount - 1);
				rcll.linkedNodeCount += nrcll.linkedNodeCount;
				nrcll.linkedNodeCount = 0;
				}
				this.richTextLL.delete(nextRichTextIndex);
				/*
				var oldRichText = richText.richCharLL.getLinkedNode(this.cursorIndex);
				richText.richCharLL.delete(this.cursorIndex);
				*/
			}
		}
	}

	backspace() {
		if (this.cursorIndex > 0) {
			this.cursorIndex--;
			this.del();
		} else {
			if (this.richTextIndex > 0) {
				this.setIndex(this.richTextIndex - 1);
				this.cursorIndex = this.richText.richCharLL.linkedNodeCount;
				this.del();
			}
		}
	}
}
