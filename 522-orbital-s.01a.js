
class OrbitalS extends OrbitalAncestral {
		
	criarNuvem() {
	   super.criarNuvem();
	   var geometria = this.criarGeometriaEsfera(this.raio,128,128,0,doisPi,0,/*Math.PI*/doisPi);
	   this.malha = this.cenario.criarMalhaOrbital(geometria,this.material[0]);
	   this.AdicionarNaNuvem(this.malha);
	}

	duranteDestruirNuvem() {
	   super.duranteDestruirNuvem();
	   this.remover(this.orbital3d,this.malha);
	   this.malha = undefined;
	}

	criarEletrons() {
		super.criarEletrons();
		if (this.numEletronsOrbital === 2) {
			var eletron = this.criarEletron();
			var eletron3d = eletron.obterEletron3d();
			eletron3d.malha.position.y = - eletron3d.malha.position.y;
		}
	}

	movimentarEletrons() {
		super.movimentarEletrons();
		for (var i = 0; i < this.eletrons.length; i++) {
			var eletron = this.eletrons[i];
			var eletron3d = eletron.obterEletron3d();
			eletron3d.rotation.x = Math.random() * doisPi;
			eletron3d.rotation.y = Math.random() * doisPi;
			eletron3d.rotation.z = Math.random() * doisPi;
		}
	}
}
