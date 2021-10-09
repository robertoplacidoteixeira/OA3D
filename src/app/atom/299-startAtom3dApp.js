// if (!Detector.webgl) Detector.addGetWebGLMessage();

var appOA3D = "1";
var appTP3D = "2";

var $g = {
	metadata     : new AtomMetadata(),
	tp3d         : new TP3dGlobal(),
	controlTypes : {rotational: 1, positional: 2, trackball: 3},
	stats        : {active: false},
	controls     : {useTrackball: false},
	factory      : {
		data : {geo: new RptGeoDataFactory()},
		geo  : new RptGeoFactory(),
		mesh : new RptMeshFactory(),
		s3d  : new S3dFactory(),
		data : {
			s3d: new S3dData()
		}
	},
	stock    : {geo: new RptGeoStock(), obj3d: []},
	math     : {degree: Math.PI / 180},
	renderer : {data: {antiAlias: true}, clearColor: 0xFFFFFF, fogClearColor: undefined},
	useFat   : true,
	appNum   : "1",
	app      : null,
	fonts    : null,
	colors   : {
		pos: {x: "#ff0000", y: "#00FF00", z: "#0000FF", s: "#882222", p: "#226622",d: "#222288",f: "#ff8822",r: "#dddddd"},
		neg: {x: "#ff8888", y: "#88FF88", z: "#8888FF", s: "#ff2222", p: "#22ff22",d: "#2222ff",f: "#ff8866",r: "#dddddd"}
	}
}

function iniciar() {
	
	$g.fonts = new RptFonts({
		dir: "../oslib/js/threejs/r124/examples/fonts/",
		fontArray: [["dsar" ,"Droid Sans" ,"Droid Sans Regular","droid/droid_sans_regular.typeface.json",true]]
		/*
		fontArray: [
			["gb"   ,"Gentilis"   ,"Gentilis Bold","gentilis_bold.typeface.json"                          ,true],
			["gr"   ,"Gentilis"   ,"Gentilis Regular","gentilis_regular.typeface.json"                    ,true],
			["hb"   ,"Helvetiker" ,"Helvetiker","helvetiker_bold.typeface.json"                           ,true],
			["hr"   ,"Helvetiker" ,"Helvetiker","helvetiker_regular.typeface.json"                        ,true],
			["ob"   ,"Optimer"    ,"Optimer Bold","optimer_bold.typeface.json"                            ,true],
			["or"   ,"Optimer"    ,"Optimer Regular","optimer_regular.typeface.json"                      ,true],
			["dsab" ,"Droid Sans" ,"Droid Sans Bold","droid/droid_sans_bold.typeface.json"                ,true],
			["dsamr","Droid Sans" ,"Droid Sans Mono Regular","droid/droid_sans_mono_regular.typeface.json",true],
			["dsar" ,"Droid Sans" ,"Droid Sans Regular","droid/droid_sans_regular.typeface.json"          ,true],
			["dseb" ,"Droid Serif","Droid Serif Bold","droid/droid_serif_bold.typeface.json"              ,true],
			["dser" ,"Droid Serif","Droid Serif Regular","droid/droid_serif_regular.typeface.json"        ,true]
		]
		*/
	});
	
	$g.fonts.load(aposCarregarFontes);

	function aposCarregarFontes() {
		
		function getUrlVars() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = value;
			});
			return vars;
		}

		function getUrlParam(parameter, defaultvalue){
			var urlparameter = defaultvalue;
			if (window.location.href.indexOf(parameter) > -1)
				urlparameter = getUrlVars()[parameter];
			return urlparameter;
		}

		var parametrosExternos = {
			versao: "2.01.28a BETA",
			zElemento: getUrlParam("z",1),
			appNum: getUrlParam("app",$g.appNum),
			cpx: getUrlParam("cpx",0),
			cpy: getUrlParam("cpy",0),
			cpz: getUrlParam("cpz",800), // window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight),
			opx: getUrlParam("opx",0),
			opy: getUrlParam("opy",0),
			opz: getUrlParam("opz",0),
			espichar: getUrlParam("espichar",0)
		}

		switch(parametrosExternos.appNum) {
			case (appOA3D):	$g.app = new OA3dApp({pe: parametrosExternos, idContainer: "id-div-modelo-orbital-3d"}); break;
			case (appTP3D):	$g.app = new TP3dApp({pe: parametrosExternos, idContainer: "id-div-modelo-orbital-3d"}); break;
		}
		animate();
	}
}

function animate() {
   if ($g.app.animate()) requestAnimationFrame(animate);
}

/*http://www.articlesbyaphysicist.com/quantum4prog.html*/
