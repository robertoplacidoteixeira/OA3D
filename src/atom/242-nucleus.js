class Nucleo extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.radius = 2;
		this.firstProton = undefined;
		this.firstNeutron = undefined;
	}
	
	afterPrepare() {
		this.scenery = this.atom.scenery;
		this.protonsNeutronsNum = this.atom.Z;
		this.geometry = $g.factory.geo.sphere(this.radius,50,50);
		this.materialProton = this.scenery.materialProton;
		this.materialNeutron = this.scenery.materialNeutron;
	}

	duringCreate() {
		super.duringCreate();
		var distanceVariation = this.radius * 2;
		this.protonsNeutronsNum = this.protonsNeutronsNum;
		this.nucleus3d = new THREE.Object3D();
		var anglesCounter = 0;
		var anglesNum = 2;
		var distance = 0;
		if (this.protonsNeutronsNum < 3)
			distance = this.radius;
		else {
			anglesNum = 4;
			distance = distanceVariation;
		}
		var anguloSegmento = 2 * Math.PI / anglesNum;
		var protonAngle = 0;
		var neutronAngle = anguloSegmento / 2;
		this.protonsNeutrons = [];
		for (var i = 0; i < this.protonsNeutronsNum; i++) {
			if (anglesCounter === anglesNum) {
				distance = distance + distanceVariation;
				anglesNum = anglesNum * 2;
				anguloSegmento = 2 * Math.PI / anglesNum;
				protonAngle = neutronAngle + (anguloSegmento/2);
				neutronAngle = protonAngle + (anguloSegmento/2);
				anglesCounter = 0;
			}
			anglesCounter++;
			this.proton = this.add(this.nucleus3d,this.createProton(distance,protonAngle));
			protonAngle = protonAngle + anguloSegmento;
			this.neutron = undefined;
			if (this.protonsNeutronsNum > 1) {
				this.neutron = this.add(this.nucleus3d,this.createNeutron(distance,neutronAngle));
				neutronAngle = neutronAngle + anguloSegmento;
			}
			this.protonsNeutrons.push({proton: this.proton, neutron: this.neutron});
		}
		this.add(this.atom.atom3d,this.nucleus3d);
	}

	duringDestroy() {
		super.duringDestroy();
		// liberar protons e neutrons
		var len = this.protonsNeutrons.length-1;
		for (var i = len; i >= 0; i--) {
			this.protonsNeutrons[i].proton = this.remove(this.nucleus3d,this.protonsNeutrons[i].proton);
			if (this.protonsNeutrons[i].neutron) 
				this.protonsNeutrons[i].neutron = this.remove(this.nucleus3d,this.protonsNeutrons[i].neutron);
			this.protonsNeutrons.pop();
		}
		this.nucleus3d = this.remove(atom.atom3d,this.nucleus3d);
	}

	createProtonNeutron(distance_,angle_,material_) {
		var mesh = new THREE.Mesh(this.geometry,material_);
		mesh.position.x = distance_ * Math.cos(angle_);
		mesh.position.y = distance_ * Math.sin(angle_);
		return mesh;
	}

	createProton(distance,angle) {
		if ($g.clonefy && this.firstProton) return firstProton.clone();
		return this.firstProton = this.createProtonNeutron(distance,angle,this.materialProton);
	}
	
	createNeutron(distance,angle) {
		if ($g.clonefy && this.firstNeutron) return firstNeutron.clone();
		return this.firstNeutron = this.createProtonNeutron(distance,angle,this.materialNeutron);
	}
	
	visibility(valor) {
		if (valor === undefined)
			valor = this.atom3d.visible;
		else
			this.nucleus3d.visible = valor;
		return valor;
	}
}
