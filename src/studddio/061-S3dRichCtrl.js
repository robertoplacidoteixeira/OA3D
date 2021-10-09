class S3dRichCtrl extends S3dMesh {
	
	beforePrepare() {
		super.beforePrepare();
		this.hsep = 0;
		this.vsep = 0;
		this.spaceWidth = 0;
		this.textSizeModel = null;
		this.fontFarm = null;
		this.materialFarm = null;
		this.textSizeModelFarm = null;
	}

	setData() {
		super.setData();
		var tsm = this.textSizeModel;
		if (tsm) {
			this.hsep = (tsm.hsep) ? tsm.hsep : (tsm.size) ? tsm.size / 4 : 0;
			this.vsep = (tsm.vsep) ? tsm.vsep : (tsm.size) ? tsm.size / 4 : 0;
			this.spaceWidth = (tsm.spaceWidth) ? tsm.spaceWidth : (tsm.size) ? tsm.size / 3 : 0;
		}
	}

	getGeometry() {
		return $g.factory.geo.textGeometry(this.str,this.textSizeModel);
	}
}
