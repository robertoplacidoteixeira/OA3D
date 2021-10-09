class RptGeoStock extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.geoStock = [];
	}
	
	geoIndex(id) {
		return this.geoStock.findIndex(g => (g.geoStockId === id));
	}

	getGeo(id) {
		var i = this.geoIndex(id);
		return (i === -1) ? null : this.geoStock[i];
	}

	addGeo(id,geometry) {
		geometry.geoStockId = id;
		this.geoStock.push(geometry);
	}
}
