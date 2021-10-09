class TP3dApp extends AtomApp {

	afterPrepare() {
		super.afterPrepare();
		this.camera.position.set(0,400,700);
		this.camera.lookAt(0,150,0);
		this.spotLights = [];
	}
	
	duringCreate() {
		super.duringCreate();
		var g = $g.tp3d;
		if (g.useAct)
			this.createAct();
		else if (g.apresentacaoLink3D)
			this.createtp3dGlobal.apresentacaoLink3D(apresentacaoLinkParam);
		else if (g.linkComunicacao)
			this.createtp3dGlobal.linkComunicacao(70, 20);
		else if (g.editText)
			this.createGlobalEditor(70, 20);
		else if (g.showDocPlanes)
			this.createGlobalPlanePool();
		else if (g.useSiteSystems)
			this.createGlobalTotvsSiteSystemsTextPool();
		else if (g.globalUseGlobalColoredTextPool)
			this.createGlobalColoredTextPool()
		else if (g.useTextPool) {
			this.getTextFromHash();
			this.createGlobalTextPool();
		};
	}

	afterCreate() {
		super.afterCreate();
		$("#id-div-ajuda").load("src/app/atom/html/293-help.html");		
		var g = $g.tp3d;
		if (g.useMirror) this.PrepareMirrorPlane();
		if (g.useTextPool) this.PrepareEventsExample3();
		if (g.showDocPlanes) {
		} else {
			/*
			if (g.useTextPool) {
				var centerX = -0.5 * (globalTextPool.maxX - globalTextPool.minX);
				globalGroup.position.x = centerX;
			} else if (g.useSiteSystems) {
				var centerX = -0.5 * (g.alfanumTextPool.maxX - g.alfanumTextPool.minX);
				globalGroup.position.x = centerX;
			}
			*/
		}
	}

	createAct() {
		this.act = new TP3dAct($g.factory.data.s3d.actData(this, this.sceneMaker, new S3dActKit()));
	}

	/*
	createInfo() {
		this.info = document.getElementById("info");
		this.info.style.visibility = "hidden";
	}

	createHelp() {
		var g = $g.tp3d;
		this.g.globalStudddioAct = document.getElementById("menu-ajuda");
		this.g.globalStudddioAct.addEventListener('mouseover', this.MostrarAjuda, false);
		this.g.globalStudddioAct.addEventListener('mouseleave', this.EsconderAjuda, false);
		this.g.divAjuda = document.getElementById("ajuda");
		this.g.divMolduraAjuda = document.getElementById("moldura-ajuda");
		this.g.divMolduraAjuda.style.display = "none";
	}
	
	MostrarAjuda() {
		this.help = document.getElementById("ajuda");
		this.help.style.display = "block";
	}

	EsconderAjuda() {
		this.style.display = "none";
	}
	*/

	createLights() {
		var g = $g.tp3d;
		if (g.apresentacaoLink3D) return;
		if (g.useAct) {
			// this.sceneMaker.createCameraGroupLights();
		} else {
			var al = new THREE.AmbientLight(0xeeeeee);
			this.sceneMaker.scene.add(al);
			this.dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
			this.dirLight.position.set(0, 0, 1).normalize();
			this.sceneMaker.scene.add(this.dirLight);
			this.pointLight = new THREE.PointLight(0xcccccc, 1.5);
			this.pointLight.position.set(0, 100, 90);
			this.al = new THREE.AmbientLight(0xeeeeee);
			this.sceneMaker.scene.add(this.pointLight);
		}
	}

	PrepareMirrorPlane() {
		this.plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(10000, 10000),
			new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true})
		);
		this.plane.position.y = 100;
		this.plane.rotation.x = -Math.PI / 2;
		this.sceneMaker.scene.add(this.plane);
	}

	createPlaneChainRange(jpgPrefix, start, end) {
		var param = {
			owner: null,
			scene: this.sceneMaker.scene
		}
		var pc = new S3dPlaneChain(globalPlaneParameters, false);
		for (var i = start; i < end; i++) {
			var str = i + ".jpg";
			if (str.length < 6) {
				str = "0" + str;
			}
			pc.addPlaneToChain(0, 0, -((i - 1) * 1000), 20, 70, 30, jpgPrefix + str, g.useMirror);
		}
		return pc;
	}

	getRenderCallback() {
		var t = this;
		var g = $g.tp3d;
		return function() {
			if (g.apresentacaoLink3D) {
				this.sceneMaker.scene.position.z += 10;
				if (t.sceneMaker.scene.position.z > 20000)
				this.sceneMaker.scene.position.z = -1000;
			} else if (g.linkComunicacao) {
				RenderLlinkComunicacao();
			} else if (g.showDocPlanes) {
			} else if (g.useSiteSystems) {
				RenderMenuSiteSystems();
			}
		}
	}

	onDocumentDblClick(event) {
		super.onDocumentDblClick(event);
		var g = $g.tp3d;
		if (g.useTextPool) {
		} else if (g.useSiteSystems) {
			TestAlfanumericMenu(event);
			TestGeometryMenu(event);
			TestDocumentMenu(event);
			TestEducacionalMenu(event);
			TestFinancialServicesMenu(event);
		} else {
			/*
			TestRedMenu(event);
			TestGreenMenu(event);
			TestBlueMenu(event);
			*/
		}
	}

	onDocumentKeyDown(event) {
		super.onDocumentKeyDown(event);
		var g = $g.tp3d;
		if (g.editText) g.obj3dEditor.processKey(event);
	}

	onDocumentKeyPress(event) {
		var g = $g.tp3d;
		super.onDocumentKeyPress(event);
		if (g.editText) $g.obj3dEditor.processChar(event);
	}
	
	animate() {
		super.animate();
		var sl;
		for (var i in this.spotLights) {
			sl = this.spotLights[i];
			sl.slh.update();
			sl.ch.update();
		}
		return true;
	}
}
