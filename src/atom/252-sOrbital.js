class OrbitalS extends Orbital {

	createCloud() {
		super.createCloud();
		if ($g.useFat) {
			if (this.orbitalElectronNum === 2) {
				this.geometry1 = $g.factory.geo.sphere(this.radius,64,64,0,Math.PI*2,0,Math.PI/2);
				this.geometry2 = $g.factory.geo.sphere(this.radius,64,64,0,Math.PI*2,Math.PI,Math.PI/2);
				this.mesh1 = this.scenery.createOrbitalMesh(this.geometry1,this.material[0][0]);
				this.mesh2 = this.scenery.createOrbitalMesh(this.geometry2,this.material[1][0]);
				this.mesh = new THREE.Object3D();
				this.mesh.add(this.mesh1);
				this.mesh.add(this.mesh2);
			} else {
				this.geometry = $g.factory.geo.sphere(this.radius,64,64,0,2*Math.PI,0,2*Math.PI);
				this.mesh = this.scenery.createOrbitalMesh(this.geometry,this.material[0][0]);
			}
		} else {
			this.geometry = $g.factory.geo.circle(this.radius);
			this.mesh = this.scenery.createOrbitalMesh(this.geometry,this.material[0]);
		}
		this.adicionarNaNuvem(this.mesh);
		//this.vertices = this.geometry.vertices;
		//this.numVertices = this.geometry.vertices.length;
		this.xRotCounter = 1 + Math.random(); // Math.random() * twoPI;
		this.yRotCounter = 1 + Math.random(); // Math.random() * twoPI;
		this.zRotCounter = 1 + Math.random(); // Math.random() * twoPI;
		this.signal = 1;
	}

	duringDestroyCloud() {
	   super.duringDestroyCloud();
	   this.mesh = this.remove(this.orbital3d,this.mesh);
	}

	createElectrons() {
		super.createElectrons();
		if (this.orbitalElectronNum === 2) {
			var electron = this.criarEletron();
			electron.flickers[0].mesh.position.y = -electron.flickers[0].mesh.position.y;
		}
	}

	moveElectrons(RandomMove) {
		var metodo = 3;
		super.moveElectrons(RandomMove);
		var signal = -1;
		//var inversor = 0;
		for (var i = 0; i < this.electrons.length; i++) {
			signal = signal; // -signal;
			var electron = this.electrons[i];
			var c = electron.flickers[0];
			if (RandomMove) {
				c.rotation.x = Math.random() * twoPI;
				c.rotation.y = Math.random() * twoPI;
				c.rotation.z = Math.random() * twoPI;
			} else {
				this.xRotCounter += 0.05;
				if (this.xRotCounter > 1) {
					this.xRotCounter -= 1.0;
					this.zRotCounter += 0.05;
					if (this.zRotCounter > 1) {
						this.zRotCounter -= 1.0;
						this.yRotCounter += 0.05;
						if (this.yRotCounter > 1) {
							this.yRotCounter -= 1.0;
						}
						if (i === 1)
							c.rotation.y = (this.yRotCounter) * twoPI * signal;
						else
							c.rotation.x = (this.zRotCounter) * twoPI * signal;
					}
					if (i === 1)
						c.rotation.z = (this.zRotCounter) * twoPI * signal;
					else
						c.rotation.y = (this.zRotCounter) * twoPI * signal;
				}
				if (i === 1)
					c.rotation.x = (this.xRotCounter) * twoPI * signal;
				else
					c.rotation.z = (this.xRotCounter) * twoPI * signal;
				//inversor++;
			}
		}
	}
}
