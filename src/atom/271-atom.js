class Atom extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.loadedOrbitalPeriodAnt = -1;
		this.loadedOrbitalLevelAnt = -1;
		this.loadedOrbitalSublevelAnt = -1;
		this.periods = [];
	}

	afterPrepare()  {
		super.afterPrepare();
		this.indexZ = this.Z-1;
		this.elemCars = $g.metadata.calcAtomicRadius_car[this.indexZ][2];
	}

	duringCreate() {
		super.duringCreate();
		this.forceStopLoading = false;
		this.atom3d = this.add(this.scene,new THREE.Object3D());
		this.Orbitals = [OrbitalS,OrbitalP,OrbitalD,OrbitalF];
		this.nucleus = new Nucleo({atom: this, radius: 2});
		this.posX = 0;
		this.orbitals = [];
		this.lastOrbital = $g.metadata.elems[this.indexZ].orb;
		this.lastOrbitalPeriod = this.lastOrbital[0];
		this.lastOrbitalLevel = this.lastOrbital[1];
		this.lastOrbitalSublevel = this.lastOrbital[2];
		this.lastOrbitalElectronsNum = this.lastOrbital[3];
		this.lastOrbitalRadius = this.lastOrbital[4];
		this.actualCompressedRadius = this.lastOrbital[5];
		//
		this.nextElemNum = 0;
		//
		if (this.useAxis) {
			this.axesHelper = new TubeAxes(this.lastOrbitalRadius*1.1).axes;
			//this.axesHelper = new THREE.AxesHelper(660);
			this.atom3d.add(this.axesHelper);
			this.gridHelper = new THREE.Object3D();
			let w = this.lastOrbitalRadius *2;
			this.gridHelperX = new THREE.GridHelper(w,12,0x44FF44,0x88FF88);
			this.gridHelperY = new THREE.GridHelper(w,12,0xFF4444,0xFF8888);
			this.gridHelperZ = new THREE.GridHelper(w,12,0x4444FF,0x8888FF);
			this.gridHelper.add(this.gridHelperX);
			this.gridHelper.add(this.gridHelperY);
			this.gridHelper.add(this.gridHelperZ);
			this.atom3d.add(this.gridHelper);
			this.gridHelperX.rotation.x = (Math.PI / 2);
			this.gridHelperZ.rotation.z = (Math.PI / 2);
		}
		//
		this.orbitalsLoaded = false;
		this.continueLoading = true;
		//
		this.verifyLoadStatus();
	}

	duringDestroy() {
		super.duringDestroy();
		this.forceStopLoading = true;
		for (var i = this.orbitals.length-1; i >=0; i--) {
			this.orbitals[i].destroy();
			this.orbitals.pop();
		}
		this.atom3d = this.remove(this.scene,this.atom3d);
	}

	loadOrbitals() {
		while (this.continueLoading) this.verifyLoadOrbital();
	}

	verifyLoadStatus(){
		this.lastOrbital = (this.nextElemNum === this.indexZ);
		this.continueLoading = (!this.forceStopLoading && (this.nextElemNum < this.Z));
		this.orbitalsLoaded = !this.continueLoading;
	}

	verifyLoadOrbital() {
		if (this.orbitalsLoaded) return false;
		this.momentNow = new Date().getTime();
		if (this.momentNow < this.nextMoment) return false;
		var created = this.verifyCreateOrbital();
		if ((created) && (this.lastOrbital) && (this.lastOrbitalSublevel !== s))
			this.add(this.atom3d,this.scenery.createRadiusSphereMesh(this.lastOrbitalRadius));
		return created;
	}

	verifyCreateOrbital() {
		var auxTempo = (this.load) ? 0 : this.waitTime;
		this.loadedOrbital = $g.metadata.elems[this.nextElemNum].orb;
		this.loadedOrbitalPeriod = this.loadedOrbital[0];
		this.loadedOrbitalLevel = this.loadedOrbital[1];
		this.loadedOrbitalSublevel = this.loadedOrbital[2];
		this.loadedOrbitalElectronNum = this.loadedOrbital[3];
		this.loadedOrbitalRadius = this.loadedOrbital[4];
		//this.raioComprimido = this.loadedOrbital[4]; 
		var createOrbital = ( ( 
			(this.loadedOrbitalSublevel === s) && ( ( (this.loadedOrbitalElectronNum === 1) && 
				(this.lastOrbital) ) || (this.loadedOrbitalElectronNum === 2) ) ) || 
			(this.loadedOrbitalSublevel === p) || 
			(this.loadedOrbitalSublevel === d) || 
			(this.loadedOrbitalSublevel === f) );
		if (createOrbital) {
			this.nextMoment = this.momentNow + auxTempo;
			this.wait = true;
			this.createOrbital();
			//this.criarEletronOrbital();
			this.wait = false;
		}
		this.nextElemNum++;
		this.verifyLoadStatus();
		return createOrbital;
	}

	createOrbital() {
		this.radius = (
			(this.loadedOrbitalPeriod === this.lastOrbitalPeriod) && 
			(this.loadedOrbitalLevel === this.lastOrbitalLevel) &&
			(this.loadedOrbitalSublevel === this.lastOrbitalSublevel)) ? 
				this.lastOrbitalRadius : 
				this.CarsRadius();
		if (this.espichar === "1") {
			this.posX = (this.loadedOrbitalSublevel === s) ? this.posX + (this.loadedOrbitalRadius*2) + 10 :  this.posX + (this.loadedOrbitalRadius*2) + 10;
			this.orbital.position.x = this.posX;
		}
		this.newPeriod = (this.loadedOrbitalPeriod !== this.loadedOrbitalPeriodAnt);
		if (this.newPeriod)	{
			this.loadedOrbitalLevelAnt = -1;
			this.period = {num: this.loadedOrbitalPeriod, levels: []};
			this.levels = this.period.levels;
			this.periods.push(this.period);
		}
		this.newLevel = (this.loadedOrbitalLevel !== this.loadedOrbitalLevelAnt);
		if (this.newLevel)	{
			this.loadedOrbitalSublevelAnt = -1;
			this.level = {num: this.loadedOrbitalLevel, sublevels: []};
			this.sublevels = this.level.sublevels;
			this.levels.push(this.level);
		}
		this.newSublevel = (this.loadedOrbitalSublevel !== this.loadedOrbitalSublevelAnt);
		if (this.newSublevel) {
			this.sublevel = {num: this.loadedOrbitalSublevel, orbitals:[]};
			this.sublevels.push(this.sublevel);
		}
		this.orbitalSublevelNum = (this.sublevel === s) ?  
			this.loadedOrbitalElectronNum : 
			this.sublevel.orbitals.length + 1;
		this.newOrbital();
		this.sublevel.orbitals.push(this.orbital);
		this.loadedOrbitalPeriodAnt = this.loadedOrbitalPeriod;	
		this.loadedOrbitalLevelAnt = this.loadedOrbitalLevel;	
		this.loadedOrbitalSublevelAnt = this.loadedOrbitalSublevel;
		this.orbitals.push(this.orbital);
	}

	newOrbital() {
		var n = this.loadedOrbitalLevel;
		var sn = this.loadedOrbitalSublevel;
		var material = this.lastOrbital && false ? [this.scenery.materials[sn][0],this.scenery.orbitalRadiusMaterial[0][0]] : this.scenery.materials[sn];
		var electronMaterial = this.scenery.materiaisEletron[sn];
		var Orbital = this.Orbitals[sn];
		this.orbital = new Orbital({
			atom: this,
			level: n,
			sublevel: sn,
			OrbitalSublevelNum: this.OrbitalSublevelNum,
			radius: this.radius,
			scenery: this.scenery,
			scene: this.scene,
			material: material,
			electronMaterial: electronMaterial,
			orbitalElectronNum: this.loadedOrbitalElectronNum});
	}

	moveElectrons() {
		if (this.movimentElectrons) {
			var n = this.orbitals.length;
			for (var i = 0; i < n; i++) this.orbitals[i].moveElectrons(this.RandomMove);
		}
	}

	CarsRadius() {
		var i = $g.metadata.header_car.findIndex(h => ((this.loadedOrbitalLevel === h[0]) && (this.loadedOrbitalSublevel === h[1])));
		return (i === -1) ? null : this.elemCars[i];
	}
	
	visibility(valor) {
		if (valor === undefined) 
			valor = this.atom3d.visible;
		else
			this.atom3d.visible = valor;
		return valor;
	}
}
