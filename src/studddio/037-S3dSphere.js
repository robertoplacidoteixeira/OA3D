class S3dSphere extends S3dMesh {
		
	prepareGeometry() {
		super.prepareGeometry();
		if (this.geometry) return;

		var geoParam = {
			x: this.dim.x,
			y: this.dim.y,
			z: this.dim.z
		}

		geoParam.geometryId = this.geometryId;

		this.s3dGeometry = new S3dSphereGeometry(geoParam);
	}
}

