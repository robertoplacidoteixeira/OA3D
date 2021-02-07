class OrbitalP extends OrbitalLobular {
	
	get primeiroNivelOcorrencia() {
		return 2;
	}
		
	get criarNodoOrbital() {
		return (this.nivel !== this.primeiroNivelOcorrencia);
	}
	
	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   switch (this.eixo) {
		  case x:
			rot.z = -meioPi * this.direcao;
			break;
		  case y:
			if (this.direcao === -1) rot.z = -pi;
			break;
		  case z:
			rot.x = meioPi * this.direcao;
	   }
	}

	criarNuvem() {
	   super.criarNuvem();
	   this.criarLobulos([0],false);
	}

	criarEixosDirecoes() {
	   this.eixosDirecoes = [[x,1],[z,1],[y,1],[x,-1],[z,-1],[y,-1]];
	}
}
