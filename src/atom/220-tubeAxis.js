// https://www.ti-enxame.com/pt/javascript/aplicar-gradiente-de-cor-ao-material-na-malha-three.js/806786571/

let colors = {
	x: {pos: '#FF0000', neg: '#FF0080'},
	y: {pos: '#008000', neg: '#00C000'},
	z: {pos: '#0000FF', neg: '#00B0F0'}
}

class TubeAxes extends RptCommonAncestor{
	constructor(axisLen) {
		super();
		this.axisLen = axisLen;
		this.halflen = this.axisLen/2;
		this.axes = new THREE.Object3D();
		this.buildAxes(axisLen);
	}

	addAxis(x,y,z,color,dashed) {
		let axis = this.buildAxis(x,y,z,color,dashed);
		this.axes.add(axis);
		return axis;
	}

	buildAxes(len) {
		this.xpos = this.addAxis([  0.5 ,    0 ,    0 ] , [    0,  0 , -0.5 ],colors.x.pos,false); // +X
		this.xneg = this.addAxis([ -0.5 ,    0 ,    0 ] , [    0,  0 ,  0.5 ],colors.x.neg,false); // -X
		this.ypos = this.addAxis([    0 ,  0.5 ,    0 ] , [    0,  0 ,    0 ],colors.y.pos,false); // +Y
		this.yneg = this.addAxis([    0 , -0.5 ,    0 ] , [    1,  0 ,    0 ],colors.y.neg,false); // -Y
		this.zpos = this.addAxis([    0 ,    0 ,  0.5 ] , [  0.5,  0 ,    0 ],colors.z.pos,false); // +Z
		this.zneg = this.addAxis([    0 ,    0 , -0.5 ] , [ -0.5,  0 ,    0 ],colors.z.neg,false); // -Z
	}
	
	removeAxes() {
		scene.remove(this.xpos);
		scene.remove(this.xneg);
		scene.remove(this.ypos);
		scene.remove(this.yneg);
		scene.remove(this.zpos);
		scene.remove(this.xpos);
		scene.remove(this.zneg);	
		scene.remove(this.axes);
	}

	buildAxis(pos,rot,colorHex,dashed ) {
		let axis;
		if (false) {
			let v1 = new THREE.Vector3(0,0,0);
			let v2 = new THREE.Vector3(x,y,z);
			let geom = new THREE.Geometry();
			let mat = dashed ?
				new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3}) :
				new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
			geom.vertices.push(v1.clone());
			geom.vertices.push(v2.clone());
			axis = new THREE.Line( geom, mat, THREE.LinePieces );
			axis.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
		} else {
			let geomTubo = new THREE.CylinderGeometry(2,2,this.axisLen,16,16,false,0,2*Math.PI);
			let geomPonta = new THREE.CylinderGeometry(0,6,20,16,16,false,0,2*Math.PI);
			let matTubo = new THREE.MeshBasicMaterial({color: colorHex});
			let matPonta = new THREE.MeshBasicMaterial({color: '#000000'});
			let meshTubo = new THREE.Mesh(geomTubo,matTubo);
			let meshPonta = new THREE.Mesh(geomPonta,matPonta);
			meshPonta.position.y = this.halflen;
			axis = new THREE.Object3D;
			axis.add(meshTubo);
			axis.add(meshPonta);
			let p = (this.axisLen/5)
			axis.position.set(pos[0]*(this.axisLen+p),pos[1]*(this.axisLen+p),pos[2]*(this.axisLen+p));
			axis.rotation.set(rot[0]*Math.PI ,rot[1]*Math.PI ,rot[2]*Math.PI);
		}
		return axis;
	}
}
