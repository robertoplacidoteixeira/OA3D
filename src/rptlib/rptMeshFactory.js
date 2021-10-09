class RptMeshFactory extends RptCommonAncestor  {

	mesh(geo_ ,material_) {
		return new THREE.Mesh(geo_, material_);
	}
	
	cylinderMesh(data_,material_) {
		return this.mesh($g.factory.geo.dataCylinder(data_),material_);
	}
	
	boxMesh(data_,material_) {
		return this.mesh($g.factory.geo.dataBox(data_),material_);
	}
	
	planeMesh(data_,material_) {
		return this.mesh($g.factory.geo.dataPlane(data_),material_);
	}
}
