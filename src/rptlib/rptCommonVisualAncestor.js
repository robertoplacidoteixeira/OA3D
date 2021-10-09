class CommonVisualAncestor extends RptCommonAncestor {
	
	afterPrepare() {
		super.afterPrepare();
		this.geometry = (this.data && this.createGeometry) ? this.createGeometry() : undefined;
		this.material  = (this.data && this.createMaterial)  ? this.createMaterial()  : undefined;
	}

	createGeometry() {return null}

	createMaterial() {return null}
}
