class AtomBasicSceneryLayout extends AtomSceneryLayout {

	criarMaterialPhong(color_,opacity) {
		return new THREE.MeshPhongMaterial({
			color: color_,
			transparent: true,
			opacity: opacity,
			wireframe: false,
			depthWrite: false,
			side: THREE.DoubleSide
		})
	}

	createOrbitalsMaterials() {
		let cp = $g.colors.pos;
		let cn = $g.colors.neg;
		let t = this;
		function createMaterial(name,perc1,perc2) {
			let posColor = cp[name];
			let negColor = cn[name];
			let m11 = t.createOrbitalMaterial(posColor,perc1);
			let m12 = t.createOrbitalMaterial(posColor,perc2);
			let m21 = t.createOrbitalMaterial(negColor,perc1);
			let m22 = t.createOrbitalMaterial(negColor,perc2);
			return [[m11,m12],[m21,m22]];
		}
		this.materialS = createMaterial("s",0.3,0.1);
		this.materialP = createMaterial("p",0.3,0.1);
		this.materialD = createMaterial("d",0.3,0.1);
		this.materialF = createMaterial("f",0.3,0.1);
		this.orbitalRadiusMaterial = [createMaterial("r",0.3,0.1)]
	}

	createOrbitalMaterial(color,perc) {
		return this.criarMaterialPhong(color,perc);
	}

	createElectronsMaterials() {
		this.materialEletronS = this.criarMaterialPhong("#FF0000", 1);
		this.materialEletronP = this.criarMaterialPhong("#00FF00", 1);
		this.materialEletronD = this.criarMaterialPhong("#0000FF", 1);
		this.materialEletronF = this.criarMaterialPhong("#880088", 1);
	}

	createNucleusMaterials() {
		this.materialProton = this.criarMaterialPhong("purple", 1);
		this.materialNeutron = this.criarMaterialPhong("yellow",1);
	}

	createLights(scene) {
		scene.add(new THREE.AmbientLight(0xFFFFFF));
		return;
		/*
		scene.add(this.pointLight1 = new THREE.PointLight(0xffffff,1.0));
		this.pointLight1.position.set(100,100,100);
		return;
		// criar o plano de terra
		var geometriaPlano = new THREE.PlaneGeometry(60, 20);
		var materialPlano = new THREE.MeshLambertMaterial({color: 0xffffff});
		var plano = new THREE.Mesh(geometriaPlano, materialPlano);
		plano.receiveShadow = true;
		// girar e posicionar o plano
		plano.rotation.x = -0.5 * Math.PI;
		plano.position.x = 15;
		plano.position.y = 0;
		plano.position.z = 0;
		// adicionar o plano na cena
		cena.add(plano)
		return;
		scene.add(this.pointLight1 = new THREE.PointLight(0xffffff,1.0));
		scene.add(this.pointLight2 = new THREE.PointLight(0xffffff,1.0));
		scene.add(this.pointLight3 = new THREE.PointLight(0xffffff,1.0));
		scene.add(this.pointLight4 = new THREE.PointLight(0xffffff,1.0));
		scene.add(this.pointLight5 = new THREE.PointLight(0xffffff,1.0));
		scene.add(this.pointLight6 = new THREE.PointLight(0xffffff,1.0));
		this.adjustLights();
		*/
	}

	adjustLights() {
		var pointLightDistance = 400;
		this.pointLight1.position.set(pointLightDistance,0,0);
		this.pointLight2.position.set(-pointLightDistance,0,0);
		this.pointLight3.position.set(0,pointLightDistance,0);
		this.pointLight4.position.set(0,-pointLightDistance,0);
		this.pointLight5.position.set(0,0,pointLightDistance);
		this.pointLight6.position.set(0,0,-pointLightDistance);
	}

	adjustLightsDistance() {
	}

	createRadiusSphereMaterial() {
		this.radiusSphereMaterial = this.criarMaterialPhong("#FFFFFF", 0.1);
		return this.radiusSphereMaterial;
	}

	clearColor() {
		return 0xFFFFFF;
	}
}
