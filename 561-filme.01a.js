class Filme extends AncestralComum {
	
	antesCriar() {
		super.antesCriar();
		this.cenario = this.dados.cenario;
		this.idContainer = this.dados.idContainer;
		this.ativarEstatistica = this.dados.ativarEstatistica;
		this.cena = this.cenario.cena;
		this.camera = this.cenario.camera;
	}

	duranteCriar() {
		super.duranteCriar()
		//
		//this.renderizador = renderizadorFilme;
		//
		this.criarContainer();;
		//
		this.criarRenderer();
		//
		//this.criarCenario(;
		//
		this.estatistica = this.criarEstatistica();
		//
		this.iniciarEstatistica = function() {
			if (this.ativarEstatistica) this.estatistica.begin();
		}
		//
		this.finalizarEstatistica = function() {
			if (this.ativarEstatistica) this.estatistica.end();
		}
		//
		this.renderizar = function() {
			this.renderizador();
		}
	}

	criarContainer() {
	   this.container = (this.idContainer) ? document.getElementById(this.idContainer) : undefined;
	}

	criarRenderer () {
		var renderer = new THREE.WebGLRenderer({antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth,window.innerHeight);
		renderer.setClearColor("#ffffff");
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		this.container.appendChild(renderer.domElement);	
		this.controle = new MapaControleOrbital(this.camera,renderer.domElement);
		this.renderer = renderer;
	}      

	/*
	criarCenario() {
	   this.cenario = new Cenario();
	}
	*/

	criarEstatistica() {
		this.estatistica = undefined;
		if (this.ativarEstatistica) {
			this.estatistica = new Stats();
			this.container.appendChild(this.estatistica.dom);
		}
	}

	renderizador () {
		this.renderer.render(this.cena,this.camera);
	}
}
