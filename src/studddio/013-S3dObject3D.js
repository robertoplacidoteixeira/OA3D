class S3dObject3D extends RptCommonAncestor {
	
	beforePrepare() {
		super.beforePrepare();
		this.owner = null;
		this.scene = null;
		this.obj3d = null;
		this.moving = false;
		this.onCreate = null;
		this.sca = null;
		this.tra = null;
	}

	afterPrepare() {
		super.afterPrepare();
		this.setData();
		$g.stock.obj3d.push(this);
		/*
		this.dim = null;
		this.dim3 = null;
		this.pos = null;
		this.rot = null;
		this.material = null;
		this.nextTime = null;
		this.cursorParam = null;
		this.exec = null;
		this.execTime = null;
		*/
		this.prepareMaterial();
	}
	
	getOwnerProperties() {
		this.getPropertyUsingOwner("actions");
		this.getPropertyUsingOwner("scene");
		this.getPropertyUsingOwner("sceneMaker");
		this.getPropertyUsingOwner("materialParam");
		this.getPropertyUsingOwner("cursorParam");
		this.getPropertyUsingOwner("material");
		/*this.getPropertyUsingOwner("geometry");*/
	}

	duringCreate() {
		super.duringCreate();
		this.createObj3d();
		this.addObj3dToScene();
	}

	afterCreate() {
		super.afterCreate();
		this.getLimits();
		this.afterAdd();
		if (this.onCreate) this.onCreate();
	}
		
	getLimits() {
		/*this.geometry.computeVertexNormals();*/
		this.box = this.getBox();
		this.max = this.box.max;
		this.min = this.box.min;
	}

	getBox() {
	   return (this.obj3d) ? new THREE.Box3().setFromObject(this.obj3d) : null;
	}
	
	setData() {
		this.getOwnerProperties();
		if (this.exec) {
			var nowMs = Date.now();
			if (!this.execTime) this.execTime = 1000;
			this.nextTime = nowMs + this.execTime;
		}
		/* REVER
		if (this.data.setTimeout) launchTimeout();
		*/
	}
	
	prepareMaterial() {
	}

	createObj3d() {
		this.obj3d = new THREE.Object3D();
	}

	addObj3dToScene() {
	   if (this.scene && this.obj3d) this.scene.add(this.obj3d);
	}

	afterAdd() {
	   this.scaleTo(this.sca);
	   this.positionTo(this.pos);
	   this.rotationTo(this.rot);
	   this.translateTo(this.tra);
	}

	getValue(param, defaultValue) {
		return (param) ? param : (defaultValue) ? defaultValue : null;
	}

	getPropertyUsingOwner(propetyName) {
		if (!this[propetyName]) {
			if (this.owner && this.owner[propetyName]) {
				this[propetyName] = this.owner[propetyName];
			}
		}
	}

	commonTo(from_, to_) {
	   if (from_) {
		  if (from_.x) to_.x = from_.x;
		  if (from_.y) to_.y = from_.y;
		  if (from_.z) to_.z = from_.z;
	   }
	}

	commonOn(from_, to_) {
	   if (from_) {
		  if (from_.x) to_.x += from_.x;
		  if (from_.y) to_.y += from_.y;
		  if (from_.z) to_.z += from_.z;
	   }
	}

	scaleTo(sca) {
	   if (this.obj3d)
		  this.commonTo(sca, this.obj3d.scale);
	}

	scaleOn(sca) {
	   if (this.obj3d) this.commonOn(sca, this.obj3d.scale);
	}

	positionTo(pos) {
	   if (this.obj3d) this.commonTo(pos, this.obj3d.position);
	}

	positionOn(pos) {
	   if (this.obj3d) this.commonOn(pos, this.obj3d.position);
	}

	rotationTo(rot) {
	   if (this.obj3d) this.commonTo(rot, this.obj3d.rotation);
	}
	
	rotationOn(rot) {
	   if (this.obj3d) this.commonOn(rot, this.obj3d.rotation);
	}

	translateTo(tra) {
		if (this.obj3d) this.commonTo(tra, this.obj3d.translate);
	}

	translateOn(tra) {
		if (this.obj3d) this.commonOn(tra, this.obj3d.translate);
	}

	intercepted(x, y, camera, projector) {
		
		return false;

		/*
		var raycaster = new THREE.Raycaster(); // create once
		var mouse = new THREE.Vector2(); // create once

		...

		mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( objects, recursiveFlag );
		*/

		var _intercepted = null;

		var _vector = new THREE.Vector3(
			(x / window.innerWidth) * 2 - 1,
			-(y / window.innerHeight) * 2 + 1,
			0.5);

		projector.unprojectVector(_vector, camera);

		var _sub = _vector.sub(camera.position);

		var _raycaster = new THREE.Raycaster(
			camera.position, _sub.normalize());

		var _intersects = _raycaster.intersectObjects(this.obj3d.children, true);

		if (_intersects.length > 0) {
			_intercepted = _intersects[0];
		}
		
		return _intercepted;
	}

	/*----------------------------------------------------------------------------*/

	startMove(x, y, z) {
		this.moving = true;
		this.moveDeltaX = x;
		this.moveDeltaY = y;
		this.moveDeltaZ = z;
		this.moveTargetX = this.position.x + this.moveDeltaX;
		this.moveTargetY = this.position.y + this.moveDeltaY;
		this.moveTargetZ = this.position.z + this.moveDeltaZ;
	}

	/*----------------------------------------------------------------------------*/

	moveAction(x, y, z) {
		if (this.moving) {
			t = this;
			function move(coord) {
				var p = t.obj3d.position[coord];
				var u = coord.toUpperCase();
				var m = p > t["moveTarget"+u];
				if (m) p += t["moveDelta"+u];
				return m;
			}
			var moveX = move("x");
			var moveY = move("y");
			var moveZ = move("z");
			this.moving = (moveX || moveY || moveZ);
		}
	}

	above() {
	   this.obj3d.position.y = (this.max.y - this.min.y);
	}
	
	below() {
		-above();
	}
	
	left() {
	   this.obj3d.position.x = (this.max.x - this.min.x);
	}
	
	right() {
		-left();
	}
	
	front() {
	   this.obj3d.position.z = (this.max.z - this.min.z);
	}
	
	behind() {
		-front();
	}
	
	centerCoord(coord) {
	   this.obj3d.position[coord] = -0.5 * (this.max[coord] - this.min[coord]);
	}
	

	centerX() {
		this.centerCoord("x");
	}

	centerY() {
		this.centerCoord("y");
	}

	centerZ() {
		this.centerCoord("z");
	}

	center() {
		//if (!this.objBox) this.objBox = this.getCompoundBoundingBox();
		this.centerX();
		this.centerY();
		this.centerZ();
		return this;
	}
}