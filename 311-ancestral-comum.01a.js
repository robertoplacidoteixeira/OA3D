
class AncestralComum {
	constructor(dados) {
		this.dados = dados ? dados : undefined;
		var _this = this;
		if (this.dados) {
			Object.keys(dados).forEach(function(key){_this[key] = dados[key]});
			this.criar();
		}
	}

	criar() {
	   this.antesCriar();
	   this.duranteCriar();
	   this.depoisCriar();
	}

	antesCriar() {
	}

	duranteCriar() {
	}

	depoisCriar() {
	}

	destruir() {
	   this.antesDestruir();
	   this.duranteDestruir();
	   this.depoisDestruir();
	}

	antesDestruir() {
	}

	duranteDestruir() {
	}

	depoisDestruir() {
	}

	adicionar(pai,objeto) {
	   pai.add(objeto);
	   return objeto;
	}

	remover(pai,filho) {
	   if (filho.geometry) {
		  filho.geometry.dispose();
		  //filho.material.dispose();
	   }
	   pai.remove(filho);
	   filho = undefined;
	}
}