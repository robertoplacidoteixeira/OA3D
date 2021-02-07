class CenarioAtomicoBasico extends CenarioAtomico {

	criarMaterialPhong(cor,opacidade) {
		return new THREE.MeshPhongMaterial({color: cor, transparent: true, opacity: opacidade, side: THREE.DoubleSide, depthWrite: false})
	}

	antesCriar() {
		super.antesCriar();
		this.raioEletrons = 3;
		this.raioNucleo = 2;
	}

	criarMateriaisOrbitais() {
		this.materialS = [this.criarMaterialPhong("#880000",0.1)];
		this.materialP = [this.criarMaterialPhong("#008800",0.3),this.criarMaterialPhong("#008800",0.1)];
		this.materialD = [this.criarMaterialPhong("#000088",0.3),this.criarMaterialPhong("#000088",0.1)];
		this.materialF = [this.criarMaterialPhong("#880088",0.3),this.criarMaterialPhong("#880088",0.1)];
		this.materialUltimoOrbital = [this.criarMaterialPhong("#ff6600",0.3),this.criarMaterialPhong("#880088",0.3)]
	}

	criarMateriaisEletrons() {
		this.materialEletronS = this.criarMaterialPhong("#FF0000", 1);
		this.materialEletronP = this.criarMaterialPhong("#00FF00", 1);
		this.materialEletronD = this.criarMaterialPhong("#0000FF", 1);
		this.materialEletronF = this.criarMaterialPhong("#880088", 1);
	}

	criarMateriaisNucleo() {
		this.materialProton = this.criarMaterialPhong("purple", 1);
		this.materialNeutron = this.criarMaterialPhong("yellow",1);
	}

	criarGeometrias() {
 		this.geometriaEletron = new THREE.SphereGeometry/*BufferGeometry*/(this.raioEletron,50,50,0,doisPi,0,doisPi);
		this.geometriaNucleo = new THREE.SphereGeometry/*BufferGeometry*/(this.raioNucleo,50,50,0,doisPi,0,doisPi);
	}
	
	criarLuzes() {
		// 
		var auxCena = this.cena;
		//
		auxCena.add(new THREE.AmbientLight(0xFFFFFF));
		//
		var orbAtual = elementos[this.dados.zElemento-1].orb;
		var raioAtual = orbAtual[3];
		//
		var distanciaPontoLuz = raioAtual * 2;
		//
		function criarPontoLuz(cor,x,y,z) {
			var pontoLuz = new THREE.PointLight(cor);
			pontoLuz.position.set(x,y,z);
			pontoLuz.castShadow = false;
			auxCena.add(pontoLuz);
			return pontoLuz;
		}
		this.pontoLuz1 = criarPontoLuz(0xffffff,distanciaPontoLuz,0,0);
		this.pontoLuz2 = criarPontoLuz(0xffffff,-distanciaPontoLuz,0,0);
		this.pontoLuz3 = criarPontoLuz(0xffffff,0,distanciaPontoLuz,0);
		this.pontoLuz4 = criarPontoLuz(0xffffff,0,-distanciaPontoLuz,0);
		this.pontoLuz5 = criarPontoLuz(0xffffff,0,0,distanciaPontoLuz);
		this.pontoLuz6 = criarPontoLuz(0xffffff,0,0,-distanciaPontoLuz);
	}

	criarControle() {
		return null; // new MapaControleOrbital(this.camera);
	}
	
	criarMaterialEsferaRaio() {
		this.materialEsferaRaio = this.criarMaterialPhong("#FFFFFF", 0.1);
		return this.materialEsferaRaio;
	}
}
