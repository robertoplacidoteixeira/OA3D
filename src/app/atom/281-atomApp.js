class AtomApp extends RptApp {

	beforePrepare() {
		super.beforePrepare();
		this.atom = undefined;
		this.atoms = [];
		this.elementDataModalWindowOpen = false;
		this.PeriodicTableModalWindowOpen = false;
		this.VisionsModalWindowOpen = false;
		this.usarArvore = true; 
		this.jstree = true;
		this.nodoPeriodos = null;
		this.nodoNivel = null;
		this.nodoSubNivel = null;
		this.letras = ["s","p","d","f"];
	}
	
	afterPrepare() {
		super.afterPrepare();
//		if (this.pe.espichar === "1") {
		this.camera.position.set(this.pe.cpx,this.pe.cpy,this.pe.cpz);
		this.camera.lookAt(0,0,0);
//		}
		$("id-bde-valor-inversao").on("click",function(){
			janelaModalTabelaPeriodica();
		});
		var versao = document.getElementById("id-dbe-valor-versao");
		versao.innerHTML = this.pe.versao;
	}

	duringCreate() {
		super.duringCreate();
	}

	afterCreate() {
		super.afterCreate()
		$("#id-div-data-elemento").load("src/app/atom/html/291-elementData.html");
		$("#id-div-tabela-periodica").load ("src/app/atom/html/292-periodicTable.html");
		this.criarArvore();
	}

	createScenery() {
		this.scenery = new AtomBasicSceneryLayout({app: this});
		//this.scenery = new AtomPointsSceneryLayout({app: this, pointSize: 0.1});
	}
	
	controleJanela(nomeJanela) {
		var j = this[nomeJanela];
		if ((j != this.janelaModalTabelaPeriodica) && (this.PeriodicTableModalWindowOpen))
			this.PeriodicTableModalWindowOpen = this.janelaModalTabelaPeriodica();
		if ((j != this.janelaModalDadosElemento) && (this.elementDataModalWindowOpen)) 
			this.elementDataModalWindowOpen = this.janelaModalDadosElemento();
		if ((j != this.janelaModalVisoesAtomo) && (this.VisionsModalWindowOpen))
			this.VisionsModalWindowOpen = this.janelaModalVisoesAtomo();
		if ((j != this.janelaModalAjuda) && (this.janelaModalAjudaAberta))
			this.janelaModalAjudaAberta = this.janelaModalAjuda();
		this[nomeJanela]();
	}
	
	janelaModal(id,aberta,abertura,fechamento)  {
		var t = this;
		if (aberta) {
			$(id).fadeOut(2000,"swing",function(){
				if (fechamento) fechamento();;
			});
		} else {
			$(id).fadeIn(2000,"swing",function(){
				if (abertura) abertura();;
			});
		}
		this.recolherMenu();
		aberta = !aberta;
		return aberta;
	}
	
	janelaModalTabelaPeriodica() {
		var t = this;

		function cliqueAbertura() {
			$(".elemento").on("click",function(e){
				t.createAtom(e.currentTarget.attributes.z.nodeValue,t.scenery,t.scene);
			});
		}

		function cliqueFechamento() {
			$(".elemento").on("click",function(e){});
		}

		this.PeriodicTableModalWindowOpen = this.janelaModal("#id-div-tabela-periodica",
			this.PeriodicTableModalWindowOpen,cliqueAbertura,cliqueFechamento);
	}

	janelaModalDadosElemento() {
		this.elementDataModalWindowOpen = this.janelaModal("#id-div-data-elemento",this.elementDataModalWindowOpen);
	}

	janelaModalVisoesAtomo() {
		this.VisionsModalWindowOpen = this.janelaModal("#id-div-controle-arvore",this.VisionsModalWindowOpen);
	}

	janelaModalAjuda() {
		this.janelaModalAjudaAberta = this.janelaModal("#id-div-ajuda",this.janelaModalAjudaAberta);
	}

	createAtom(Z,scenery_,scene_) {
		if (!this.PeriodicTableModalWindowOpen) return;
		this.closeAllElementNodes();
		var a = this.atoms.find(atom => atom.Z === Z);
		if (a) {
			if (this.atom.Z !== a.atom.Z) {
				this.atom.visibility(false);
				a.atom.visibility(true);
				this.closeAllElementNodes();
				this.arvore.select_node(a.nodo.id);
				this.atom = a.atom;
				this.loadElementData();
			}
		} else {
			if (this.atom) this.atom.visibility(false);
			this.atom = new Atom({
                scenery              : scenery_,
                scene                : scene_,
                Z                    : Z,
                useAxis              : true,
                espichar             : this.espichar,
                load                 : false,
                movimentElectrons    : false,
                RandomMove           : false,
                waitTime             : 100
			});
			this.atom.atom3d.rotation.set(-Math.PI/4,0,-Math.PI/4*3);
			this.criarNodoElemento(this.atom.Z);
			this.atoms.push({atom: this.atom, nodo: this.nodoElemento});
			this.loadElementData();
		}
		this.janelaModalTabelaPeriodica();
	}

	closeAllElementNodes() {
		var t = this;
		var nodoElementos = this.arvore.get_node("elems");
		nodoElementos.children.forEach(function(idNodoElemento){
			t.arvore.close_node(idNodoElemento);
		});
	}

	recolherMenu(){
		document.getElementById("toggle").checked = false;
	}

	loadElementData() {
		if (!this.atom) return;
		var elemento = $g.metadata.elemsData[$g.metadata.elems[this.atom.Z-1].simbolo];
		for (var dado in elemento) {
			var htmlDado = document.getElementById('dado_el_'+dado+'_id_val');
			if (htmlDado) htmlDado.innerHTML = elemento[dado];
		}
		var Z = document.getElementById("id-dbe-valor-Z");
		Z.innerHTML = elemento.na;
		var simbolo = document.getElementById("id-dbe-valor-simbolo");
		simbolo.innerHTML = elemento.sn;
		var nome = document.getElementById("id-dbe-valor-nome");
		nome.innerHTML = elemento.n;
		var radius = document.getElementById("id-dbe-valor-raio");
		radius.innerHTML = elemento.ra;
		$("#id-div-data-basicos-elemento").fadeIn(2000,"swing",function(){});
	}

	criarNodoElemento(Z) {
		var d = $g.metadata.elemsData[$g.metadata.elems[Z-1].simbolo];
		this.simbolo = d.sn;
		this.nome = d.n;

		this.idElemento = "e-" + this.simbolo + "-" + this.idElementos;

		this.nodoElemento = this.criarNodoArvore(this.idElemento,this.simbolo+" "+this.nome, this.nodoElementos, {
			tipo: "elemento", z: Z, Z: Z, simbolo: this.simbolo, nome: this.nome
		});
		
		if (this.atom.useAxis) {
			
			this.idHelper = "h-"+this.idElemento;
			this.nodoHelper = this.criarNodoArvore(this.idHelper, "Axes",this.nodoElemento,{tipo: "helper"});
			
			this.idAxesHelper = "ah-"+this.idElemento;
			var ah  = this.atom.axesHelper;
			this.nodoAxesHelper = this.criarNodoArvore(this.idAxesHelper, "Linha",this.nodoHelper,{tipo: "axes-helper", helper: ah},ah.visible);

			this.idGridHelper = "gh-"+this.idElemento;
			var h  = this.atom.gridHelper;
			this.nodoGridHelper = this.criarNodoArvore(this.idGridHelper, "Grade",this.nodoHelper, {tipo: "grid-helper", helper: h},h.visible);
		}

		this.idNucleo = "nucleus-"+this.idElemento;
		var n  = this.atom.nucleus;
		this.nodoNucleo = this.criarNodoArvore(this.idNucleo, "Núcleo", this.nodoElemento, {tipo: "núcleo", nucleus: n}, n.visible);

		this.idNuvem = "nuvem-" + this.idElemento;
		this.nodoNuvem = this.criarNodoArvore(this.idNuvem,"Nuvem", this.nodoElemento, {tipo: "nuvem"});

		this.idPeriodosNuvem = "periods-"+this.idNuvem;
		this.nodoPeriodosNuvem = this.criarNodoArvore(this.idPeriodosNuvem, "Períodos", this.nodoNuvem, {tipo: "periods-nuvem"});

		this.idEletrons = "electrons-" + this.idElemento;
		this.nodoEletrons = this.criarNodoArvore(this.idEletrons,"Elétrons",this.nodoElemento,{tipo: "elétrons"});

		this.idMovimentar = "movimentElectrons-" + this.idEletrons;
		this.nodoMovimentar = this.criarNodoArvore(this.idMovimentar,"Movimentar", this.nodoEletrons, {tipo: "movimentElectrons-elétrons", atom: this.atom});

		this.idPeriodosEletrons = "periods-"+this.idEletrons;
		this.nodoPeriodosEletrons = this.criarNodoArvore(this.idPeriodosEletrons, "Períodos", this.nodoEletrons, {tipo: "periods-electrons"});
	}

	load() {
		this.loadPeriodNodes();
	}

	animate() {
		super.animate();
		for(var i in this.atoms) {
			this.atomNode = this.atoms[i];
			this.atom = this.atomNode.atom;
			if (this.atom) {
				if (this.autoRotacionar && atom.orbitalsLoaded) {
					this.atom.atom3d.rotation.set(0.05,0.05,0.05);
				}
				// continuar = atom.movimentElectrons;
				if (this.atom.continueLoading) {
					if (this.atom.verifyLoadOrbital()) this.load();
				} else {
					this.atom.moveElectrons();
				}
			}
		}
		/*this.sceneMaker.animate();*/
		return true;
	}
	
	criarArvore() {
		if (this.usarArvore) {
			$("#id-arvore").jstree({
					"core" : {
						"check_callback" : true
					},
					"state" : {
						"key" : "id-arvore", "events" : "activate_node.jstree"
					},
					"checkbox": {       
						"three_state"   : true,   // to allow that fact that checking atom node also check others
						"whole_node"    : false,  // to avoid checking the box just clicking the node 
						"tie_selection" : false   // for checking without selecting and selecting without checking
					},
					"plugins" : [
						"checkbox", "dnd", "search","themes","ui",
						"state", "types", "wholerow"
					]
				});

			this.arvore = $("#id-arvore").jstree(true);
			
			// this.nodoElementos = this.arvore.get_node("elems");

			this.idElementos = "elems";
			this.nodoElementos = this.criarNodoArvore(this.idElementos, "Elementos","#",{tipo: "elems"});
			
			this.prepararEventos();
		}
	}

	atualizarArvore() {
		function testarEstadoOrbital(nodo) {
			if ((nodo.children) && (nodo.children.length > 0)) {
				nodo.children.forEach(function(idNodoFilho,indice) {
					var nodoFilho = this_.arvore.get_node(idNodoFilho);
					testarEstadoOrbital(nodoFilho)
				});
			}
			if (nodo.data.tipo === "orbital-nuvem") {
				nodo.state.checked = nodo.data.orbital.visibilidadeNuvem();
			} else if (nodo.data.tipo === "orbital-elétrons") {
				nodo.state.checked = nodo.data.orbital.visibilidadeEletrons();				
			} else if (nodo.data.tipo === "núcleo") {
				nodo.state.checked = nodo.data.nucleus.visibility();
			} else if (nodo.data.tipo === "axes-helper") {
				nodo.state.checked = nodo.data.helper.visible;
			} else if (nodo.data.tipo === "grid-helper") {
				nodo.state.checked = nodo.data.helper.visible;
			} else if (nodo.data.tipo === "movimentElectrons-elétrons") {
				nodo.state.checked = nodo.data.atom.movimentElectrons;
			}
		}
		testarEstadoOrbital(this.nodoElementos);
	}

	loadPeriodNodes() {
		var atom = this.atom;
		if (!this.usarArvore) return;
		if (atom.newPeriod) {
			this.idPeriodoNuvem = "pn-"+atom.period.num+"-"+this.idElemento;
			this.nodoPeriodoNuvem = this.criarNodoArvore(this.idPeriodoNuvem,atom.period.num,this.nodoPeriodosNuvem,{tipo: "period-nuvem"});
			this.idPeriodoEletrons = "pe-"+atom.period.num+"-"+this.idElemento;
			this.nodoPeriodoEletrons = this.criarNodoArvore(this.idPeriodoEletrons,atom.period.num,this.nodoPeriodosEletrons,{tipo: "period-elétrons"});
		}
		if (atom.newSublevel) {
			this.idSubnivelNuvem = "sn-"+atom.sublevel.num+"-"+this.idPeriodoNuvem;
			this.nodoSubNivelNuvem = this.criarNodoArvore(this.idSubnivelNuvem, atom.level.num + this.letras[atom.sublevel.num],this.nodoPeriodoNuvem,{tipo: "sublevel-nuvem"});
			this.idSubnivelEletrons = "se-"+atom.sublevel.num+"-"+this.idPeriodoEletrons;
			this.nodoSubNivelEletrons = this.criarNodoArvore(this.idSubnivelEletrons, atom.level.num + this.letras[atom.sublevel.num],this.nodoPeriodoEletrons,{tipo: "sublevel-elétrons"});
			this.orbitalSublevelNum = 0;
		}
		this.orbitalSublevelNum += 1;
		this.idOrbitalNuvem = "o-" + this.orbitalSublevelNum + "-" + this.idSubnivelNuvem;
		this.nodoOrbitalNuvem = this.criarNodoArvore(this.idOrbitalNuvem, this.orbitalSublevelNum,this.nodoSubNivelNuvem,
			{tipo: "orbital-nuvem", orbital: atom.orbital},atom.orbital.visibilidadeNuvem());
		this.idOrbitalEletrons = "o-" + this.orbitalSublevelNum + "-" + this.idSubnivelEletrons;
		this.nodoOrbitalEletrons = this.criarNodoArvore(this.idOrbitalEletrons, this.orbitalSublevelNum,this.nodoSubNivelEletrons,
			{tipo: "orbital-elétrons", orbital: atom.orbital},atom.orbital.visibilidadeEletrons());
	}
	
	prepararEventos() {
		var t = this;

		$("#id-arvore").on("select_node.jstree", function (e, data) {
			var d;
			var n = data.node;
			if (n.data.tipo === "elems") {
				t.controleJanela('janelaModalTabelaPeriodica');
				t.closeAllElementNodes();
				return;
			}
			var achou = false;
			do {
				// data.instance.check_node(p);
				// p = data.instance.get_node(p).parent;
				d = n.data;
				if ((d.tipo) && (d.tipo === "elemento")) {
					if (t.atom.Z !== d.Z) {
						t.atom.visibility(false);
						t.atom = t.atoms.find(atom => atom.atom.Z === d.Z).atom;
						t.atom.visibility(true);
						t.closeAllElementNodes();
						t.loadElementData();
					}
				}
				n = data.instance.get_node(p.parent);
			} while ((n) && (!achou));
			if (achou) data.instance.select_node(n.id);
		});
		/*
		/*$("#id-arvore").on("select_node.jstree", function(evt, data){});* /
		this.arvore.on('activate_node.jstree', function (e, data) {
			var n = data.node;
			if (data.instance.is_leaf(n)) {
				var p = n.parent;
				do {
					// data.instance.check_node(p);
					// p = data.instance.get_node(p).parent;
					if ((p.data.tipo) && (p.tipo === "elemento")) {
						if (p.
						this.atom.atom3d.visible = false;
						this.atom = this.atoms.find(atom => atom.Z === p.Z);
						this.atomoAtual = this.atom;
					}
				} while (p);
			}
		);
		*/
		$("#id-arvore").on("uncheck_node.jstree check_node.jstree", function(e, data) {
			function testarEstadoOrbital(nodo) {
				if ((nodo.children) && (nodo.children.length > 0)) {
					nodo.children.forEach(function(idNodoFilho,indice) {
						var nodoFilho = t.arvore.get_node(idNodoFilho);
						testarEstadoOrbital(nodoFilho)
					});
				}
				if (nodo.data.tipo === "orbital-nuvem") {
					nodo.data.orbital.visibilidadeNuvem(nodo.state.checked);
				} else if (nodo.data.tipo === "orbital-elétrons") {
					nodo.data.orbital.visibilidadeEletrons(nodo.state.checked);
				} else if (nodo.data.tipo === "núcleo") {
					nodo.data.nucleus.visibility(nodo.state.checked);
				} else if (nodo.data.tipo === "axes-helper") {
					nodo.data.helper.visible = nodo.state.checked;
				} else if (nodo.data.tipo === "grid-helper") {
					nodo.data.helper.visible = nodo.state.checked;
				} else if (nodo.data.tipo === "movimentElectrons-elétrons") {
					nodo.data.atom.movimentElectrons = nodo.state.checked;
				}
			}
			if ((data) && (data.node) && (data.node.data) && (data.node.data.tipo)) {
				var filhos = data.node.children;
				testarEstadoOrbital(data.node);
				/*
				alert(data.node.data.tipo + ' ' + data.node.id + ' ' + data.
				*/
			}
		});
	}
	
	criarNodoArvore(id_, text_,parent_,data_,check_) {
		var dados_ = { state: {checked: true, opened: true}, id: id_, text: text_, data: data_};
		this.arvore.create_node(parent_, dados_, "last", false, false);
		var nodo = this.arvore.get_node(id_);
		if (check_ != undefined) {
			if (check_) this.arvore.check_node(nodo);
			else this.arvore.uncheck_node(nodo);
		}
		return nodo;
	}
}
