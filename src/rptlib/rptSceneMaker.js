class RptSceneMaker extends RptCommonAncestor {
	
	beforePrepare() {
		super.beforePrepare();
		this.deltaX = 0;
		this.deltaY = 0;
		this.deltaZ = 0;
		this.lastX = 0;
		this.lastY = 0;
		this.lastZ = 0;
		this.mouseX = 0;
		this.targetRotation = 0;
		this.targetRotationOnMouseDown = 0;
		this.mouseXOnMouseDown = 0;
		this.camera = null;
		this.cameraTarget = null;
		this.effectFXAA = null;
		this.moveY = true;
		this.postprocessing = {enabled: false}
		this.useWebgl = true;
		this.stats = undefined;
	}
	
	afterPrepare() {
		super.afterPrepare();
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
		this.webglAvailable = this.webglAvailable();
	}
	
	duringCreate() {
		super.duringCreate();
		this.createContainer();
		this.createRenderer();
		this.createScene();
		this.createCamera();
		this.createLights();
		this.createStats();
		this.createControl()
	}
	
	afterCreate() {
		super.afterCreate();
		this.app.camera = this.camera;
		this.app.scene = this.scene;
		this.app.renderer = this.renderer;
		this.prepareEvents();
	}
	
	prepareEvents()	{
		
		var t = this;
		
		function onWindowResize() {
			t.windowHalfX = window.innerWidth / 2;
			t.windowHalfY = window.innerHeight / 2;
			t.camera.aspect = window.innerWidth / window.innerHeight;
			t.camera.updateProjectionMatrix();
			t.renderer.setSize(window.innerWidth, window.innerHeight);
			if (t.composer) {
				t.composer.reset();
				if (t.effectFXAA)
					t.effectFXAA.uniforms[ 'resolution' ].value.set(1 / window.innerWidth, 1 / window.innerHeight);
			}
			/*
			if ($g.controls.useTrackball) {
				t.trackballControls.handleResize();
				t.animate();
			}
			*/
		}

		function onWindowUnload() {
			if ((window.janela) && (window.janela.JanelaWindow)) window.janela.JanelaWindow = null;
		}
		
		window.addEventListener('resize',onWindowResize,false);
		window.addEventListener('unload', onWindowUnload,false);
	}

	webglAvailable() {
		try {
			var canvas = document.createElement('canvas');
			return !!(window.WebGLRenderingContext && (
					canvas.getContext('webgl') ||
					canvas.getContext('experimental-webgl'))
					);
		} catch (e) {
			return false;
		}
	}

	createCamera() {
		this.createPerspectiveCamera(
			45, window.innerWidth / window.innerHeight,
			1, 10000, null, null, null);
	}
	
	createScene() {
		this.scene = new THREE.Scene();
		this.scene.background = this.app.scenery.clearColor();
		this.renderer.setClearColor(this.scene.background);
		//this.scene.fog = new THREE.Fog(0x000000,1,10000);
	}

	createLights() {
		this.app.scenery.createLights(this.scene);
		/*
		var s = this.scene;
		this.ambientLight = new THREE.AmbientLight(0xffffff);
		s.add(this.ambientLight);
		return;
		this.hemiLight = new THREE.HemisphereLight(0xBBBBBBff, 0x4444ff, 100);
		s.add(this.hemiLight);
		*/
	}
	
	createPerspectiveCamera(fov, aspect, near, far, position, rotation, cameraTarget) {
		this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		if (position) {
			this.camera.position.set(position.x, position.y, position.z);
		}
		if (rotation) {
			this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
		}
		if (cameraTarget) {
			this.cameraTarget = cameraTarget;
		}
		// this.scene.add(this.camera);
		this.createPerspectiveCameraGroup();
	}

	createPerspectiveCameraGroup() {
		this.cameraGroup = new THREE.Object3D();
		this.cameraGroup.add(this.camera);
		//this.scene.add(this.cameraGroup);
		this.createCameraGroupLights();
	}

	createCameraGroupLights() {
		this.useDirLight = false;
		this.useWhiteLight = true;
		if (this.useDirLight) {
			this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
			this.dirLight.position.set(0, 0, 1).normalize();
			this.cameraGroup.add(this.dirLight);
		}
		if (this.useWhiteLight) {
			this.pointLight_01 = this.createCameraGroupPointLight(0xffffff, 0.5, 0, 0, 250, 0, 0, 0);
			//this.randomColor();
		} else {
			/*
			this.pointLight_01 = this.createCameraGroupPointLight(0xFF0000, 1.5, -1000, 0, 0, 0, 0, 0); /*3 * (Math.PI / 4* /
			this.pointLight_02 = this.createCameraGroupPointLight(0x00FF00, 1.5,     0, 0, 0, 0, 0, 0);
			this.pointLight_03 = this.createCameraGroupPointLight(0x0000FF, 1.5,  1000, 0, 0, 0, 0, 0); /*-3 * (Math.PI / 4)* /
			*/
		}
	}

	randomColor()  {
		if (this.useWhiteLight) {
				//this.pointLight_01.color.setHSL(Math.random(), 1, 0.5);
		} else {
		}
	}

	createCameraGroupPointLight(color, intensity, px, py, pz, rx, ry, rz) {
		var pl = new THREE.PointLight(color, intensity);
		pl.position.set(px, py, pz);
		pl.rotation.set(rx, ry, rz);
		this.cameraGroup.add(pl);
		return pl;
	}

	cameraTarget(cameraTarget) {
		this.cameraTarget = cameraTarget;
	}

	createContainer() {/*
		this.container = document.createElement('div');
		document.body.appendChild(this.container);
		*/
		this.container = (this.idContainer) ? document.getElementById(this.idContainer) : undefined;
	}

	createRenderer() {
		if (!this.container) return;
		this.renderer = (this.useWebgl && this.webglAvailable) ? new THREE.WebGLRenderer($g.renderer.data) : new THREE.CanvasRenderer($g.renderer.data);
		var r = this.renderer
		this.container.appendChild(r.domElement);
		r.setPixelRatio(window.devicePixelRatio);
		r.setSize(window.innerWidth,window.innerHeight);
		r.outputEncoding = THREE.sRGBEncoding;
		//r.shadowMap.enabled = true;
		//r.shadowMap.type = THREE.PCFSoftShadowMap;
		//r.physicallyCorrectLights = true;
		//r.gammaInput = true;
		//r.gammaOutput = true;
		// r.setClearColor($g.renderer.fogClearColor ? this.scene.fog.color : $g.renderer.clearColor);
	}

	createControl() {
		if ($g.controls.useTrackball) this.prepareTrackball();
		this.controle = new MapaControleOrbital(this.camera,this.scene,this.renderer.domElement); // this.camera,this.scene,this.renderer.domElement
	}

	createStats() {
		if (!$g.stats.active) return;
		this.stats = new Stats();
		this.container.appendChild(this.stats.domElement);
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.stats.domElement.style.zIndex = 100;
	}

	postProcessing(enabled, width, height) {
		this.postprocessing.enabled = enabled;
		if (this.postprocessing.enabled && !this.composer) {
			if ((!this.useWebgl) || (!this.webglAvailable)) {
				this.postprocessing.enabled = false;
				return;
			}
			this.renderer.autoClear = false;
			var renderModel = new THREE.RenderPass(this.scene, this.camera);
			var effectBloom = new THREE.BloomPass(0.25);
			var effectFilm = new THREE.FilmPass(0.5, 0.125, 2048, false);
			this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
			this.width = width || 2;
			this.height = height || 2;
			this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / this.width, 1 / this.height);
			effectFilm.renderToScreen = true;
			this.composer = new THREE.EffectComposer(this.renderer);
			this.composer.addPass(renderModel);
			this.composer.addPass(this.effectFXAA);
			this.composer.addPass(effectBloom);
			this.composer.addPass(effectFilm);
		}
		this.postprocessing.enabled = this.postprocessing.enabled && this.composer;
	}

	renderCameraScene() {
		// this.camera.lookAt(this.cameraTarget);
		this.renderer.clear();
		if (this.postprocessing.enabled) {
			this.composer.render(0.05);
		} else {
			this.renderer.render(this.scene, this.camera);
		}
	}
		
	onBeforeRender() {
		/*
		if ($g.stats.active) this.stats.begin();
		if (this.controlType === $g.controlTypes.rotational) {
			this.scene.rotation.y += (this.targetRotation - this.scene.rotation.y) * 0.05;
		} else if (this.controlType === $g.controlTypes.positional) {
			this.cameraGroup.position.x -= this.deltaX * 2;
			this.cameraGroup.position.y += this.deltaY * 2;
			this.cameraGroup.position.z -= this.deltaZ * 2;
		}
		*/
	}

	onAfterRender() {
		this.deltaX = 0;
		this.deltaY = 0;
		this.deltaZ = 0;
		if ($g.stats.active) this.stats.end();
	}

	animate(callback) {
		this.randomColor();
		if ($g.stats.active) this.stats.update();
		if ($g.controls.useTrackball) {
			this.trackballControls.update();
			return;
		}
		this.onBeforeRender();
		/*
		if (this.controlType === $g.controlTypes.rotational) {
			this.scene.rotation.y += (this.targetRotation - this.scene.rotation.y) * 0.05;
		} else if (this.controlType === $g.controlTypes.positional) {
		}
		*/
		this.renderCameraScene();
		if (callback) callback();
		this.onAfterRender();
	}
}
