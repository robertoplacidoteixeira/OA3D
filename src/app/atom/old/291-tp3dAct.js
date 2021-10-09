
var z_090 = 10000;
var data_090_01 = {moveType: "to", time: {start: 0, loop: 3000, step: 20}, target: {z:11000}}
var data_090_02 = {moveType: "to", time: {start: 1000, loop: 3000, step: 20}, target: {z:4000}}

var z_100 = 0;
var data_100_01 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, target: {z: 200}}
var data_100_02 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, target: {z: 1500}}

var z_200 = z_100 - 6000;
var data_200 = {moveType: "to", time: {start: 15000, loop: 1000, step: 20}, origin: {z: z_200}, target: {z: z_200 + 1500}}

var z_210 = z_200 - 6000;
var data_210 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_210}, target: {z: z_210 + 500}}

var z_220 = z_210 - 6000;
var data_220 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_220}, target: {z: z_220 + 1500}}

var z_230 = z_220 - 6000;
var data_230 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_230}, target: {z: z_230 + 1500}}

var z_240 = z_230 - 6000;
var data_240 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_240}, target: {x: 0, y: 0, z: z_240 + 1500}}

var z_250 = z_240 - 6000;
var data_250 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_250}, target: {z: z_250 + 1500}}

var z_260 = z_250 - 6000;
var data_260 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_260}, target: {z: z_260 + 1500}}

var z_270 = z_260 - 6000;
var data_270 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_270}, target: {z: z_270 + 1500}}

var z_280 = z_270 - 6000;

var data_280 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_280}, target: {z: z_280 + 1500}}

var z_290 = z_280 - 6000;
var data_290 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_290}, target: {z: z_290 + 1500}}

var z_400 = z_290 - 6000;
var data_410_01 = {moveType: "to", time: {start: 10000, loop: 1000, step: 20}, origin: {z: z_400}, target: {y: 20, z: z_400 + 800}}
var data_410_02 = {moveType: "to", time: {start: 0, loop: 20000, step: 20}, origin: {z: z_400}, target: {x: 33300, z: z_400 - 32300}}

class TP3dAct extends S3dAct {

	afterPrepare() {
		super.afterPrepare();
		this.tsmf = this.textSizeModelFarm;
		this.mf = this.materialFarm;
		this.tpbig = this.tsmf.bigDsbn;
		this.tpnormal = this.tsmf.mediumDsbn;
		this.tpsmall = this.tsmf.smallDsbn;
		this.tpbig2 = this.tsmf.dsbn320x32;
		this.tpnormal2 = this.tsmf.dsbn144x16;
		this.mgray6 = this.mf.gray6;
		this.mgray3 = this.mf.gray3;
	}

	loadAct() {
		this.p200();
		// this.p090();
	}

	getActFrame() {
		return new TP3dActFrame({
			owner: this,
			scene: this.obj3d,
			fontFarm: this.fontFarm,
			textSizeModelFarm: this.tsmf,
			materialFarm: this.mf
		});
	}

	p090() {
		var t = this;
		var f = this.getActFrame();
		this.doubleMove(
			{callback: this.p100, startTime: 100, data: data_090_01},
			{calback: null, startTime: null, data: data_090_02}
		);
		f.obj3d.position.z = data_090.target.z;
		f.obj3d.rotation.y = $g.math.degree * 80;
		var tsm = this.tsmf.dsbn320x32;
		var mat = this.mf.gray3;
		function csc(str_,deltaDegree_) {
			var chain = new THREE.Object3D();
			f.obj3d.add(chain);
			chain.rotation.y = $g.math.degree * deltaDegree_;
			var rt = this.addText(str_, this, chain, 0, 0, 800, tsm, mat);
			rt.center();
			rt.obj3d.position.z = 900;
			rt.obj3d.rotation.y = Math.PI;
		}
		this.csc("O", 0);
		this.csc("A", 90);
		this.csc("3", 180);
		this.csc("D", 270);
	}

