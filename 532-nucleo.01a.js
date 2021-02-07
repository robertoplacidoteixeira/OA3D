class Nucleo extends AncestralVisualComum {

	antesCriar() {
	   super.antesCriar();
	   this.atomo = this.dados.atomo;
	   this.cenario = this.dados.cenario;
	   this.raio = this.dados.raio;
	   this.geometria = this.cenario.geometriaNucleo;
	   this.materialProton = this.cenario.materialProton;
	   this.materialNeutron = this.cenario.materialNeutron;
	}

	duranteCriar() {
	   super.duranteCriar();
	   var variacaoDistancia = this.raio * 2;
	   this.numProtonsNeutrons = this.dados.numProtonsNeutrons;
	   this.nucleo = new THREE.Object3D();
	   var contadorAngulos = 0;
	   var numAngulos = 2;
	   var distancia = 0;
	   if (this.dados.numProtonsNeutrons < 3)
		 distancia = this.raio;
	   else {
		 numAngulos = 4;
		 distancia = variacaoDistancia;
	   }
	   var anguloSegmento = 2 * Math.PI / numAngulos;
	   var anguloProton = 0;
	   var anguloNeutron = anguloSegmento / 2;
	   this.protonsNeutrons = [];
	   for (var i = 0; i < this.dados.numProtonsNeutrons; i++) {
		  if (contadorAngulos === numAngulos) {
			 distancia = distancia + variacaoDistancia;
			 numAngulos = numAngulos * 2;
			 anguloSegmento = 2 * Math.PI / numAngulos;
			 anguloProton = anguloNeutron + (anguloSegmento/2);
			 anguloNeutron = anguloProton + (anguloSegmento/2);
			 contadorAngulos = 0;
		  }
		  contadorAngulos++;
		  this.proton = this.adicionar(this.nucleo,this.criarProtonNeutron(distancia,anguloProton,this.geometria,this.materialProton));
		  anguloProton = anguloProton + anguloSegmento;
		  this.neutron = undefined;
		  if (this.dados.numProtonsNeutrons > 1) {
			 this.neutron = this.adicionar(this.nucleo,this.criarProtonNeutron(distancia,anguloNeutron,this.geometria,this.materialNeutron));
			 anguloNeutron = anguloNeutron + anguloSegmento;
		  }
		  this.protonsNeutrons.push({proton: this.proton, neutron: this.neutron});
	   }
	   this.atomo.atomo3d.add(this.nucleo);
	}

	duranteDestruir() {
	   super.duranteDestruir();
	   // liberar protons e neutrons
	   for (var i = this.protonsNeutrons.length-1; i >= 0; i--) {
		  var protonNeutron = this.protonsNeutrons[i];
		  var proton = protonNeutron.proton;
		  var neutron = protonNeutron.neutron;
		  this.remover(this.nucleo,proton);
		  if (neutron) this.remover(this.nucleo,neutron);
		  this.protonsNeutrons.pop();
		  this.protonsNeutrons[i].proton = undefined;
		  this.protonsNeutrons[i].neutron = undefined;
	   }
	   this.atomo.atomo3d.remove(this.nucleo);
	   this.nucleo = undefined;
	}

	criarProtonNeutron(distancia,angulo,geometria,material) {
	   var malha = new THREE.Mesh(geometria,material);
	   malha.position.x = distancia * Math.cos(angulo);
	   malha.position.y = distancia * Math.sin(angulo);
	   return malha;
	}
}

/*
class MaterialNucleo extends Material {
}
*/

