class S3dRichTexts extends S3dObject3D {
	
	afterPrepare() {
		this.richTextLL = new RptLinkedList();
		this.richTextLL.first = null;
		this.richTextLL.last = null;
	}

	duringCreate() {
		super.duringCreate();
		if (this.textArray) this.addTextPosRotArray();
	}

	addTextPosRotArray() {
		if (!(this.textArray instanceof Array)) return;
		var t = this;
		var i = 0;
		var nextY = 0;
		this.textArray.forEach(function(str_) {
			if ((str_) && ((str_.length === 8) || (str_.length === 10))) {
				var str = str_[0];
				var px  = str_[1];
				var py  = str_[2];
				var pz  = str_[3];
				var rx  = str_[4];
				var ry  = str_[5];
				var rz  = str_[6];
				var tsm = null;
				var mat = null;
				if (str_.lenght === 8) {
					var p = str_[7];
					tsm = p.tsm;
					mat = p.mat;
				} else {
					tsm = str_[7];
					mat = str_[8];
				}
				var rt = t.addTextPosRot(str, t, t.obj3d, px, py, pz, rx, ry, rz, tsm, mat);
				rt.setY(nextY);
				nextY += rt.maxSize();
				t.richTextLL.insert(i++, rt);
			}
		});
		this.recalcTextPos();
	}

	addTextPosRot(str_, owner_, scene_, px_, py_, pz_, rx_, ry_, rz_, textSizeModel_, material_) {
		var rt = new S3dRichText($g.factory.data.s3d.richTextData(
			str_,owner_,scene_,{x: px_, y: py_, z: pz_},{x: rx_, y: ry_, z: rz_},
			textSizeModel_, material_,null,function(){}));
		return rt;
	}

	addMemoPosRot(text_, px_, py_, pz_, rx_, ry_, rz_, textSizeModel_) {
		return new S3dRichMemo();
	}
	
	forEachText(charFunction) {
		var nextY = 0;
		var n = this.richTextLL.first;
		while (n) {
			var rt = n.object;
			if (charFunction) charFunction(rt, nextY);
			nextY -= (rt.maxSize() + rt.textSizeModel.vsep); // Math.abs(rt.max.y - rt.min.y);
			n = n.next;
		}
		return nextY;
	}

	recalcTextPos() {
		var f = function(richText_, nextY_) {
			richText_.obj3d.position.y = nextY_;
		}
		return this.forEachText(f);
	}
}