	p100() {
		var f = this.getActFrame();
		this.doubleMove(
			{callback: null, starTime: null, data: data_100_01}, 
			{callback: this.p200, startTime: 100, data: data_100_02}
		);
		f.obj3d.position.z = z_100;
		f.chain = new THREE.Object3D();
		f.obj3d.add(f.chain);
		f.exec = function() {
			this.chain.rotation.y -= (Math.PI / 360);
		}
		f.execTime = 200;
		var cg = $g.geo.factory.cylinder($g.data.geo.geoCylinderData(30,30,500,32,32));
		var sg = $g.geo.factory.sphere($g.data.geo.sphereData(200,32,32)); // (30,32,32)
		var tsm = this.tsmf.dsbn320x32;
		var mat = this.mf.gray3;
		function csc(str_,deltaDegree_) {
			this.CreateStudddioChar(str_, f.chain, cg, sg, tsg, tsm, mat, $g.math.degree * deltaDegree_);
		}
		this.csc("S",   0);
		this.csc("T",  45);
		this.csc("U",  90);
		this.csc("D", 135);
		this.csc("D", 180);
		this.csc("D", 225);
		this.csc("I", 270);
		this.csc("O", 315);
	}

	CreateStudddioChar(
		str_, scene_, cylinderGeometry_, sphereGeometry_,
		textSphereGeometry, textSizeModel, textMaterial, rotY) {

		var chain = new THREE.Object3D();

		if (rotY) chain.rotation.y = rotY;

		scene_.add(chain);

		var cyl = $g.mesh.factory.cylinder(cylinderGeometry_, this.mf.gray6);
		cyl.position.set(0, -500, 250);
		cyl.rotation.x = Math.PI / 4;
		chain.add(cyl);

		var sphere = new THREE.Mesh(sphereGeometry_, this.mf.gray9);
		sphere.position.set(0, -250, 500);
		chain.add(sphere);

		if (true) {
			this.addSphereText(
				str_,this,chain,0,0,600,textSizeModel,textMaterial,
				textSphereGeometry,this.mf.dictOp30);
		} else {
			if (str_.length > 0) {
				var cd = $g.s3d.data.richCharData(
					str_,this,chain,{x:0,y:0,z:500},{x:0,y:0,z:0},
					textSizeModel, material, null, function(o){});				
				cd.exec = function(o) {
					if (o) o.obj3d.rotation.y -= (Math.PI / 360);
					if (this.execStep === 0) {
						var pi2 = -Math.PI * 2;
						if (o.obj3d.rotation.y < pi2) {
							this.execStep = 1;
							this.startMove(o, 0, -100, 0, 0);
						}
					}
					if (this.execStep === 1) {
						if (this.moveAction()) {
							this.execStep = 2;
							o.startMove(0, 1000, 0, 0);
						}
					}
				},
				cd.execTime =  200;
				this.richChar = new S3dRichChar(cd);
			}
		}
	}

	p200() {
		var t = [
			["OA3D", 0, 100, 0, 0, 0, 0, this.tpbig2, this.mgray3, null],
			["Orbitais Atômicos 3D", 0, -100, 0, 0, 0, 0, this.tpnormal2, this.mgray6, null]
		];
		this.createMultiTextFrame(data_200, t,this.p210);
	}

	p210() {
		var p210_texts = [
			["Introdução", 0, 0, 0, 0, 0, 0, this.tpbig, this.mgray6, null]
		];
		this.p210_frameTexts = this.createMultiTextFrame(data_210, p210_texts, this.p220);
	}

