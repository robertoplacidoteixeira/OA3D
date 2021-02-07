if (!Detector.webgl) Detector.addGetWebGLMessage();

var parametrosExternos = {
   zElemento: getUrlParam("z",1),
   cpx: getUrlParam("cpx",0),
   cpy: getUrlParam("cpy",0),
   cpz: getUrlParam("cpz",800), // window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight),
   opx: getUrlParam("opx",0),
   opy: getUrlParam("opy",0),
   opz: getUrlParam("opz",0),
   espichar: getUrlParam("espichar",0)
}

var app = undefined;

function iniciar() {
	window.addEventListener('resize',onWindowResize,false);
	window.addEventListener('unload', onWindowUnload,false);
	setTimeout(dadosElementoOpaco,2000);
	setTimeout(dadosElementoTransparente,10000);
	setTimeout(tabelaPeriodicaOpaco,12000);
	setTimeout(tabelaPeriodicaTransparente,20000);
	$("#id-div-dados-elemento").load("131-orbitais3d-dados-elemento.01a.html",carregarDadosElemento);
	$("#id-div-tabela-periodica").load("121-orbitais3d-tabela-periodica.01a.html",carregarDadosElemento);
	app = new AplicativoOa3d({
		pe: parametrosExternos
	});
	animar();
}

function animar() {
   requestAnimationFrame(animar);
   app.animar();
}

//------------------------------------------------------------------------------
//
///var objAtomo = undefined, filme = undefined, cenario = undefined;

//var mostrar = true;
//var this.parado = true;

function onWindowResize() {
   app.onWindowResize();
}

function onWindowUnload() {
	app.onWindowUnload();
	if (window.janela) {
		if (window.janela.JanelaWindow) {
			window.janela.JanelaWindow = null;
		}
	}
}

function tabelaPeriodicaOpaco() {
   app.tabelaPeriodicaOpaco();
}

function tabelaPeriodicaTransparente() {
   app.tabelaPeriodicaTransparente();
}

function dadosElementoOpaco() {
   app.dadosElementoOpaco();
}

function dadosElementoTransparente() {
   app.dadosElementoTransparente();
}
//
//------------------------------------------------------------------------------
//
function carregarDadosElemento() {
   app.carregarDadosElemento();
}
