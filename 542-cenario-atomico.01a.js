class CenarioAtomico extends Cenario {

	criarMateriaisOrbitais() {
		this.materialS = undefined;
		this.materialP = undefined;
		this.materialD = undefined;
		this.materialF = undefined;
	}

	criarMateriaisEletrons() {
		this.materialEletronS = undefined;
		this.materialEletronP = undefined;
		this.materialEletronD = undefined;
		this.materialEletronF = undefined;
		this.materialUltimoOrbital = undefined;
	}

	criarMateriaisNucleo() {
		this.materialProton = undefined;
		this.materialNeutron = undefined;
	}
	
	criarMaterialEsferaRaio() {
		this.materialEsferaRaio = undefined;
	}
	
	criarGeometrias() {
		this.geometriaEletron = undefined;
		this.geometriaNucleo = undefined;
	}

	duranteCriar() {
		super.duranteCriar();
		this.criarMateriaisOrbitais();
		this.criarMateriaisEletrons();
		this.criarMateriaisNucleo();
		this.criarMaterialEsferaRaio()
		this.criarGeometrias();
	}

	depoisCriar() {
	   super.depoisCriar();
	   this.materiais = [this.materialS,this.materialP,this.materialD,this.materialF];
	   this.materiaisEletron = [this.materialEletronS,this.materialEletronP,this.materialEletronD,this.materialEletronF];
	}

	antesDestruir() {
		super.antesCriar();
		function dispose(key) {
			var k = this[key];
			if (k) {
				k.dispose(); 
				k = undefined;
			}
		}
		dispose("materialS"); 		
		dispose("materialP"); 		
		dispose("materialD"); 		
		dispose("materialF"); 		
		dispose("materialEletronS"); 		
		dispose("materialEletronP"); 		
		dispose("materialEletronD"); 		
		dispose("materialEletronF"); 		
		dispose("materialUltimoOrbital"); 
		dispose("geometriaEletron"); 		
		dispose("geometriaNucleo"); 		
		dispose("materialProton"); 		
		dispose("materialNeutron"); 		
		dispose("materialEsferaRaio"); 	
		dispose("geometriaEsferaRaio");
	}
}
