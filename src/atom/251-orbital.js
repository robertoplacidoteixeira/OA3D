class Orbital extends RptCommonAncestor {

	//-------------------------------------------------------------------------------------------------
	// A função "create" é responsável por create objetos das classes OrbitalS, OrbitalP, 
	// OrbitalD e OrbitalF, descendentes de Orbital e que implementam os procedimentos
	// especificos nas respectivas funções descendentes de "create". O orbital3d agrupa a nuvem 
	// contendo as porções de densidade da probabilidade de encontrar-se os elétrons nos átomos, mais os
	// eletróns que orbitam nestas nuvem.
	//-------------------------------------------------------------------------------------------------

	beforePrepare() {
		super.beforePrepare();
		this.proximo = 0;
		this.nuvem = [];
		this.electrons = [];
	}
	
	afterPrepare() {
		super.afterPrepare();
		this.atom3d = this.atom.atom3d;
		this.orbital3d = this.add(this.atom3d,new THREE.Object3D());
		this.electrons3d = this.add(this.orbital3d,new THREE.Object3D());
		this.nuvem3d = this.add(this.orbital3d,new THREE.Object3D());
		this.electrons3d.visible = false;
		this.prepararEixo();
	}

	duringCreate() {
	   super.duringCreate();
	   this.createCloud();
	   this.createElectrons();
	}

	afterCreate() {
	   super.afterCreate();
	   this.rotacionar();
	}
	
	prepararEixo() {
	}
	
	adicionarNaNuvem(objeto3d) {
	   this.add(this.nuvem3d,objeto3d);	
	   this.nuvem.push(objeto3d);
	}

	createCloud() {}

	duringDestroy() {
	   super.duringDestroy();
	   this.destruirEletrons();
	   this.destruirNuvem();
	}

	antesDestruirNuvem() {}

	duringDestroyCloud() {}

	depoisDestruirNuvem() {
		this.electrons3d = this.remove(this.orbital3d,this.electrons3d);
		this.nuvem3d = this.remove(this.orbital3d,this.nuvem3d);
		this.orbital3d = this.remove(this.atom3d,this.orbital3d);
	}

	destruirNuvem() {
	   this.antesDestruirNuvem();
	   this.duringDestroyCloud();
	   this.depoisDestruirNuvem();
	}

	criarEletron(){
		var electron = new Electron({orbital: this});
		this.electrons.push(electron);
		return electron;
	}

	createElectrons() {
	   this.criarEletron();
	}

	destruirEletrons() {
		var tam = this.electrons.length-1;
		for (var i = tam; i >= 0; i--) {
			this.electrons[i].destroy();
			this.electrons.pop();
		}
	}

	visibilidadeNuvem(valor) {
		if (valor === undefined) valor = this.nuvem3d.visible; else this.nuvem3d.visible = valor;
		return valor;
		/*
		this.nuvem.forEach(function(obj) {
				obj.visible = valor;
			});
		*/
	}

	visibilidadeEletrons(valor) {
		if (valor === undefined) valor = this.electrons3d.visible; else this.electrons3d.visible = valor;
	}

	visibility(valorNuvem, valorEletrons) {
		if (valorNuvem === undefined) {
			valor = (this.nuvem3d.visible || this.electrons3d.visible);
		} else
			if (!valorEletrons) valorEletrons = valorNuvem;
			this.visibilidadeNuvem(valorNuvem,false);
			this.visibilidadeEletrons(valorEletrons,false);
		return valor;
	}

	rotacionar() {}

	moveElectrons(RandomMove) {}

}
