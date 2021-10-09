class AtomSceneryLayout extends SceneryLayout {

	createOrbitalsMaterials() {
		this.materialS = undefined;
		this.materialP = undefined;
		this.materialD = undefined;
		this.materialF = undefined;
	}

	createElectronsMaterials() {
		this.materialEletronS = undefined;
		this.materialEletronP = undefined;
		this.materialEletronD = undefined;
		this.materialEletronF = undefined;
		this.orbitalRadiusMaterial = undefined;
	}

	createNucleusMaterials() {
		this.materialProton = undefined;
		this.materialNeutron = undefined;
	}
	
	createRadiusSphereMaterial() {
		this.radiusSphereMaterial = undefined;
	}
	
	duringCreate() {
		super.duringCreate();
		this.createOrbitalsMaterials();
		this.createElectronsMaterials();
		this.createNucleusMaterials();
		this.createRadiusSphereMaterial()
	}

	afterCreate() {
	   super.afterCreate();
	   this.materials = [this.materialS,this.materialP,this.materialD,this.materialF];
	   this.materiaisEletron = [this.materialEletronS,this.materialEletronP,this.materialEletronD,this.materialEletronF];
	}

	beforeDestroy() {
		super.beforePrepare();
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
		dispose("orbitalRadiusMaterial"); 
		dispose("materialProton"); 		
		dispose("materialNeutron"); 		
		dispose("radiusSphereMaterial"); 	
		dispose("SphereMeshGeometry");
	}

	clearColor() {
		return 0xFFFFFF;
	}
}
