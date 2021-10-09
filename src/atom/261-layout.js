class SceneryLayout extends RptCommonAncestor {

	duringCreate() {
	   super.duringCreate();
	   //this.createLights();
	}


	createLights () {
	}
	
	createRadiusSphereGeometry(radius) {
		return new THREE.SphereGeometry/*BufferGeometry*/(radius,50,50,0,twoPI,0,Math.PI/*twoPI*/);
	}

	createRadiusSphereMesh(radius) {
		this.SphereMeshGeometry = this.createRadiusSphereGeometry(radius);
		this.createRadiusSphereMaterial();
		this.malhaEsferaRaio = (this.SphereMeshGeometry && this.radiusSphereMaterial) ? this.createMesh(this.SphereMeshGeometry,this.radiusSphereMaterial) : null;
		return this.malhaEsferaRaio;
	}

	createMesh(geo_,mat_) {
	   return new THREE.Mesh(geo_,mat_);
	}

	createOrbitalMesh(geo_, mat_) {
		return this.createMesh(geo_,mat_);
	}
}
