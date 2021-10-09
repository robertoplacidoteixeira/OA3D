class S3dBox extends S3dMesh {
	
	afterPrepare() {
		super.afterPrepare();
		this.width = null;
		this.facesUrls = null;
		this.setBoxParam(data);
		//this.createObj3d();
	}

	setData() {
		super.setData();
		if (this.width) {
			//this.dim = this.width;
			this.x = (this.dim.x) ? this.dim.x : 1;
			this.y = (this.dim.y) ? this.dim.y : 1;
			this.z = (this.dim.z) ? this.dim.z : 1;
		} else {
			this.dim = {x: 1, y: 1, z: 1}
		}
	}
	
	getGeometry() {
		new THREE.BoxGeometry(this.width, this.width, this.width, 1, 1, 1);
	}

	prepareMaterial() {
		if (this.facesUrls) {
			this.faces = [
				this.createCubeFace(faces.f1),
				this.createCubeFace(faces.f2),
				this.createCubeFace(faces.f3),
				this.createCubeFace(faces.f4),
				this.createCubeFace(faces.f5),
				this.createCubeFace(faces.f6)
			];
			this.material = new THREE.MeshFaceMaterial(this.material);
		}
	}

	createCubeFace(face) {
		return new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture(face)});
	}
}
