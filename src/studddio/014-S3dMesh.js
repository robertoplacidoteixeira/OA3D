class S3dMesh extends S3dObject3D {
	
	beforePrepare() {
		super.beforePrepare();
		this.geometry = null;
	}

	afterPrepare() {
		super.afterPrepare();
		if (this.dim3) {
			this.x = this.dim3;
			this.y = this.dim3;
			this.z = this.dim3;
		} else if (this.dim) {
			this.x = (this.dim.x) ? this.dim.x : 1;
			this.y = (this.dim.y) ? this.dim.y : 1;
			this.z = (this.dim.z) ? this.dim.z : 1;
	   } else {
			this.dim = {x: 1, y: 1, z: 1}
	   }
	   this.prepareGeometry();
	}

	getGeometry() {
		return null;
	}

	getBox() {
		this.geometry.computeBoundingBox();
		return this.geometry.boundingBox;
	}

	prepareGeometry() {
		this.geometry = $g.stock.geo.getGeo(this.id);
		if (!this.geometry) {
			this.geometry = this.getGeometry(); 			
			$g.stock.geo.addGeo(this.id,this.geometry);
		}
	}

	createObj3d() {
		if ((this.geometry) && (this.material)) {
			this.obj3d = new THREE.Mesh(this.geometry, this.material);
		}
	}
}
