class S3dPlaneChain extends S3dObject3D {
	
	afterPrepare() {
		super.afterPrepare();
		this.planeArray = [];
	}

	addPlane(plane) {
	   this.planeArray.push(plane);
	   /*
	   if (!plane.planePool) {
		  plane.planePool = this;
	   }
	   */
	  /*
	   var bb = plane.obj3d.boundingBox;
	   if ((!this.minX) || (bb.min.x < this.minX))
		  this.minX = bb.min.x;
	   if ((!this.minY) || (bb.min.x < this.minY))
		  this.minY = bb.min.y;
	   if ((!this.minZ) || (bb.min.x < this.minZ))
		  this.minZ = bb.min.z;
	   if ((!this.maxX) || (bb.max.x < this.maxX))
		  this.maxX = bb.max.x;
	   if ((!this.maxY) || (bb.max.y < this.maxY))
		  this.maxY = bb.max.y;
	   if ((!this.maxZ) || (bb.max.z < this.maxZ))
		  this.maxZ = bb.max.z;
	   this.calcDim();
	   */
	}

	calcDim() {
	   /*
	   this.width = this.maxX - this.minX + 1;
	   this.height = this.maxY - this.minY + 1;
	   this.depth = this.maxZ - this.minZ + 1;
	   */
	}

	refreshPlane() {
	   for (var i = 0; i < this.planeArray.length; i++) {
		  this.planeArray[i].refreshPlane();
	   }
	}

	addPlaneToChain(x_, y_, z_, height, size, hover_, texture_, mirror_) {
		var data = $g.factory.data.geo.planeData(
			this,this.obj3d,700,700,1,1,null,
			{color: 0xfefefe, opacity: 0.9, transparent: true},
			{x: x_, y: y_, z: z_},
			{x: 0, y: Math.PI/2, z: 0},
			texture, hover, mirror);
	   var plane = new S3dPlane(data);
	   this.addPlane(plane);
	   this.calcDim();
	   return plane;
	}
}
