class S3dAct extends S3dObject3D {
	
	afterPrepare() {
		super.afterPrepare();
		this.cameraGroup = this.sceneMaker.cameraGroup;
	}
	
	afterCreate() {
		super.afterCreate();
		this.createActions()
		this.loadAct();
	}
	
	createActions() {
		this.actions = new S3dActions();
	}

	loadAct() {}

	createTextsFrame(data_, textArray_, callback_, move_) {
		var f = new S3dActFrame({
			owner: data_.owner,
			scene: data_.scene,
			pos: data_.origin
		});
		if ((move_) && (data_))	this.singleMove(this.cameraGroup,data_,callback_);
		/*
		var pl = new THREE.PointLight( 0xffffff, 1.5 );
		pl.position.set(0,0,20);
		f.obj3d.add(pl);
		*/
		var rc = new S3dRichTexts($g.factory.data.s3d.richChainData(f, f.obj3d, textArray_));
		rc.centerX();
		rc.centerZ();
		rc.above();
		return f;
	}

	createMultiTextPlaneFrame(data_, textArray_, callback_) {
		var f = this.createTextsFrame(data_, textArray_, callback_);
		var plane = $g.factory.mesh.planeMesh(
			$g.factory.data.geo.planeData(f,f.obj3d,2000,2000,8,8), // (textArray_.length+3)*100
			new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.1, transparent: true}));
		// plane.position.y = 100;
		plane.position.z = 800;
		plane.rotation.x = -Math.PI/2;
		f.obj3d.add(plane);
		var clone = rc.obj3d.clone();
		clone.position.y *= -1;
		clone.rotation.x = Math.PI;
		f.obj3d.add(clone);
		return f;
	}
	
	createMultiTextMirrorPlaneFrame(data_, textArray_, callback_) {
		var f = this.createMultiTextPlaneFrame(data_, textArray_, callback_);
		var clone = rc.obj3d.clone();
		clone.position.y *= -1;
		clone.rotation.x = Math.PI;
		f.obj3d.add(clone);
		return f;
	}

	addSlideImagePlane(images_, w_, h_, ws_, hs_, x_, y_, z_, img_) {
		var data = $g.factory.data.geo.planeData(
			images, images.obj3d, w_, h_, ws_, hs_, img_,
			{color: 0xfefefe, opacity: 0.9, transparent: true},
			{x: x_, y: y_, z: z_},
			{x: 0, y: Math.PI/2, z: 0},
			/*hover, texture, mirror*/
			false, false, false);
		var plane = new S3dPlane(data);
		plane.obj3d.position.set(x, y, z);
		images_.addPlane(plane);
		images_.calcDim();
		return plane;
	}

	addSlideImagePlaneWithText(
			  images_, text_, textSizeModel_, material_, w_, h_, ws_, hs_, x_, y_, z_, img_) {
		var p = this.addSlideImagePlane(images_, w_, h_, ws_, hs_, x_, y_, z_, img_);
		var data = $g.factory.data.s3d.richTextData(
			text_, p, p.obj3d,{x:0,y:0,z:0},{x: 0, y: 0, z: 0},
			textSizeModel_,material_,null,function(){});
		var rt = new S3dRichText(data);
		/*rt.setStr(text_);*/
		rt.obj3d.position.set(0,-h/2,50);
	}
	
	functionAction() {
		var t = this;
		var data = {
			owner: this,
			obj3d: obj_,
			target: first_.target,
			time: first_.time,
			onFinish: function() {
				if (callback_) setTimeout(function() {callback_.call(t);}, 100);
			}
		}
		if (first_.actionType === "propto")
			this.actions.propertyTo(data);
		else if (first_.actionType = "propon")
			this.actions.propertyBy(data);
	}
	
	singleMove(obj_,first_,callback_) {
		var t = this;
		var data = {
			owner: this,
			obj3d: obj_,
			target: first_.target,
			time: first_.time,
			onFinish: function() {
				if (callback_) {callback_.call(t);};
			}
		}
		if (first_.actionType === "moveto")
			this.actions.move("to",data);
		else if (first_.actionType = "moveby")
			this.actions.move("by",data);
	}
	
	doubleMove(obj_,first_,second_,firstCallback_,secondCalback_) {
		var t = this;
		var data2 = {
			owner: t.actions,
			obj3d: obj_,
			time: second_.time,
			target: second_.target,
			onFinish: function() {
				if (secondCallback_)
					setTimeout(function() {
						secondCallback_.call(t);
					}, second_.time.start);
			}
		}
		var data1 = {
			owner: t.actions,
			obj3d: obj_,
			time: first_.time,
			target: first_.target,
			onFinish: function() {
				if (firstCallback_) setTimeout(function(){firstCallback_.call(t);}, first_.startTime);
				t.owner.moveTo(data2);
			}
		}
		this.actions.moveTo(data1);
	}

	executeObjectActions() {
		$g.stock.obj3d.forEach(function(o) {
			if ((o.exec) && (o.nextTime < Date.now())) {
				o.exec(o);
				o.nextTime = o.nextTime + o.execTime;
			}
			if ((o.moving) && (o.nextMoveActionExecTime < Date.now())) {
				o.moveActionExec(o);
				o.nextMoveActionExecTime = o.nextMoveActionExecTime + o.execTime;
			}
		});
	}
}
