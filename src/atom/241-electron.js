class Electron extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.electronRadius = 3;
		this.flickers = [];
		this.firstFlicker = null;
		this.lastFlicker = null;
		this.flickersNum = 0;
		this.maxFlickers = 1; // 1 rever para mais
		this.initialOpacity = 0.05;
	}

	afterPrepare() {
		super.afterPrepare();
		this.electrons3d = this.orbital.electrons3d;
		this.scenery = this.orbital.scenery;
		this.geometry = new THREE.SphereGeometry(this.electronRadius,50,50,0,twoPI,0,twoPI);
		this.material = this.orbital.electronMaterial;
		this.electron3d = this.add(this.electrons3d,new THREE.Object3D());
	}

	afterCreate() {
		super.afterCreate();
		this.createFlickers();
	}

	duringDestroy() {
		super.duringDestroy();
	   	for (var i = this.flickers.length-1; i >= 0; i--) {
			var c = this.flickers[i];
			c.mesh = this.remove(c,c.mesh);
			//flicker.mesh.material.dispose();
			this.flickers[i] = this.remove(this.electron3d,c);
			this.flickers.pop();
		}
	}

	afterDestroy() {
	   super.afterDestroy();
	   this.electron3d = this.remove(this.electrons3d,this.electron3d);
	}

	createFlickerMaterial() {
		if (this.maxFlickers <= 1) return this.material;
		if (this.flickersNum === 0)
			this.opacity = 1; 
		else if(this.flickersNum === 1)
			this.opacity = this.initialOpacity;
		var material = this.material;
		//var material = new THREE.MeshPhongMaterial({color: this.material.color, transparent: true, opacity: this.opacity, side: THREE.DoubleSide, depthWrite: false});
		this.opacity -= (this.initialOpacity / this.maxFlickers);
		return material;
	}

	createFlicker() {
		var c = this.add(this.electron3d,new THREE.Object3D());
		c.material = this.createFlickerMaterial();
		c.mesh = this.add(c,new THREE.Mesh(this.geometry,c.material));
		this.flickers.push(c);
		c.indiceCintilacao = this.flickers.length;
		this.flickersNum++;
		c.mesh.position.y = this.orbital.radius;
	}

	createFlickers() {
	   while (this.flickers.length < this.maxFlickers) this.createFlicker();
	   this.twinkle();
	   return this.flickers[0];
	}

	twinkle() {
		var len = this.flickers.length;
		for (var i = len-1; i > 0; i--) {
			var from_ = this.flickers[i-1];
			var to_ = this.flickers[i];
			to_.mesh.rotation.copy(from_.mesh.rotation);
			to_.mesh.position.copy(from_.mesh.position);
	   }
	}

	visibility(valor) {
		if (valor) 
			this.electron3d.visible = valor;
		else
			return this.electron3d.visible;
	}
}
