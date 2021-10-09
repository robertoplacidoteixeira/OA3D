class AtomCloudPointsSceneryLayout extends AtomBasicSceneryLayout {

	beforePrepare() {
	   super.beforePrepare();
	   this.pointSize = 4;
	}

	createPointsGeo(geometry,color_) {
		var vertices = geometry.vertices;
		var numVertices = vertices.length;
		var posicoes = new Float32Array(numVertices*3);
		var cores = new Float32Array(numVertices*3);
		vertices.forEach(function(vertice,i) {
			var x = vertice.x;
			var y = vertice.y;
			var z = vertice.z;
			posicoes[i*3] = x;
			posicoes[i*3+1] = y;
			posicoes[i*3+2] = z;
			var intensity = 1;
			cores[i*3] = color_.r * intensity;
			cores[i*3+1] = color_.g * intensity;
			cores[i*3+2] = color_.b * intensity;
		});
		var geometriaVertices = new THREE.BufferGeometry();
		geometriaVertices.setAttribute("position", new THREE.BufferAttribute(posicoes,3));
		geometriaVertices.setAttribute("color", new THREE.BufferAttribute(cores,3));
		geometriaVertices.computeBoundingBox();
		geometry.dispose();
		geometry = undefined;
		return geometriaVertices;
	}

	createPointsMaterial(color_,opacity) {
		return new THREE.PointCloudMaterial({
			size: this.pointSize,
			transparent: true,
			opacity: opacity,
			vertexColors: THREE.VertexColors,
			sizeAttenuation: true,
			color: color_
		});
	}

	createOrbitalMaterial(color,perc) {
		return this.createPointsMaterial(color,perc);
	}

	createRadiusSphereMaterial() {
	   this.radiusSphereMaterial = this.createPointsMaterial("#ffffff",0.1);
	}
	
	createRadiusSphereMesh(radius) {
	   var geo = super.createRadiusSphereGeometry(radius,50,50,0,twoPI,0,Math.PI/*twoPI*/);
	   return this.createPointsMesh(geo,this.radiusSphereMaterial.color);
	}

	createPointsMesh(geo_,mat_) {
	   return new THREE.PointCloud(geo_,mat_);
	}

	createOrbitalMesh(geo_,mat_) {
	   return this.createPointsMesh(this.createPointsGeo(geo_,mat_.color),mat_);
	}
}
