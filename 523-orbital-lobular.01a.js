class OrbitalLobular extends OrbitalAncestral {

	antesCriar() {
		super.antesCriar();
		this.config         = {numPartes: 10, numPartesCone: 8, numPartesEsfera: 2};
		this.alturaCone     = this.raio / this.config.numPartes * this.config.numPartesCone;
		this.meiaAlturaCone = this.alturaCone / 2;
		this.raioEsfera     = this.raio / this.config.numPartes * this.config.numPartesEsfera;
		this.meioRaio       = this.raio / 2;
		this.criarEixosDirecoes();
	}

	criarEixosDirecoes() {
	}
	
	criarMalhaEsferaLobulo() {
		this.geometriaEsfera = this.criarGeometriaEsfera(this.raioEsfera,36,36/*128,128*/,0,doisPi,0,meioPi,this);
		return this.cenario.criarMalhaOrbital(this.geometriaEsfera,this.material[0]);
	}
	
	get criarNodoOrbital() {
		return true;
	}

	criarMalhaConeLobulo() {
		this.raioEsferaNodo = (this.criarNodoOrbital) ? this.raioEsfera * 0.8 : 0;
		this.alturaConeNodo = (this.criarNodoOrbital) ? this.alturaCone * 0.2 : this.alturaCone;
		this.geometriaCone = this.criarGeometriaCone(this.raioEsfera,this.raioEsferaNodo,this.alturaConeNodo,36,36/*128,128*/,true,doisPi,doisPi,this);
		//this.geometriaCone = this.criarGeometriaCone(this.raioEsfera,0,this.alturaCone,36,36/*128,128*/,true,doisPi,doisPi,this);
		var m = this.cenario.criarMalhaOrbital(this.geometriaCone,this.material[1]);
		//m.position.y = this.alturaCone*0.8;
		return m;
	}

	criarMalhaTorus() {
	   var raioTorusInterno = this.raio / 20;
	   var raioTorusExterno = raioTorusInterno * 2;
	   var distanciaTorus = -raioTorusInterno;
	   this.geometriaTorus = this.criarGeometriaTorus(raioTorusExterno,raioTorusInterno,36,36,doisPi/*128,128,Math.PI*/);
	   this.malhaTorus =  this.cenario.criarMalhaOrbital(this.geometriaTorus,this.material[0]);
	   this.malhaTorus.position.y = this.cone.position.y - raioTorusInterno ;
	   this.malhaTorus.rotation.x = meioPi;
	   return this.malhaTorus;
	}

	criarLobulo(criarTorus) {
		this.lobulo = new THREE.Object3D();
		this.cone = this.criarMalhaConeLobulo();
		this.lobulo.cone = this.adicionar(this.lobulo,this.cone);
		this.esfera = this.criarMalhaEsferaLobulo();
		this.lobulo.esfera = this.adicionar(this.lobulo,this.esfera);
		var yc = this.meioRaio - (this.raioEsfera / 2);
		if (this.criarNodoOrbital) {
			this.cone.position.y = yc + (this.meiaAlturaCone * 0.8);
		} else {
			this.lobulo.cone.position.y = yc;
		}
		this.lobulo.esfera.position.y = yc + this.meiaAlturaCone;
		if (criarTorus) {
			this.torus = this.criarMalhaTorus();
			this.lobulo.torus = this.adicionar(this.lobulo,this.torus)
		}
		return this.lobulo;
	}
	
	criarLobulos(angulos,torus) {
	   for (var i = 0; i < angulos.length; i++) {
		  var lobulo = this.criarLobulo(torus);
		  lobulo.rotation.z = angulos[i];
		  this.AdicionarNaNuvem(lobulo);
	   }
	}

	preparar() {
	   super.preparar();
	   var aux = this.eixosDirecoes[this.numEletronsOrbital-1];
	   this.eixo = aux[0];
	   this.direcao = aux[1];
	}

	criarNuvem() {
	   super.criarNuvem();
	}

	duranteDestruirNuvem() {
	   super.duranteDestruirNuvem();
	   for (var i = (this.nuvem.length-1); i >= 0; i--) {
		  var lobulo = this.nuvem[i];
		  this.remover(lobulo,lobulo.cone);
		  lobulo.cone = undefined;
		  this.remover(lobulo,lobulo.esfera);      
		  lobulo.esfera = undefined;
		  if (lobulo.torus) {
			 this.remover(lobulo,lobulo.torus);
			 lobulo.torus = undefined;
		  }
		  this.remover(this.orbital3d,lobulo);
		  this.nuvem[i] = undefined;
		  this.nuvem.pop();
	   }
	}

	rotacionar() {
	   super.rotacionar();
	   this.orbital3d.rotation.set(0,0,0);
	}

	movimentarEletrons() {
		// if (this.nuvem.length < 3) return;
		super.movimentarEletrons();
		var lobulo = this.nuvem[this.proximo++];
		if (this.proximo === this.nuvem.length) this.proximo = 0;
		var eletron = this.eletrons[0];
		var eletron3d = eletron.obterEletron3d();
		eletron3d.rotation.copy(lobulo.rotation);
		/*
		eletron3d.malha.position.y = Math.random() * this.raio;
		eletron3d.malha.position.x = (eletron3d.malha.position.y > this.alturaCone) ?
			(Math.cos(Math.asin((eletron3d.malha.position.y - this.alturaCone) / this.raioEsfera)) * this.raioEsfera) : 
			(eletron3d.malha.position.y * this.raioEsfera) / this.raio;
		eletron3d.malha.position.y = Math.random() * this.raio;
		*/
		eletron3d.malha.position.y = (Math.random() * this.raioEsfera) + this.alturaCone;
		eletron3d.malha.position.x = (eletron3d.malha.position.y > this.alturaCone) ?
			(Math.cos(Math.asin((eletron3d.malha.position.y - this.alturaCone) / this.raioEsfera)) * this.raioEsfera) : 
			(eletron3d.malha.position.y * this.raioEsfera) / this.raio;
		eletron3d.rotation.y = Math.random() * doisPi;
	}
}
