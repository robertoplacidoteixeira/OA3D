class Atomo extends AncestralComum {
		
	antesCriar() {
		super.antesCriar();
		this.nivelOrbitalSendoCarregadoAnt = -1;
		this.subNivelOrbitalSendoCarregadoAnt = -1;
		this.niveis = [];
	}

	duranteCriar() {
		super.duranteCriar();
		this.numElementoVetor = this.numElemento-1;
		this.forcarInterromperCarregamento = false;
		this.atomo3d = this.adicionar(this.possuidor,new THREE.Object3D());
		this.Orbitais = [OrbitalS,OrbitalP,OrbitalD,OrbitalF];
		this.nucleo = new Nucleo({
			atomo: this,
			cenario: this.cenario,
			raio: 2,
			numProtonsNeutrons: this.numElemento, 
			geometria: this.cenario.geometriaNucleo
		});
		this.posX = 0;
		this.orbitais = [];
		this.orbUltimoOrbital = this.elementos[this.numElementoVetor].orb;
		this.nivelUltimoOrbital = this.orbUltimoOrbital[0];
		this.subNivelUltimoOrbital = this.orbUltimoOrbital[1];
		this.numEletronUltimoOrbital = this.orbUltimoOrbital[2];
		this.raioUltimoOrbital = this.orbUltimoOrbital[3];
		this.raioComprimidoAtual = this.orbUltimoOrbital[4];
		this.racsElemento = this.raios_atomicos_calculados_rac[this.numElementoVetor];
		this.racs = this.racsElemento[2];
		this.numRacs = this.racs.length;
		//
		this.proximoNumElementoVetor = 0;
		//
		if (this.usarAxis) this.atomo3d.add(new THREE.AxesHelper(this.raioUltimoOrbital*2));
		//
		this.orbitaisCarregados = false;
		this.continuarCarregando = true;
		//
		this.verificarEstadoCarregamento();
	}

	duranteDestruir() {
		super.duranteDestruir();
		this.forcarInterromperCarregamento = true;
		for (var i = this.orbitais.length-1; i >=0; i--) {
			this.orbitais[i].destruir();
			this.orbitais.pop();
		}
		this.possuidor.remove(this.atomo3d);
	}

	carregarOrbitais() {
		while (this.continuarCarregando) this.verificarCarregamentoOrbital();
	}

	verificarEstadoCarregamento(){
		this.ultimoOrbital = (this.proximoNumElementoVetor === this.numElementoVetor);
		this.continuarCarregando = (!this.forcarInterromperCarregamento && (this.proximoNumElementoVetor < this.numElemento));
		this.orbitaisCarregados = !this.continuarCarregando;
	}

	verificarCarregamentoOrbital() {
		if (this.orbitaisCarregados) return false;
		this.momentoAgora = new Date().getTime();
		if (this.momentoAgora < this.proximoMomento) return false;
		var criou = this.verificarCriarOrbital();
		if (criou)
			if ((this.ultimoOrbital) && (this.subNivelUltimoOrbital !== s))
				this.atomo3d.add(this.cenario.criarMalhaEsferaRaio(this.raioUltimoOrbital));
		return criou;
	}

	verificarCriarOrbital() {
		var auxTempo = (this.carregar) ? 0 : this.tempoEspera;
		this.orbitalSendoCarregado = this.elementos[this.proximoNumElementoVetor].orb;
		this.nivelOrbitalSendoCarregado = this.orbitalSendoCarregado[0];
		this.subNivelOrbitalSendoCarregado = this.orbitalSendoCarregado[1];
		this.numEletronOrbitalSendoCarregado = this.orbitalSendoCarregado[2];
		this.raioOrbitalSendoCarregado = this.orbitalSendoCarregado[3];
		//this.raioComprimido = this.orbitalSendoCarregado[4]; 
		var criarOrbital = ( ( 
			(this.subNivelOrbitalSendoCarregado === s) && ( ( (this.numEletronOrbitalSendoCarregado === 1) && 
				(this.ultimoOrbital) ) || (this.numEletronOrbitalSendoCarregado === 2) ) ) || 
			(this.subNivelOrbitalSendoCarregado === p) || 
			(this.subNivelOrbitalSendoCarregado === d) || 
			(this.subNivelOrbitalSendoCarregado === f) );
		if (criarOrbital) {
			this.proximoMomento = this.momentoAgora + auxTempo;
			this.esperar = true;
			this.criarOrbital();
			//this.criarEletronOrbital();
			this.esperar = false;
		}
		this.proximoNumElementoVetor++;
		this.verificarEstadoCarregamento();
		return criarOrbital;
	}

	criarOrbital() {
		this.raio = ((this.nivelOrbitalSendoCarregado === this.nivelUltimoOrbital) && (this.subNivelOrbitalSendoCarregado === this.subNivelUltimoOrbital)) ? 
			this.raioUltimoOrbital : this.raioRacs();

		if (this.espichar === "1") {
			this.posX = (this.subNivelOrbitalSendoCarregado === s) ? this.posX + (this.raioOrbitalSendoCarregado*2) + 10 :  this.posX + (this.raioOrbitalSendoCarregado*2) + 10;
			this.orbital.position.x = this.posX;
		}

		this.novoNivel = (this.nivelOrbitalSendoCarregado !== this.nivelOrbitalSendoCarregadoAnt);
		if (this.novoNivel)	{
			this.subNivelOrbitalSendoCarregadoAnt = -1;
			this.niveis.push({num: this.nivelOrbitalSendoCarregado, subNiveis: []});
		}

		this.nivel = this.niveis[this.nivelOrbitalSendoCarregado-1];
		
		this.novoSubNivel = (this.subNivelOrbitalSendoCarregado !== this.subNivelOrbitalSendoCarregadoAnt);
		
		if (this.novoSubNivel) {
			this.nivel.subNiveis.push({num: this.subNivelOrbitalSendoCarregado, orbitais:[]});
		}

		this.subNivel = this.nivel.subNiveis[this.subNivelOrbitalSendoCarregado];
		
		this.numOrbitalSubnivel = (this.subNivel === s) ?  
			this.numEletronOrbitalSendoCarregado : 
			this.subNivel.orbitais.length + 1;

		this.novoOrbital();
		
		this.subNivel.orbitais.push(this.orbital);
		
		this.nivelOrbitalSendoCarregadoAnt = this.nivelOrbitalSendoCarregado;	
		this.subNivelOrbitalSendoCarregadoAnt = this.subNivelOrbitalSendoCarregado;

		this.orbitais.push(this.orbital);
	}

	novoOrbital() {
		var n = this.nivelOrbitalSendoCarregado;
		var sn = this.subNivelOrbitalSendoCarregado;
		var material = this.ultimoOrbital ? [this.cenario.materiais[sn][0],this.cenario.materialUltimoOrbital[0]] : this.cenario.materiais[sn];
		var materialEletron = this.cenario.materiaisEletron[sn];
		var Orbital = this.Orbitais[sn];
		this.orbital = new Orbital({
			atomo: this,
			nivel: n,
			subNivel: sn,
			numOrbitalSubNivel: this.numOrbitalSubNivel,
			raio: this.raio,
			cenario: this.cenario,
			material: material,
			materialEletron: materialEletron,
			numEletronsOrbital: this.numEletronOrbitalSendoCarregado});
	}

	/*
	criarEletronOrbital(){
		this.atomo3d.eletron = new THREE.Object3D();
		this.atomo3d.eletron = this.atomo3d.eletron;
		this.atomo3d.add(this.atomo3d.eletron);
		this.atomo3d.eletron.malha = new THREE.Mesh(geometriaEletron,materialEletron);
		this.atomo3d.eletron.add(this.atomo3d.eletron.malha);
		this.atomo3d.eletron.malha.position.y = this.raio;
	}
	*/

	/*
	renderizar() {
		this.renderer.render(this.cena,this.camera);
	}
	*/

	movimentarEletrons() {
		if (this.movimentar) {
			var n = this.orbitais.length;
			for (var i = 0; i < n; i++) this.orbitais[i].movimentarEletrons();
		}
	}

	raioRacs() {
		var raioOrbitalSendoCarregado = 0;
		var achou = false;
		for (var k = 0; (k < this.numRacs-1) && (!achou); k++) {
			var auxNS =  this.cabec_rac[k];
			if ((this.nivelOrbitalSendoCarregado === auxNS[0]) && (this.subNivelOrbitalSendoCarregado === auxNS[1])) {
				achou = true;
				raioOrbitalSendoCarregado = this.racs[k];
			}
		}
		return raioOrbitalSendoCarregado;
	}
}
