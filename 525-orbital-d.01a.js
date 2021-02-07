class OrbitalD extends OrbitalLobular {

	primeiroNivelOcorrencia() {
		return 4;
	}

	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   rot.set(0,0,0);
	   switch(this.eixo) {
		  case yz:
			 rot.x = pi + (quartoPi * this.direcao);
			 break;
		  case xz:
			 rot.x = -meioPi;
			 rot.z = quartoPi * this.direcao;
			 break;
		  case xy:
			 rot.z = -quartoPi * this.direcao;
			 break;
		  case x2y2:
			 if (this.direcao === 1) rot.z = meioPi;
			 break;
		  case z2:
			 rot.x = meioPi * this.direcao;
	   }
	}

	criarNuvem() {
	   super.criarNuvem();   
	   if (this.eixo === z2) 
		  this.criarLobulos([0],true);
	   else 
		  this.criarLobulos([0,-pi],false);
	}

	   
	criarEixosDirecoes() {
	   this.eixosDirecoes = [[xy,1],[xz,1],[z2,1],[yz,1],[x2y2,1],[xy,-1],[xz,-1],[z2,-1],[yz,-1],[x2y2,-1]];
	}
}
