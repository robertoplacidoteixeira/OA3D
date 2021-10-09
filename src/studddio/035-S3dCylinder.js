class S3dCylinder extends S3dMesh {
	
	getGeometry() {
			return new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.RadiusSegments,
				this.openEnded, this.thetaStart, this.thetaLength);
	}
}
