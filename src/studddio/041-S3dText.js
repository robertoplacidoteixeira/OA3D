class S3dText extends S3dObject3D {

	beforePrepare() {
		super.beforePrepare();
		this.normalTextMesh = null;
		this.mirrorTextMesh = null;
		this.geometry = null;
	}
	
	afterPrepare() {
		this.position.copy(this.pos);
	}
	
	duringCreate() {
		super.duringCreate();
		this.createText();
	}

	afterCreate() {
		this.geometry.computeBoundingBox();
		this.geometry.computeVertexNormals();
		// "fix" side normals by removing z-component of normals for side faces
		// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
		if (this.bevelEnabled) this.DrawBevel();
		// var centerOffset = -0.5 * (this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x);
		this.normalTextMesh = this.addMesh(this.getTextMesh(0,this.hover,0,0,Math.PI*2));
		if (this.mirror) this.mirrorTextMesh = this.addMesh(this.getTextMesh(0,-this.hover,this.height,Math.PI,Math.PI*2));
	}
	
	str(t) {
		this.str = t;
	}

	getGeometry() {
		return $g.factory.geo.textGeometry(this.str,this.textSizeModel);
	}
 
	getTextMesh(px, py, pz, rx, ry) {
		var textMesh = null;
		textMesh = new THREE.Mesh(this.geometry, this.material);
		textMesh.position.x = px;
		textMesh.position.y = py;
		textMesh.position.z = pz;
		textMesh.rotation.x = rx;
		textMesh.rotation.y = ry;
		return textMesh;
	}

	addMesh(textMesh) {
		this.obj3d.add(textMesh);
		return textMesh;
	}

	DrawBevel() {
		var triangleAreaHeuristics = 0.1 * (this.height * this.size);
		for (var i = 0; i < this.geometry.faces.length; i++) {
			var face = this.geometry.faces[i];
			if (face.materialIndex === 1) {
				for (var j = 0; j < face.vertexNormals.length; j++) {
					face.vertexNormals[j].z = 0;
					face.vertexNormals[j].normalize();
				}
				var va = this.geometry.vertices[face.a];
				var vb = this.geometry.vertices[face.b];
				var vc = this.geometry.vertices[face.c];
				var s = THREE.GeometryUtils.triangleArea(va, vb, vc);
				if (s > triangleAreaHeuristics) {
					for (var j = 0; j < face.vertexNormals.length; j++) {
						face.vertexNormals[ j ].copy(face.normal);
					}
				}
			}
		}
	}
	/*
	refreshText() {
		this.obj3d.remove(this.normalTextMesh);
		if (this.mirror) this.obj3d.remove(this.mirrorTextMesh);
		if (this.str) this.createText();
	}
	*/
}
