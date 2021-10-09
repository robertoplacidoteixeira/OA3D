class LobeOrbital extends Orbital {

	beforePrepare() {
		super.beforePrepare();
		this.fractionsNum          = 10;
		this.coneFractionsNum      =  8;
		this.sphereFractionsNum    =  2;
		this.variacaoRotacaoLobulo =  0;
		this.variacaoAlturaLobulo  =  0;
		this.signal                 =  1;
	}

	get isConicLobe() {
		return false;
	}

	afterPrepare() {
		super.afterPrepare();
		this.coneTopRadius = this.radius / this.fractionsNum * this.sphereFractionsNum;
		this.halfRadius        = this.radius / 2;
		let aux;
		if (this.isConicLobe) {
			this.coneLength = this.radius;
			aux = 0;
		} else {
			this.coneLength = this.radius / this.fractionsNum * this.coneFractionsNum;
			this.lobeSphereHeight = this.coneLength;
			this.LobeSphereRadius = this.coneTopRadius;
			aux = this.LobeSphereRadius;
		}
		this.coneHalfHeight    = this.coneLength / 2;
		this.coneBottomRadius  = this.createOrbitalNode ? this.coneTopRadius * 0.8 : 0;
		this.ConeVisibleLength = this.createOrbitalNode ? this.coneLength  * 0.2 : this.coneLength;
		this.coneStartHeight   = this.createOrbitalNode ? this.coneLength  * 0.8 : 0;
		this.lobeVisibleLength = this.ConeVisibleLength + aux;
	}
	
	duringCreate() {
		super.duringCreate();
	}

    afterCreate() {
		super.afterCreate();
		this.electron = this.electrons[0];
		this.electron3d = this.electron.electron3d;
		this.flicker = this.electron.flickers[0];
	}

	prepararEixo() {
		this.createAxesAndDirections();
		var aux = this.axesAndDirections[this.orbitalElectronNum-1];
		this.axis = aux[0];
		this.direction = aux[1];
		this.orbitalMaterial = this.direction === 1 ? this.material[0] : this.material[1];
	}

	createAxesAndDirections() {
	}

	createSphereLobeMesh() {
		this.sphereGeometry = $g.factory.geo.sphere(
			this.LobeSphereRadius,32,32,0,2*Math.PI,0,Math.PI/2);
		return this.scenery.createOrbitalMesh(this.sphereGeometry,this.orbitalMaterial[0]);
	}

	createConeLobeMesh() {
		this.coneGeometry = $g.factory.geo.cylinder(
			this.coneTopRadius,this.coneBottomRadius,this.ConeVisibleLength,32,32,false,0,2*Math.PI);
		return this.scenery.createOrbitalMesh(this.coneGeometry,this.orbitalMaterial[0]);
	}

	createTorusMesh() {
		var internalRadius = this.radius / 20;
		var externalRadius = internalRadius * 2;
		var mesh = this.scenery.createOrbitalMesh(
			$g.factory.geo.torus(externalRadius,internalRadius),
			this.orbitalMaterial[0]);
		mesh.position.y = this.cone.position.y - internalRadius ;
		mesh.rotation.x = halfPI;
		return mesh;
	}


	createIcecreamLobe(criarTorus) {
		this.lobulo = new THREE.Object3D();
		this.cone = this.createConeLobeMesh();
		this.lobulo.cone = this.add(this.lobulo,this.cone);
		this.esfera = this.createSphereLobeMesh();
		this.lobulo.esfera = this.add(this.lobulo,this.esfera);
		var yc = this.halfRadius - (this.LobeSphereRadius / 2);
		if (this.createOrbitalNode) {
			this.cone.position.y = yc + (this.coneHalfHeight * 0.8);
		} else {
			this.lobulo.cone.position.y = yc;
		}
		this.lobulo.esfera.position.y = yc + this.coneHalfHeight;
		if (criarTorus) {
			this.torus = this.createTorusMesh();
			this.lobulo.torus = this.add(this.lobulo,this.torus)
		}
		return this.lobulo;
	}

	createConicLobe(criarTorus) {
		this.lobulo = new THREE.Object3D();
		this.cone = this.createConeLobeMesh();
		this.lobulo.cone = this.add(this.lobulo,this.cone);
		var yc = this.halfRadius - (this.coneTopRadius / 2);
		if (this.createOrbitalNode) {
			this.cone.position.y = yc + (this.coneHalfHeight * 0.8);
		} else {
			this.lobulo.cone.position.y = yc;
		}
		if (criarTorus) {
			this.torus = this.createTorusMesh();
			this.lobulo.torus = this.add(this.lobulo,this.torus)
		}
		return this.lobulo;
	}

	createLobe(criarTorus) {
		return this.isConicLobe ? this.createConicLobe(criarTorus) : this.createIcecreamLobe(criarTorus);
	}

	createLobes(angulos,torus) {
		var len = angulos.length;
		for (var i = 0; i < len; i++) {
			var lobulo = this.createLobe(torus);
			lobulo.rotation.z = angulos[i];
			this.adicionarNaNuvem(lobulo);
		}
	}

	createCloud() {
	   super.createCloud();
	}

	duringDestroyCloud() {
		super.duringDestroyCloud();
		var len = this.nuvem.length-1;
		for (var i = len; i >= 0; i--) {
			var lobulo = this.nuvem[i];
			lobulo.cone = this.remove(lobulo,lobulo.cone);
			lobulo.esfera = this.remove(lobulo,lobulo.esfera);
			if (lobulo.torus) lobulo.torus = this.remove(lobulo,lobulo.torus);
			this.nuvem[i] = this.remove(this.nuvem3d,lobulo);
			this.nuvem.pop();
		}
	}

	rotacionar() {
	   super.rotacionar();
	   this.orbital3d.rotation.set(0,0,0);
	}

	moveElectrons(RandomMove) {
		// if (this.nuvem.length < 3) return;
		super.moveElectrons();
		var parte = this.nuvem[this.proximo];
		this.electron3d.rotation.copy(parte.rotation)
		var c = this.flicker;
		if (RandomMove) {
			c.mesh.position.y = this.coneStartHeight + (Math.random() * this.lobeVisibleLength);
			c.rotation.y = Math.random() * twoPI;
		} else {
			if (this.signal > 0)  {
				this.variacaoAlturaLobulo += 0.3;
				if (this.variacaoAlturaLobulo >= 1.0) this.signal = -1;
			} else {
				this.variacaoAlturaLobulo -= 0.3;
				if (this.variacaoAlturaLobulo <= 0.0) {
					this.signal = 1;
				}
			}
			c.mesh.position.y =  this.coneStartHeight + (this.variacaoAlturaLobulo * this.lobeVisibleLength);
		}
		if (c.mesh.position.y <= this.coneLength)
			c.mesh.position.x = this.signal * c.mesh.position.y * this.LobeSphereRadius / this.coneLength;
		else {
			var m = c.mesh.position.y - this.coneLength;
			var n = m / this.LobeSphereRadius;
			var o = Math.asin(n);
			var p = Math.cos(o);
			c.mesh.position.x = this.signal * p * this.LobeSphereRadius;
		}
		this.variacaoRotacaoLobulo += 0.02;
		if (this.variacaoRotacaoLobulo >= 1.0) {
			this.variacaoRotacaoLobulo -= 1.0;
			if (++this.proximo === this.nuvem.length) this.proximo = 0;
		}
		c.rotation.y = this.variacaoRotacaoLobulo * twoPI;
	}

	get createOrbitalNode() {
		return (this.level !== this.firstLevel);
	}
}
