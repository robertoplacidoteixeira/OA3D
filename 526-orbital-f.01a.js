class OrbitalF extends OrbitalLobular {	

	primeiroNivelOcorrencia() {
		return 6;
	}
	
	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   switch(this.eixo) {
		  case xx2y2:
			rot.z = quartoPi * this.direcao;
			break;
		  case xyz:
			rot.z = quartoPi * this.direcao;
			rot.y = -quartoPi * this.direcao;
			break;
		  case xz2:
			rot.z = meioPi * this.direcao;
			rot.x = meioPi * this.direcao;
			break;
		  case z3:
			rot.x = meioPi;
			break;
		  case yz2:
			rot.y = meioPi * this.direcao;
			break;
		  case zx2y2:
			rot.z = quartoPi * this.direcao;
			break;
		  case yx2y2:
			// rot.x = meioPi * this.direcao;
	   }
	}

	criarNuvem() { 
	   super.criarNuvem();
	   if (this.eixo === z3)
		  this.criarLobulos([0],true);
	   else
		  if ((this.eixo === xyz) || (this.eixo === zx2y2))
			 this.criarLobulos([0 , -pi / 2 , -pi , -3 * pi / 2] , false);  /* composição lobular de 4 lóbulos */
		  else
			 this.criarLobulos([0 , -2 * pi / 3 , -4 * pi / 3] , false);    /* composição lobular de 3 lóbulos */
	}

	criarEixosDirecoes() {
	   this.eixosDirecoes = [[xx2y2,1],[xyz,1],[xz2,1],[z3,1],[yz2,1],[zx2y2,1],[yx2y2,1],[xx2y2,-1],[xyz,-1],[xz2,-1],[z3,-1],[yz2,-1],[zx2y2,-1],[yx2y2,-1]];
	}
}
