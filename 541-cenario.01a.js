class Cenario extends AncestralComum {

	antesCriar() {
	   super.antesCriar();
	   this.cpx = this.dados.cpx,
	   this.cpy = this.dados.cpy,
	   this.cpz = this.dados.cpz
	}

	duranteCriar() {
	   super.duranteCriar();
	   this.criarCena();
	   this.criarCamera();
	   this.criarLuzes();
	   this.criarControle();
	}

	criarCena () {
	   this.cena = new THREE.Scene();
	}

	criarCamera () {
	   this.camera = new THREE.PerspectiveCamera(30,window.innerWidth / window.innerHeight,1,50000);
	   this.camera.aspect = window.innerWidth / window.innerHeight;
	   this.camera.updateProjectionMatrix();
	   this.camera.position.set(this.cpx,this.cpy,this.cpz);
	}

	criarLuzes () {
	}

	criarControle () {
	}
	
	criarGeometriaEsferaRaio(raio) {
		return new THREE.SphereGeometry/*BufferGeometry*/(raio,50,50,0,doisPi,0,Math.PI/*doisPi*/);
	}
	
	criarMalhaEsferaRaio(raio) {
		this.geometriaEsferaRaio = this.criarGeometriaEsferaRaio(raio);
		this.criarMaterialEsferaRaio();
		this.malhaEsferaRaio = (this.geometriaEsferaRaio && this.materialEsferaRaio) ? this.criarMalha(this.geometriaEsferaRaio,this.materialEsferaRaio) : null;
		return this.malhaEsferaRaio;
	}

	criarMalha(geometria,material) {
	   return new THREE.Mesh(geometria,material);
	}

	criarMalhaOrbital(geometria, material) {
		return this.criarMalha(geometria,material);
	}
}
