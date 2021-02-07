class Aplicativo extends AncestralComum {
	
	antesCriar() {
	   super.antesCriar();
	   this.filme = undefined;
	   this.cenario = undefined;
	}

	depoisCriar() {
		super.depoisCriar()
		if (this.dados.animar) animar();
	}
}