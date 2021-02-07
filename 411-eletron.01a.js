class Eletron extends AncestralVisualComum {

	antesCriar() {
	   super.antesCriar();
	   this.orbital = this.dados.orbital;
	   this.cenario = this.dados.cenario;
	   this.geometria = this.cenario.geometriaEletron;
	   this.material = this.orbital.materialEletron;
	   this.cintilacoes = [];
	   this.primeiraCintilacao = null;
	   this.ultimaCintilacao = null;
	   this.numCintilacoes = 0;
	   this.maxCintilacoes = 1; // rever para mais
	   this.opacidadeInicial = 0.05;
	   this.decrescimo = this.opacidadeInicial / this.maxCintilacoes;
	}
	
	depoisCriar() {
		super.depoisCriar();
		this.obterEletron3d();
		this.eletron3d.malha.position.y = this.orbital.raio * 0.9;
	}

	duranteDestruir() {
	   super.duranteDestruir();
	   // liberar eletrons
	   for (var i = this.cintilacoes.length-1; i >= 0; i--) {
		  var eletron3d = this.cintilacoes[i];
		  this.remover(eletron3d,eletron3d.malha);
		  eletron3d.malha = undefined;
		  //eletron3d.malha.material.dispose();
		  this.orbital.orbital3d.remove(eletron3d);
		  this.cintilacoes.pop();
		  eletron3d = undefined;
	   }
	}

	criarMaterialCintilacao() {
	   if (this.maxCintilacoes === 1) return this.material;
	   if (this.numCintilacoes === 0)
		  this.opacidade = 1; 
	   else if(this.numCintilacoes === 1)
		  this.opacidade = this.opacidadeInicial;
	   var material = this.material;
	   //var material = new THREE.MeshPhongMaterial({color: this.material.color, transparent: true, opacity: this.opacidade, side: THREE.DoubleSide, depthWrite: false});
	   this.opacidade = this.opacidade - this.decrescimo;
	   return material;
	}

	criarCintilacao() {
	   var eletron3d = this.adicionar(this.orbital.orbital3d,new THREE.Object3D());
	   eletron3d.indiceCintilacao = this.cintilacoes.length;
	   eletron3d.material = this.criarMaterialCintilacao();
	   eletron3d.malha = this.adicionar(eletron3d,new THREE.Mesh(this.geometria,eletron3d.material));
	   eletron3d.malha.position.y = this.orbital.raio;
	   this.cintilacoes.push(eletron3d);
	   this.eletron3d = eletron3d;
	   this.numCintilacoes++;
	}

	obterEletron3d() {
	   if (this.cintilacoes.length < this.maxCintilacoes) this.criarCintilacao();
	   this.cintilar();
	   this.eletron3d = this.cintilacoes[0];
	   return this.eletron3d;
	}

	cintilar() {
	   for (var i = this.cintilacoes.length-1; i > 0; i--) {
		  var origem = this.cintilacoes[i-1];
		  var destino = this.cintilacoes[i];
		  destino.position.copy(origem.position);
		  destino.rotation.copy(origem.rotation);
		  destino.malha.position.copy(origem.malha.position);
		  destino.malha.rotation.copy(origem.malha.rotation);
	   }
	}
}
