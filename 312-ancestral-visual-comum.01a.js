
class AncestralVisualComum extends AncestralComum {
	
	antesCriar() {
	   super.antesCriar(this);
	   if (this.dados && this.dados.criarGeometria) this.geometria = this.dados.criarGeometria; else this.geometria = undefined;
	   if (this.dados && this.dados.criarMaterial) this.material = this.dados.criarMaterial; else this.material = undefined;
	}

	criarGeometria() {
	   if (this.dados && this.dados.criarGeometria) this.geometria = this.dados.criarGeometria();
	}

	criarMaterial() {
	   if (this.dados && this.dados.criarMaterial) this.geometria = this.dados.criarMaterial();
	}

}