	p220() {
		var p220_texts = [
			["A tabela periódica tem 118 elementos organizados", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["em linhas (períodos) e colunas (grupos).", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["Os átomos dos elementos crescem nos períodos da direita para esquerda.", 0, -200, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["three dimensional environment.", 0, -300, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p220_frameTexts = this.createMultiTextFrame(data_220, p220_texts, this.p230);
	}

	p230() {
		var p230_texts = [
			["With 3D you can move, rotate, scale and translate 2D", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["and 3D objects in the scene, using cameras that go", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["through it, using different colored lights on objects", 0, -200, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["and casting shadows on them.", 0, -300, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p230_frameTexts = this.createMultiTextFrame(data_230,	p230_texts, this.p240);
	}

	p240() {
		var p240_texts = [
			["3D objects are meshes with different geometries ", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["and materials, capable of grouping child objects ", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["and have their properties changed, ", 0, -200, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["thus having modified their appearance.", 0, -300, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p240_frameTexts = this.createMultiTextFrame(data_240, p240_texts, this.p250);
	}

	p250() {
		var p250_texts = [
			["Studddio generates 3D texts, plans with pictures,", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["cubes and spheres with different colors and textures,", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["meshes with 2D and 3D geometries using different materials.", 0, -200, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p250_frameTexts = this.createMultiTextFrame(data_250, p250_texts, this.p260);
	}

	p260() {
		var p260_texts = [
			["Texts can have different fonts, sizes, depth, ", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["color, materials, edges and other features", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p260_frameTexts = this.createMultiTextFrame(data_260, p260_texts, this.p270);
	}

	p270() {
		var p270_texts = [
			["The meshes can use materials with different properties,", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["such as color, transparency, texture to images, videos,", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["HTML elements of the document and other available sources.", 0, -200, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.p270_frameTexts = this.createMultiTextFrame(data_270, p270_texts, this.pTabelaPeriodica);
	}

	pTabelaPeriodica() {
		this.framesElementos = [];
		function criarFrameElemento(Z) {
			var e = $g.metadata.dadosElementos[Z-1];
			var texts = [
				[["O",e.n,"tem Z =",e.Z,"e símbolo = '",e.sn,"'."].join(" "), 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
				[["Tem peso atômico =",e.ma," e radius atômico =",e.ra,"."].join(" "), 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
			]
			var atom = new Atom({
			owner                         : this.scenery.scene,
			scenery                       : this.scenery,
			elementos                     : elementos,
			Z                             : Z,
			raios_atomicos_calculados_rac : $g.metadata.raios_atomicos_calculados_rac_plastic,
			cabec_rac                     : $g.metadata.cabec_rac,
			usarAxis                      : true,
			espichar                      : this.espichar,
			carregar                      : false,
			movimentar                    : true,
			movimentacaoAleatoria         : false,
			tempoEspera                   : 100});
			var x = e.g * 400;
			var z = e.p * 400;
			var data = {
				moveType: "to",
				time: {start: 10000, loop: 1000, step: 20},
				origin: {x: x, z: z},
				target: {x: x, z: z + 200}
			}
			var f = this.createMultiTextFrame(
				data, texts, function(){
					if (Z = 118) p400(); else this.criarFrameElemento(Z+1);
				}
			);
			this.framesElementos.push(f);
		}
		criarFrameElemento(1);
	}

	p400_image(file_, text_, x_, y_, z_) {
		var t = this;
		var img = new Image();
		img.onload = function() {
			t.addSlideImagePlaneWithText(
				t.p400_images, text_, t.textSizeModelFarm.mediumDsbn,
				t.mf.gray8front, this.width, this.height, 1, 1,
				x_, y_, z_, this);
		}
		img.src = this.dir + file_;
	}

	p400() {
		var t = this;
		this.p400_frame = this.getActFrame();
		/*
		this.doubleMove(
			this.p400_frame, null, null, zTo_400_01, startTime_400_01, loopTime_400_01, stepTime_400_01,
			this.p490, 100, zTo_400_210, startTime_400_210, loopTime_400_210, stepTime_400_210);
		*/
		var data2 = {
			owner: this.actions,
			obj3d: this.owner.sceneMaker.cameraGroup,
			target: data_400_02.target,
			time: data_400_02.time,
			onFinish: function() {
				setTimeout(function() {
					t.p490.call(t);
				}, 100);
			}
		}
		var data1 = {
			owner: this.actions,
			obj3d: this.owner.sceneMaker.cameraGroup,
			actData: data_400_01,
			onFinish: function() {
				this.actions.moveTo(data2);
			}
		}
		this.actions.moveTo(data1);
		this.p400_images = new S3dPlaneChain({owner: this.p400_frame, scene: this.p400_frame.obj3d});
		this.dir = "/workshop/webgl-threejs/img/learning-threejs/1/";
		var files = [
			"forced-materials.01a.png", "lens-flare.01a.png", "line-material.01a.png",
			"load-ctm.01a.png", "load-obj-mtl.png", "load-ply.01a.png",
			"load-str.01a.png", "material-properties.01a.png", "mesh-face-material.png",
			"mesh-normal-material.01a.png", "mesh-phng-material.png", "normal-map.01.png",
			"orbit.01a.png", "particles.01a.png", "physics.01a.png",
			"physics-basic-scene.01a.png", "point-light.01a.png", "point-light.02a.png",
			"polyedron.01a.png", "rainy.01a.png", "repeat-wrapping.01a.png",
			"selecting.01a.png", "shaderpass-blur.01a.png", "shaderpass-custom.01a.png",
			"shaderpass-simple.01a.png", "shaderpass-simple.02a.png", "shapes.png",
			"specular-map.01a.png", "spot-light.01a.png", "spot-light.02a.png",
			"sprite-rain.01a.png", "sprites.01a.png", "texture.01a.png",
			"trackball.01a.png"
		];
		var texts = [
			"forced-materials.01a.png", "lens-flare.01a.png", "line-material.01a.png",
			"load-ctm.01a.png", "load-obj-mtl.png", "load-ply.01a.png",
			"load-str.01a.png", "material-properties.01a.png", "mesh-face-material.png",
			"mesh-normal-material.01a.png", "mesh-phng-material.png", "normal-map.01.png",
			"orbit.01a.png", "particles.01a.png", "physics.01a.png",
			"physics-basic-scene.01a.png", "point-light.01a.png", "point-light.02a.png",
			"polyedron.01a.png", "rainy.01a.png", "repeat-wrapping.01a.png",
			"selecting.01a.png", "shaderpass-blur.01a.png", "shaderpass-custom.01a.png",
			"shaderpass-simple.01a.png", "shaderpass-simple.02a.png", "shapes.png",
			"specular-map.01a.png", "spot-light.01a.png", "spot-light.02a.png",
			"sprite-rain.01a.png", "sprites.01a.png", "texture.01a.png",
			"trackball.01a.png"
		];
		var y = 0;
		var deltaX = 1000;
		var deltaZ = -1000;
		var len = files.length;
		for (var i = 0; i < len; i++) {
			this.p400_image(files[i], texts[i], i * deltaX, y, i * deltaZ);
		}
	}
	
	p490() {
	}

	p500() {
		this.p500_frame = this.getActFrame();
		this.p500_frame.obj3d.position.z = -27000;
	}

	p600() {
		this.p600_frame = this.getActFrame();
		this.p600_frame.obj3d.position.z = -33000;
		var geo = $g.geo.factory.sphere(350,100,100,0,Math.PI,0,Math.PI);
		var tpdsbn18x4 = this.tsmf.dsbn18x4;
		var mblueOp30 = this.mf.blueOp30;
		var owner = this.p600_frame;
		var scene = owner.obj3d;
		var a = this.addSphereText("Char"    , owner, scene,     0,    0,  1000, tpdsbn18x4, this.mf.red,   geo, mblueOp30);
		var b = this.addSphereText("Text"    , owner, scene,  -500,  300,   500, tpdsbn18x4, this.mf.green, geo, mblueOp30);
		var c = this.addSphereText("Cube"    , owner, scene, -1000,  600,     0, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
		var d = this.addSphereText("Box"     , owner, scene,  -500,  300,  -500, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
		var e = this.addSphereText("Sphere"  , owner, scene,     0,    0, -1000, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
		var f = this.addSphereText("Mesh"    , owner, scene,   500, -300,  -500, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
		var g = this.addSphereText("Light"   , owner, scene,  1000, -600,     0, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
		var h = this.addSphereText("Material", owner, scene,   500, -300,   500, tpdsbn18x4, this.mf.blue,  geo, mblueOp30);
	}

	p700() {
		this.p700 = this.getActFrame();
		this.p700.obj3d.position.z = -21000;
	}

	addSphereText(str_, owner_, scene_, x_, y_, z_, textSizeModel_, textMaterial_, sphereGeometry_, sphereMaterial_) {
		var sphere = new THREE.Mesh(sphereGeometry_, sphereMaterial_);
		sphere.position.set(x_,y_,z_);
		scene_.add(sphere);
		var rt = new S3dRichText($g.s3d.data.richTextData(
			str_, owner_, sphere, {y: 0}, {y: 0}, 
			textSizeModel_, textMaterial_, null,function(){}));
		/*rt.setStr(str_);*/
		rt.center();
		return sphere;
	}

	addText(str_, owner_, scene_, px_, py_, pz_, textSizeModel_, textMaterial_) {
		return new S3dRichText($g.s3d.data.richTextData(
			str_,owner_,scene_,{x: px_, y: py_, z: pz_},{z: 0},
			textSizeModel_,textMaterial_,null,function(){}));
	}
	
	/*
	 getTextArray() {
	 
	 var p220_rtc1_textArray = [["Studddio is a small opensource framework to make 3D objects.",
	 -50, 0, 0, 0, 0, 0, tpmed, mgray, null]];
	 var p10_rtc1_textArray = [["Studddio is a small opensource framework to make 3D objects.",
	 -50, 0, 0, 0, 0, 0, tpmed, mgray, null]];
	 }
	 */
}