class S3dPlane extends S3dMesh {

	beforePrepare() {
		super.beforePrepare();
		this.texture = null;
	}

	processParams() {
		super.processParams();
		if (this.img) {
			this.texture = (this.img instanceof HTMLImageElement) ? 
				new THREE.Texture(this.img) :
				this.texture = THREE.ImageUtils.loadTexture(this.img);
		}
	}

	getGeometry() {
		return new THREE.PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments); // PlaneBufferGeometry;
	}

	prepareMaterial() {
		if (this.material) {
			if (this.cloneMaterial)	this.material = this.material.clone();
		} else {
			var mat = (this.materialParam) ?
				this.materialParam :
				{color: 0xfefefe, opacity: 0.9, transparent: true}
			mat.map = this.texture;
			this.material = new THREE.MeshBasicMaterial(mat);
		}
	}

	refreshPlane() {
		// this.obj3d.remove(this.obj3d);		
		// this.createPlane();
	}
}
