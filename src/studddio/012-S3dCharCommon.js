class S3dCharCommon extends S3dObject3D {
	constructor(owner, textSizeModel, material, geoStock) {
		super();
		this.owner = owner;
   
	if (textSizeModel) {
		this.textSizeModel = textSizeModel;
	} else {
		if (this.owner) {
			this.textSizeModel = this.tjlEditor.textSizeModel;
		}
	}
	if (material) {
		this.material = material;
	} else {
		if (this.owner) {
			this.material = this.tjlEditor.material;
		}
	}
	/*
	if (geoStock) {
		this.geoStock = (geoStock) ? 
			geoStock : 
			((this.owner) && (this.tjlEditor.geoStock)) ? this.tjlEditor.geoStock : new RptGeoStockChar();
	}
	*/
}
