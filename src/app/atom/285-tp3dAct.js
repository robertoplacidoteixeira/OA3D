/*
var z_290 = z_280 - 6000;
var data_290 = {actionType: "moveto", time: {start: 10000, loop: 3000, steps: 20}, origin: {z: z_290}, target: {z: z_290 + 1500}}

var z_400 = z_290 - 6000;
var data_410_01 = {actionType: "moveto", time: {start: 10000, loop: 3000, steps: 20}, origin: {z: z_400}, target: {y: 20, z: z_400 + 800}}
var data_410_02 = {actionType: "moveto", time: {start: 0, loop: 20000, steps: 20}, origin: {z: z_400}, target: {x: 33300, z: z_400 - 32300}}
*/

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
		this.white = this.mf.white;
		this.black = this.mf.black;
		this.useClonedBoxes = false;
		this.useScaledMeshs = false;
	}

	loadAct() {
		this.pTabelaPeriodica();
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

		var z_090 = 10000;
		var data_090_01 = {actionType: "moveto", time: {start: 0, loop: 3000, steps: 20}, target: {z:11000}}
		var data_090_02 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, target: {z:4000}}
		
		var t = this;
		var f = this.getActFrame();
		this.doubleMove(
			this.cameraGroup,
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

		var z_100 = 0;
		var data_100_01 = {actionType: "moveto", time: {start: 10000, loop: 3000, steps: 20}, target: {z: 200}}
		var data_100_02 = {actionType: "moveto", time: {start: 10000, loop: 3000, steps: 20}, target: {z: 1500}}

		var f = this.getActFrame();
		this.doubleMove(
			this.cameraGroup,
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
		var cg = $g.factory.geo.cylinder(30,30,500);
		var sg = $g.factory.geo.sphere(200); // (30,32,32)
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

		var cyl = $g.factory.mesh.cylinder(cylinderGeometry_, this.mgray6);
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
				var cd = $g.factory.data.s3d.richCharData(
					str_,this,chain,{x:0,y:0,z:0},{x:0,y:0,z:0},
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
	
	font() {
	}

	p200() {
		this.z_200 = 0;
		this.data_200 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, origin: {z: this.z_200}, target: {z: this.z_200 + 300}}
		var t = [
			["OA3D", 0, 100, 0, 0, 0, 0, this.tpnormal/*this.tpbig2*/, this.mgray3, null]
		];
		this.createTextsFrame(this.data_200, t, this.p201);
	}

	p201() {
		this.z_201 = this.z_200 - 3000;
		this.data_201 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, origin: {z: this.z_201}, target: {z: this.z_201 + 300}}
		var t = [
			["Orbitals Atômicos 3D", 0, -100, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.createTextsFrame(this.data_201, t, this.p210);
	}

	p210() {
		this.z_210 = this.z_201 - 3000;
		this.data_210 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, origin: {z: this.z_210}, target: {z: this.z_210 + 300}}
		var t = [
			["Introdução", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.createTextsFrame(this.data_210, t, this.p220);
	}

	p220() {
		this.z_220 = this.z_210 - 3000;
		this.data_220 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, origin: {z: this.z_220}, target: {z: this.z_220 + 300}}
		var t = [
			["A tabela periódica tem", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["118 elems", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["em 7 períodos (linhas)", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["e 18 grupos (colunas)", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.createTextsFrame(this.data_220, t, this.p221);
	}

	p221() {
		this.z_221 = this.z_220 - 3000;
		this.data_221 = {actionType: "moveto", time: {start: 5000, loop: 3000, steps: 20}, origin: {z: this.z_221}, target: {z: this.z_221 + 300}}
		var t = [
			["Os raios atômicos dos átomos", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["dos elems crescem nos ", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["grupos da direita para esquerda", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null],
			["e nos períodos de cima para baixo", 0, 0, 0, 0, 0, 0, this.tpnormal, this.mgray6, null]
		];
		this.createTextsFrame(this.data_221, t, pTabelaPeriodica); /*function(){}*/ /*this.p230*/
	}
		
	pTabelaPeriodica() {
		var z_221 = 5000;
		var z_280 = z_221 - 5000;

		var t = this;
		t.framesElementos = [];
		t.app.camera.position.set(0,750,1400);
		t.app.camera.lookAt(0,450,0);
		t.app.camera.position.x = -500;
		/*
		var sl = new THREE.SpotLight( 0x000000 , 100 , 30000 , Math.PI/4 , 0.1, 2 );
		sl.position.set(0, 10000, 0);
		sl.castShadow = true;
		sl.shadow.mapSize.width = 1024;
		sl.shadow.mapSize.height = 1024;
		sl.shadow.camera.near = 1;
		sl.shadow.camera.far = 20000;
		sl.shadow.focus = 1;
		var s = this.app.scene;
		s.add(sl);
		var slh = new THREE.SpotLightHelper(sl);
		s.add(slh);
		var ch = new THREE.CameraHelper(sl.shadow.camera);
		s.add(ch);
		this.app.spotLights.push({sl: sl, slh: slh, ch: ch});
		*/
		
		var mat = {};
		var mesh = {};
		
		var gb = $g.factory.geo.box(800,10,800);

		var atomBoxMaterials = t.atomBoxMaterials();
		
		var ab = (t.useClonedBoxes) ? t.atomBoxMeshs(atomBoxMaterials, gb) : null;
		
		var atomMaterials = t.atomMaterials();
		
		var atomMeshs = (t.useScaledMeshs) ? t.atomMeshs(atomMaterials) : null;
		
		var x, y, z, e, g, p, mat, mesh, m, lan, act, plane, source, res;
		
		for (var Z = 1; Z <= 118; Z++) {
			e = $g.metadata.elemsData[$g.metadata.elems[Z-1].simbolo];
			g = e.g;
			p = e.p;
			x = (g-9) * 1000;
			lan = ((Z >= 57) && (Z <= 71));
			act = ((Z >= 89) && (Z <= 103));
			y = lan ? ((Z - 57) * 1000) : act ? ((Z - 89) * 1000) : 0;
			source =  (this.useClonedBoxes) ? ab : atomBoxMaterials;
			res = (g < 3) ? source.s : (g < 13) ? ((lan || act) ? source.f : source.d) : source.p;
			m = (this.useClonedBoxes) ? res.clone() : $g.factory.mesh.mesh(gb,res);
			z = z_280 - ((p-3.5) * 1000);
			m.position.set(x,y-5,z);
			m.receiveShadow = true;
			t.obj3d.add(m);
		}

		function createFramedAtomZ(Z) {
			e = $g.metadata.elemsData[$g.metadata.elems[Z-1].simbolo];
			x = (e.g-9) * 1000;
			y = (Z >= 57 && Z <= 71) ? ((Z - 57) * 1000 ) : (Z >= 89 && Z <= 103) ? ((Z - 89) * 1000) : 0;
			z = z_280 - ((e.p-3.5) * 1000);
			
			function moveToElement() {
				t.actions.add({
					property: "position",
					obj3d: t.cameraGroup,
					target: {x: x, y: y, z: z + e.ra*1.2},
					time: {start: 500, loop: 20, steps: 4},
					onFinish: function() {
						createFrameZ();
					}
				});
			}
			
			function createFrameZ() {
				t.actions.add({
					callback: t.createAtomFrame,
					cbdata: {
						owner: t,
						scene: t.obj3d,
						elemData: e,
						origin: {x: x, y: y, z: z}
					},
					time: {start: 200},
					onFinish: function(action,actionData) {
						t.actions.add({
							callback: t.createAtom,
							cbdata: {
								app: t.app,
								scenery: t.app.scenery,
								scene: actionData.obj3d,
								elemData: e,
								useScaledMeshs: t.useScaledMeshs,
								atomMaterials: atomMaterials,
								atomMeshs: atomMeshs
							},
							time: {start: 200},
							onFinish: function() {
								if (Z < 118) 
									createFramedAtomZ(Z+1);
								else
									t.actions.add({
										property: "position",
										obj3d: t.cameraGroup,
										target: {x: 0, z: z_280 + 6000},
										time: {start: 200, loop: 2000, steps: 50}
									});
							}
						});
					}
				});
			}
			
			moveToElement();
		}
		createFramedAtomZ(1);
	}
	
	createAtomFrame(data_) {
		var o = data_.owner;
		/*
		var texts = [
			[["O",e.n,"tem Z =",e.Z,"e símbolo = '",e.sn,"'."].join(" "), 0, 0, 0, 0, 0, 0, t.tpnormal, t.mgray6, null],
			[["Tem peso atômico =",e.ma," e radius atômico =",e.ra,"."].join(" "), 0, 0, 0, 0, 0, 0, t.tpnormal, t.mgray6, null]
		];
		*/
		var e = data_.elemData;
		var texts = [
			[e.na + " " + e.sn /*+ " " + e.g + "," + e.p*/, 0, 0, 0, 0, 0, 0, o.tpnormal, o.mgray3, null]/*,
			[e.n, 0, 0, 0, 0, 0, 0, o.tpnormal, o.mgray3, null]*/
		];
		var f = o.createTextsFrame(data_, texts);
		f.obj3d.position.z += 300;
		//o.obj3d.opacity = 0;
		o.framesElementos.push(f);
		return f;
	}

	createAtom(data_) {
		var e  = data_.elemData;
		var Z = e.na, g = e.g, p = e.p, r = e.radius, s = data_.scene;
		var usm = data_.useScaledMeshs, atomMaterials = data_.atomMaterials, atomMeshs = data_.atomMeshs;
		var c = $g.metadata.calcAtomicRadius_car[Z-1][2], r = c[c.length-1];
		var source = usm ?  atomMeshs : atomMaterials;
		var res =
			(r ===  0) ? source.nothing :
			(g ===  1) ? ((p === 1) ? source.notmetal : source.alcametal) :
			(g ===  2) ? source.earthmetal :
			(g  <  13) ? (((Z >= 57) && (Z <= 71)) ? source.lanthanide : ((Z >= 89) && (Z <= 103)) ? source.actnideo : source.transmetal) :
			(g === 13) ? ((p === 2) ? source.semimetal : source.othermetal) :
			(g === 14) ? ((p === 2) ? source.notmetal : (p < 4) ? source.semimetal : source.othermetal) :
			(g === 15) ? ((p < 4) ? source.notmetal : (p < 6) ? source.semimetal : source.othermetal) :
			(g === 16) ? ((p < 5) ? source.notmetal : (p < 7) ? source.semimetal : source.othermetal) :
			(g === 17) ? source.halogen :
			(g === 18) ? source.noblegas : null
			// var mat = new THREE.MeshPhongMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
		var mesh = usm ? res.clone() : new THREE.Mesh($g.factory.geo.sphere(((r > 0) ? r : 10),16,16),res);
		if (usm) mesh.scale.set(r,r,r);
		mesh.position.y = e.ra + 200;
		mesh.receiveShadow = true;
		s.add(mesh);
		
		return;
		//
		var atom = new Atom({
			scenery              : data_.scenery,
			scene                : data_.scene,
			Z                    : data_.Z,
			useAxis              : data_.useAxis || false,
			espichar             : data_.espichar || 0,
			load                 : false,
			movimentElectrons    : true,
			RandomMove           : false,
			waitTime             : 0
		});
		atom.atom3d.position.set(0,300,0);
		data_.app.atoms.push(atom);
		return atom;
	}

	atomBoxMaterials() {
		var mm = THREE.MeshPhongMaterial;
		function p(color_) {
			return {color: color_, opacity: 0.8, transparent: true};
		}
		return {
			s : new mm(p(0xff0000)),
			p : new mm(p(0x00ff00)),
			d : new mm(p(0x0000ff)),
			f : new mm(p(0x661978)),
		}
	}

	atomMaterials() {
		var mm = THREE.MeshPhongMaterial;
		function p(color_) {
			return {color: color_, opacity: 0.8, transparent: true};
		}
		return {
			alcametal  : new mm(p(0x008800)),
			earthmetal : new mm(p(0x00ff00)),
			transmetal : new mm(p(0x771111)),
			lanthanide : new mm(p(0xffbb00)),
			actnideo   : new mm(p(0xff4400)),
			othermetal : new mm(p(0x000044)),
			semimetal  : new mm(p(0x6622ee)),
			notmetal   : new mm(p(0x222233)),
			halogen    : new mm(p(0x22ffee)),
			noblegas   : new mm(p(0x000022)),
			nothing    : new mm(p(0x000000))
		}
	}
	
	atomBoxMeshs(mats_, gb_) {
		var m = $g.factory.mesh;
		return {
			s : m.mesh(gb_,mats_.s),
			p : m.mesh(gb_,mats_.p),
			d : m.mesh(gb_,mats_.d),
			f : m.mesh(gb_,mats_.f)
		}
	}
	
	atomMeshs(mats_) {
		var gs = $g.factory.geo.sphere((1),16,16);
		var m = $g.factory.mesh;
		return {
			alcametal  : m.mesh(gs,mats_.alcametal),
			earthmetal : m.mesh(gs,mats_.earthmetal),
			transmetal : m.mesh(gs,mats_.transmetal),
			lanthanide : m.mesh(gs,mats_.lanthanide),
			actnideo   : m.mesh(gs,mats_.actnideo),
			othermetal : m.mesh(gs,mats_.othermetal),
			semimetal  : m.mesh(gs,mats_.semimetal),
			notmetal   : m.mesh(gs,mats_.notmetal),
			halogen    : m.mesh(gs,mats_.halogen),
			noblegas   : m.mesh(gs,mats_.noblegas),
			nothing    : m.mesh(gs,mats_.nothing)
		}
	}
	
	/*
	function main() {
		const fov = 45;
		const aspect = 2;	// the canvas default
		const near = 0.1;
		const far = 100;
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 10, 20);
		camera.lookAt(0, 0, 0);

		const loader = new THREE.TextureLoader();
		{
			const planeSize = 40;

			const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.magFilter = THREE.NearestFilter;
			const repeats = planeSize / 2;
			texture.repeat.set(repeats, repeats);

			const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
			const planeMat = new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.DoubleSide,
			});
			planeMat.color.setRGB(1.5, 1.5, 1.5);
			const mesh = new THREE.Mesh(planeGeo, planeMat);
			mesh.rotation.x = Math.PI * -.5;
			scene.add(mesh);
		}

		const shadowTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/roundshadow.png');
		const sphereShadowBases = [];
		{
			const sphereRadius = 1;
			const sphereWidthDivisions = 32;
			const sphereHeightDivisions = 16;
			const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

			const planeSize = 1;
			const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);

			const numSpheres = 15;
			for (let i = 0; i < numSpheres; ++i) {
				// make a base for the shadow and the sphere.
				// so they move together.
				const base = new THREE.Object3D();
				scene.add(base);

				// add the shadow to the base
				// note: we make a new material for each sphere
				// so we can set that sphere's material transparency
				// separately.
				const shadowMat = new THREE.MeshBasicMaterial({
					map: shadowTexture,
					transparent: true,		// so we can see the ground
					depthWrite: false,		// so we don't have to sort
				});
				const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
				shadowMesh.position.y = 0.001;	// so we're above the ground slightly
				shadowMesh.rotation.x = Math.PI * -.5;
				const shadowSize = sphereRadius * 4;
				shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
				base.add(shadowMesh);

				// add the sphere to the base
				const u = i / numSpheres;
				const sphereMat = new THREE.MeshPhongMaterial();
				sphereMat.color.setHSL(u, 1, .75);
				const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
				sphereMesh.position.set(0, sphereRadius + 2, 0);
				base.add(sphereMesh);

				// remember all 3 plus the y position
				sphereShadowBases.push({base, sphereMesh, shadowMesh, y: sphereMesh.position.y});
			}
		}

		{
			const skyColor = 0xB1E1FF;	// light blue
			const groundColor = 0xB97A20;	// brownish orange
			const intensity = 2;
			const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
			scene.add(light);
		}

		{
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(0, 10, 5);
			light.target.position.set(-5, 0, 0);
			scene.add(light);
			scene.add(light.target);
		}

		function resizeRendererToDisplaySize(renderer) {
			const canvas = renderer.domElement;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			const needResize = canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}
			return needResize;
		}

		function render(time) {
			time *= 0.001;	// convert to seconds

			resizeRendererToDisplaySize(renderer);

			{
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
			}

			sphereShadowBases.forEach((sphereShadowBase, ndx) => {
				const {base, sphereMesh, shadowMesh, y} = sphereShadowBase;

				// u is a value that goes from 0 to 1 as we iterate the spheres
				const u = ndx / sphereShadowBases.length;

				// compute a position for there base. This will move
				// both the sphere and its shadow
				const speed = time * .2;
				const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
				const radius = Math.sin(speed - ndx) * 10;
				base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

				// yOff is a value that goes from 0 to 1
				const yOff = Math.abs(Math.sin(time * 2 + ndx));
				// move the sphere up and down
				sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
				// fade the shadow as the sphere goes up
				shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff);
			});

			renderer.render(scene, camera);

			requestAnimationFrame(render);
		}

		requestAnimationFrame(render);
	}
	*/
	
	p400_image(file_, text_, x_, y_, z_) {
		var t = this;
		var img = new Image();
		img.onload = function() {
			t.addSlideImagePlaneWithText(
				t.p400_images, text_, t.textSizeModelFarm.mediumDsbn,
				t.mf.gray8front, this.width, this.height, 1, 1,
				x_, 
				y_, z_, this);
		}
		img.src = this.dir + file_;
	}

	p400() {
		var t = this;
		this.p400_frame = this.getActFrame();
		/*
		this.doubleMove(
			this.cameraGroup,
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
		var geo = $g.factory.geo.sphere(350,100,100);
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
		var rt = new S3dRichText($g.factory.data.s3d.richTextData(
			str_, owner_, sphere, {y: 0}, {y: 0}, 
			textSizeModel_, textMaterial_, null,function(){}));
		/*rt.setStr(str_);*/
		//rt.center();
		return sphere;
	}

	addText(str_, owner_, scene_, px_, py_, pz_, textSizeModel_, textMaterial_) {
		return new S3dRichText($g.factory.data.s3d.richTextData(
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