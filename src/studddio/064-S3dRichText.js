class S3dRichText extends S3dObject3D {
	
	afterPrepare() {
		super.afterPrepare();
		this.richCharLL = new RptLinkedList();
		this.size = this.textSizeModel.size;
	}
	
	setY(y_) {
		this.obj3d.position.y = y_;
	}

	duringCreate() {
		super.duringCreate();
		this.setStr(this.str);
	}

	clearStr() {
		while (this.richCharLL.linkedNodeCount > 0) {
			var rc = this.richCharLL.getLinkedNode(0).object;
			if (rc)	this.obj3.remove(rc);
			this.richCharLL.delete(0);
		}
	}

	setStr(str) {
		this.clearStr();
		this.richCharLL.first = null;
		this.richCharLL.last = null;
		var len  = str.length;
		for (var i = 0; i < len; i++) {
			var rc = new S3dRichChar($g.factory.data.s3d.richCharData(
				str.charAt(i),this,this.obj3d,{x:0,y:0,z:0},{x:0,y:0,z:0},this.textSizeModel,this.material,null,function(){}));
			this.richCharLL.insert(i, rc);
		}
		this.recalcCharsPos();
	}
	
	maxSize() {
		var dif;
		var max = 0;
		var n = this.richCharLL.first;
		while (n) {
			dif = n.object.max.y - n.object.min.y;
			if (dif > max) max = dif;
			n = n.next;
		}
		return max;
	}

	editChar(cursorIndex, data) {
		data.owner = this;
		data.scene = this.obj3d;
		var richChar = new S3dRichChar(data);
		if (cursorIndex <= this.richCharLL.linkedNodeCount) {
			if (data.flagIns) {
				this.richCharLL.insert(cursorIndex, richChar);
			} else {
				this.richCharLL.replace(cursorIndex, richChar);
			}
		}
	}

	forEachChar(maxIndex, charFunction) {
		var nextX = 0;
		var n = this.richCharLL.first;
		while (n) {
			var rc = n.object;
			if (charFunction) charFunction(rc, nextX);
			nextX += (rc.hsep +((rc.str === " ") ? (rc.spaceWidth + rc.hsep) : Math.abs(rc.max.x - rc.min.x)));
			n = n.next;
		}
		return nextX;
	}

	recalcCharsPos() {
		var f = function(richChar, nextX) {
			richChar.obj3d.position.x = nextX;
		}
		return this.forEachChar(this.richCharLL.linkedNodeCount, f);
	}

	calcCursorPos(cursorIndex) {
		if (cursorIndex < 0) {
			cursorIndex = 0;
		} else if (cursorIndex > this.richCharLL.linkedNodeCount) {
			cursorIndex = this.richCharLL.linkedNodeCount;
		}
		return this.forEachChar(cursorIndex, null);
	}
}
