class AplicativoOa3d extends Aplicativo {

	antesCriar() {
		super.antesCriar();
		this.atualZ = this.pe.zElemento;
		this.objAtomo = undefined;
		this.mostrar = true;
		this.parado = true;
		this.criarArvore = false; 
		this.autoRotacionar = false;
		this.nodoNiveis = null;
		this.nodoNivel = null;
		this.nodoSubNivel = null;
		if (this.pe.espichar === "1") {
			this.camera.position.set(this.pe.cpx,this.pe.cpy,this.pe.cpz);
			this.camera.lookAt(0,0,0);
		}
	}

	duranteCriar() {
		super.duranteCriar();
		this.cenario = new CenarioAtomicoBasicoPontos({
			cpx: this.pe.cpx, 
			cpy: this.pe.cpy, 
			cpz: this.pe.cpz,
			zElemento: this.atualZ});
		this.criarAtomo(this.pe.zElemento);
		this.filme = new Filme({
			cenario: this.cenario, 
			alvo: this.cenario.cena,
			idContainer: "id-modelo-orbital-3d",
			ativarEstatistica: false});
	}

	depoisCriar() {
		super.depoisCriar();
		if (window.janela) window.janela.criarBotaoFechar("fechar.32x32.01a.png",32,32);
	}

	criarAtomo(novoZ) {
		this.atualZ = novoZ;
		this.objAtomo = new Atomo({
			filme							: this.filme,
			cenario							: this.cenario,
			elementos						: elementos,
			numElemento						: novoZ,
			raios_atomicos_calculados_rac 	: raios_atomicos_calculados_rac,
			cabec_rac						: cabec_rac,
			possuidor						: this.cenario.cena,
			usarAxis						: true,
			espichar						: this.espichar,
			carregar						: false,
			movimentar						: false,
			tempoEspera						: 100});
		this.objAtomo.atomo3d.rotation.x = Math.PI / 4;
		this.objAtomo.atomo3d.rotation.y = -Math.PI / 4;
		if (this.criarArvore) {
			$("#id-div-arvore-elemento").fancytree({source: [{title: "Elementos"}]});
			this.arvore = $.ui.fancytree.getTree("#id-div-arvore-elemento");
			this.nodoNiveis = this.arvore.rootNode;
		}
	}
	
	animar() {
		this.filme.iniciarEstatistica();
		var a = this.objAtomo;
		if (this.autoRotacionar && a.orbitaisCarregados) {
			a.atomo3d.rotation.set(0.05,0.05,0.05);
		}
		if (a.continuarCarregando) {
			if (a.verificarCarregamentoOrbital()) {
				if (this.criarArvore) {
					if (a.novoNivel) {
						this.nodoNivel = this.nodoNiveis.addChildren({
							title: a.nivel.num,
							nivel: a.nivel,
							folder: true
						});
					}
					if (a.novoSubNivel) {
						this.nodoSubNivel = this.nodoNivel.addChildren({
							title: a.subNivel.num,
							subNivel: a.subNivel,
							folder: true
						});
					}
					this.nodoSubNivel.addChildren({
						title: a.numOrbitalSubNivel
					});
					this.nodoNivelAnt = this.nodoNivel;
					this.nodoSubNivelAnt = this.nodoSubNivel;
				}
			}
		} else {
			a.movimentarEletrons();
		}
		this.filme.renderizar();
		this.filme.finalizarEstatistica();
	}

	onWindowResize() {
		this.filme.camera.aspect = window.innerWidth / window.innerHeight;
		this.filme.camera.updateProjectionMatrix();
		this.filme.renderer.setSize(window.innerWidth,window.innerHeight);
	}

	onWindowUnload() {
	}

	carregarDadosElemento() {	
		var indice = this.atualZ-1;
		var elemento = dadosElementos[simbolosElementos[indice]];
		for (var dado in elemento) {
			var htmlDado = document.getElementById('dado_el_'+dado+'_id_val');
			if (htmlDado) {
				htmlDado.innerHTML = elemento[dado];
			}
		}
	}

	dadosElementoOpaco() {
		var t = this;
		t.parado = false;
		$("#id-botao-ver-dados-elemento").fadeOut(2000,"swing",function(){
			$("#dados_el_id_todos").fadeIn(2000,"swing",function(){
				t.parado = true; t.mostrar = false
			});
		});
	}

	dadosElementoTransparente() {
		var t = this;
		t.parado = false;
		$("#dados_el_id_todos").fadeOut(2000,"swing",function(a,b,c,d){
			t.parado = true; 
			t.mostrar = true;	
			$("#id-botao-ver-dados-elemento").fadeIn(2000,"swing",function(){
				$("#dados_el_id_modal").on("click",function(){
					if (t.parado) if (t.mostrar) t.dadosElementoOpaco(); else t.dadosElementoTransparente();
				});
				$("#id-botao-ver-dados-elemento").on("click",function(){
					if (t.parado) if (t.mostrar) t.dadosElementoOpaco();
				});
				$(".elemento").on("click",function(evento){
					t.cenario.cena.remove(t.objAtomo.atomo3d);
					t.objAtomo.destruir();
					t.objAtomo = undefined;
					t.criarAtomo(evento.currentTarget.attributes.z.nodeValue);
					t.carregarDadosElemento();
					t.cenario.cena.add(t.objAtomo.atomo3d);
				});
			});
		});
	}

	tabelaPeriodicaOpaco(){
		var t = this;
		t.parado = false;
		$("#id-botao-ver-tabela-periodica").fadeOut(2000,"swing",function(){
			$("#id-tabela-periodica").fadeIn(2000,"swing",function(){
				t.parado = true; t.mostrar = false
			});
		});
	}

	tabelaPeriodicaTransparente() {
		var t = this;
		t.parado = false;
		$("#id-tabela-periodica").fadeOut(2000,"swing",function(){
			t.parado = true; 
			t.mostrar = true;	
			$("#id-botao-ver-tabela-periodica").fadeIn(2000,"swing",function(){
				$("#id-tabela-periodica").on("click",function(){
					if (t.parado) if (t.mostrar) t.tabelaPeriodicaOpaco(); else t.tabelaPeriodicaTransparente();
				});
				$("#id-botao-ver-tabela-periodica").on("click",function(){
					if (t.parado) if (t.mostrar) t.tabelaPeriodicaOpaco();
				});
			});
		});
	}

	aumentar() {
		var t = this;
		t.parado = false;
		$("#dados_el_id_modal").animate({right: "10px"},2000,"swing",
			function(){
				t.parado = true; 
				t.mostrar = false
			});
	}

	diminuir() {
		var t = this;
		t.parado = false;
		$("#dados_el_id_modal").animate({right: "-370px"},2000,"swing",function(){
			t.parado = true; 
			t.mostrar = true;	
			$("#dados_el_id_modal").on("click",function(){
				if (t.parado)
					if (t.mostrar) 
						t.aumentar(); 
					else 
						t.diminuir();
			});
		});
	}
}
