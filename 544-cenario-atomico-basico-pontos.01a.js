class CenarioAtomicoBasicoPontos extends CenarioAtomicoBasico {
	
	antesCriar() {
	   super.antesCriar();
	   this.tamPonto = 0.1;
	}

	criarGeometriaPontos(geometria,cor) {
		var vertices = geometria.vertices;
		var numVertices = vertices.length;
		var posicoes = new Float32Array(numVertices*3);
		var cores = new Float32Array(numVertices*3);
		//var cor = new THREE.Color(0x00ff00);
		//var cor = solicitante.material[0].color;
		vertices.forEach(function(vertice,i) {
			var x = vertice.x;
			var y = vertice.y;
			var z = vertice.z;
			posicoes[i*3] = x;
			posicoes[i*3+1] = y;
			posicoes[i*3+2] = z;
			// var intensity = ( y + 0.1 ) * 5;
			var intensity = 1;
			cores[i*3] = cor.r * intensity;
			cores[i*3+1] = cor.g * intensity;
			cores[i*3+2] = cor.b * intensity;
		});
		/*
		for (var i = 0; i < numVertices; i++) {
			vertice = vertices[i];
			var x = vertice.x;
			var y = vertice.y;
			var z = vertice.z;
			posicoes[i*3] = x;
			posicoes[i*3+1] = y;
			posicoes[i*3+2] = z;
			// var intensity = ( y + 0.1 ) * 5;
			var intensity = 1;
			cores[i*3] = cor.r * intensity;
			cores[i*3+1] = cor.g * intensity;
			cores[i*3+2] = cor.b * intensity;
		}
		*/
		var geometriaVertices = new THREE.BufferGeometry();
		geometriaVertices.addAttribute("position", new THREE.BufferAttribute(posicoes,3));
		geometriaVertices.addAttribute("color", new THREE.BufferAttribute(cores,3));
		geometriaVertices.computeBoundingBox();
		geometria.dispose();
		geometria = undefined;
		return geometriaVertices;
	}
	
	criarMaterialPontos(cor,opacidade) {
	   return new THREE.PointsMaterial({size: this.tamPonto, color: cor, opacity: opacidade, sizeAttenuation: true, vertexColors: THREE.VertexColors});
	}

	criarMateriaisOrbitais(){
		this.materialS = [this.criarMaterialPontos("#880000",0.9)];
		this.materialP = [this.criarMaterialPontos("#008800",0.9),this.criarMaterialPontos("#008800",0.3)];
		this.materialD = [this.criarMaterialPontos("#000088",0.9),this.criarMaterialPontos("#000088",0.3)];
		this.materialF = [this.criarMaterialPontos("#880088",0.9),this.criarMaterialPontos("#880088",0.3)];
		this.materialUltimoOrbital = [this.criarMaterialPontos("#ff6600",0.3),this.criarMaterialPontos("#880088",0.3)]
	}

	criarMaterialEsferaRaio(){
	   this.materialEsferaRaio = this.criarMaterialPontos("#ffffff", 0.1);
	}
	
	criarCamera () {
	   this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,50000);
	   this.camera.updateMatrix();
	   this.camera.lookAt(this.cena.position);
	   this.camera.position.set(this.cpx,this.cpy,this.cpz);
	}

	criarMalhaEsferaRaio(raio) {
	   var geometria = super.criarGeometriaEsferaRaio(raio,50,50,0,doisPi,0,Math.PI/*doisPi*/);
	   return this.criarMalhaPontos(geometria,this.materialEsferaRaio.color);
	}

	criarMalhaPontos(geometria,material) {
	   return new THREE.Points(geometria,material);
	}

	criarMalhaOrbital(geometria,material) {
	   return this.criarMalhaPontos(this.criarGeometriaPontos(geometria,material.color),material);
	}
}
