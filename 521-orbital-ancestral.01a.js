class OrbitalAncestral extends Geometria {

	//-------------------------------------------------------------------------------------------------
	// A função "criar" é responsável por criar objetos das classes OrbitalS, OrbitalP, 
	// OrbitalD e OrbitalF, descendentes de OrbitalAncestral e que implementam os procedimentos
	// especificos nas respectivas funções descendentes de "criar". O orbital3d agrupa a nuvem 
	// contendo as porções de densidade da probabilidade de encontrar-se os elétrons nos átomos, mais os
	// eletróns que orbitam nestas nuvem.
	//-------------------------------------------------------------------------------------------------

	antesCriar() {
	   super.antesCriar();
	   this.proximo = 0;
	}

	duranteCriar() {
	   super.duranteCriar();
	   this.preparar();
	   this.criarNuvem();
	   this.criarEletrons();
	   this.rotacionar();
	}

	duranteDestruir() {
	   super.duranteDestruir();
	   this.destruirEletrons();
	   this.destruirNuvem();
	}

	preparar() {
	   this.nuvem = [];
	   this.eletrons = [];
	   this.orbital3d = this.adicionar(this.atomo.atomo3d,new THREE.Object3D());
	}

	AdicionarNaNuvem(objeto) {
	   this.adicionar(this.orbital3d,objeto);	
	   //this.orbital3d.add(objeto);
	   this.nuvem.push(objeto);
	   return objeto;
	}

	criarNuvem() {}

	antesDestruirNuvem() {}

	duranteDestruirNuvem() {}

	depoisDestruirNuvem() {
	   this.remover(this.atomo.atomo3d,this.orbital3d);
	   this.orbital3d = undefined;
	   //this.atomo.atomo3d.remove(this.orbital3d);
	}

	destruirNuvem() {
	   this.antesDestruirNuvem();
	   this.duranteDestruirNuvem();
	   this.depoisDestruirNuvem();
	}

	criarEletron(){
	   this.eletron = new Eletron({orbital: this, cenario: this.cenario});
	   this.eletrons.push(this.eletron);
	   return this.eletron;
	}

	criarEletrons() {
	   this.criarEletron();
	}

	destruirEletrons() {
	   for (var i = this.eletrons.length-1; i >=0; i--) {
		  this.eletrons[i].destruir();
		  this.eletrons.pop();
	   }
	}

	rotacionar() {}

	movimentarEletrons() {}

}
