class S3dFactory extends RptCommonAncestor  {

	object3d() {
		return  new THREE.Object3D();
	}

	circle(data) {
	   return new S3dCircle(data);
	}

	sphere(data) {
	   return new S3dSphere(data);
	}

	box(data) {
	   return new S3dBox(data);
	}

	plane(data) {
	   return new S3dPlane(data);
	}

	cylinder(data) {
		return new S3dCylinder(data);
	}
}
