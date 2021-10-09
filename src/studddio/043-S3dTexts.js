class S3dTexts extends S3dObject3D {

	constructor(scene, data, showPlane) {
		this.scene = scene;
		this.showPlane = showPlane;
		super(data);
	}

	beforePrepare() {
		super.beforePrepare();
		this.plane = null;
		this.cube = null;
		this.width = 0;
		this.height = 0;
		this.depth = 0;
		this.maxX = null;
		this.maxY = null;
		this.minX = null;
		this.minY = null;
		this.textArray = [];
	}

	afterPrepare() {
		super.afterPrepare();
		this.showPlane = this.showPlane;
		this.showCube = this.showPlane;
		this.scene.add(this.obj3d);
	}
	
	createTextPoolPlane(width, height, depth) {
		this.plane = null;
		if (this.showPlane) {
			this.plane = new THREE.Mesh(
				new THREE.PlaneBufferGeometry(width, height),
				new THREE.MeshBasicMaterial({color: 0x0000ff, opacity: 0.5, transparent: true})
			);
			var p = this.plane.position;
			// this.plane.rotation.x = -Math.PI / 2;
			p.x = width / 2;
			p.y = -height / 2;
			p.z = -depth / 2;
			p.z += p.z / 10; // +10%
			this.plane.visible = false;
			this.add(this.plane);
		}
	}

	createTextPoolCube(width, faces) {
	   if (this.showCube) {
		  this.tjlCube = new S3dBox({width: width, faces: faces});
		  this.cube = this.tjlCube.cube;
		  // this.cube.position.x = width / 2;
		  // this.cube.position.y = -height / 2;
		  this.cube.position.z = -600;
		  //this.cube.position.z += this.cube.position.z / 10; // +10%
		  this.cube.visible = false;
		  this.add(this.cube);
	   }
	}

	addTextToChain(x, y, z, str, size, height, material, hover, mirror) {
		var data = $g.factory.data.s3d.textData(this, str, size, height, new S3dPos(x, y, z), material, hover, mirror);
		var t = new S3dText(data);
		this.addText(t);
		this.calcDim();
		return t;
	}

	addText(str_) {
	   this.textArray.push(str_);
	   if (!str_.textChain) str_.textChain = this;
	   var bb = str_.textGeo.boundingBox;
	   if ((!this.minX) || (bb.min.x < this.minX)) this.minX = bb.min.x;
	   if ((!this.minY) || (bb.min.x < this.minY)) this.minY = bb.min.y;
	   if ((!this.minZ) || (bb.min.x < this.minZ)) this.minZ = bb.min.z;
	   if ((!this.maxX) || (bb.max.x < this.maxX)) this.maxX = bb.max.x;
	   if ((!this.maxY) || (bb.max.y < this.maxY)) this.maxY = bb.max.y;
	   if ((!this.maxZ) || (bb.max.z < this.maxZ)) this.maxZ = bb.max.z;
	   this.calcDim();
	}

	calcDim() {
	   this.width = this.maxX - this.minX;
	   this.height = this.maxY - this.minY;
	   this.depth = this.maxZ - this.minZ;
	}
	/*
	refreshText() {
	   for (var i = 0; i < this.textArray.length; i++) {
		  this.textArray[i].refreshText();
	   }
	}
	*/
}