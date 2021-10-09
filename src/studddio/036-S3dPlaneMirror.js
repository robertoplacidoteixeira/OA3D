class S3dPlaneMirror extends S3dObject3D {
	
	beforePrepare() {
		super.beforePrepare();
		this.normalPlaneMesh = null;
		this.mirrorPlaneMesh = null;
		this.planeGeo = null;
		this.texture = null;
	}

	afterPrepare() {
		super.afterPrepare();
		var p = this.pos;
		this.position.set(p.x,p.y,p.z);
		this.planeChain.add(this);
		if (this.textureUrl) this.texture = THREE.ImageUtils.loadTexture(this.textureUrl);
	}
	
	duringCreate() {
		super.duringCreate()();
		this.CreatePlane();
	}

	Plane() {
	}

	CreatePlane() {
		var p = this.planeChain.data;
		/*
			var planeParams = {
			size: this.size,
			height: this.height,
			curveSegments: p.curveSegments,
			material: 0,
			extrudeMaterial: 1
			}
			*/
		this.planeGeo = new THREE.PlaneBufferGeometry(700, 700);

		this.planeGeo.computeBoundingBox();

		//this.planeGeo.computeVertexNormals();

		// var centerOffset = -0.5 * (this.planeGeo.boundingBox.max.x - this.planeGeo.boundingBox.min.x);

		this.normalPlaneMesh = this.addMesh(
					this.getPlaneMesh(0, this.hover, 0, 0, Math.PI * 2));

		if (this.mirror) {
			this.mirrorPlaneMesh = this.addMesh(
						this.getPlaneMesh(0, -this.hover, this.height, Math.PI, Math.PI * 2));
		}
	}

	getPlaneMesh(px, py, pz, rx, ry) {

		var meshMaterialParams = {
			color: 0xfefefe,
			opacity: 0.9,
			transparent: true
		}

		if (this.texture)
			meshMaterialParams.map = this.texture;

		var meshMaterial = new THREE.MeshLambertMaterial(meshMaterialParams);

		var pm = new THREE.Mesh(this.planeGeo, meshMaterial);

		pm.position.x = px;
		pm.position.y = py;
		pm.position.z = pz;

		pm.rotation.x = rx;
		pm.rotation.y = ry;

		return pm;
	}

	addMesh(planeMesh_) {
		this.add(planeMesh_);
		return planeMesh_;
	}

	refreshPlane() {
		updatePermalink();

		this.remove(this.normalPlaneMesh);

		if (this.mirror)
			this.remove(this.mirrorPlaneMesh);

		if (!this.plane)
			return;

		this.CreatePlane();
	}
}
