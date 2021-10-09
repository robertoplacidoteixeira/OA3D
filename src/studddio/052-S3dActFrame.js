class S3dActFrame extends S3dObject3D {
	
	afterCreate() {
		super.afterCreate();
		var c = this.pos || {};
		this.obj3d.position.set(c.x||0,c.y||0,c.z||0);
	}
	duringCreate() {
		super.duringCreate();
		this.createPlane();
		this.createHeader();
		this.createBody();
		this.createFooter();
	}

	createPlane() {
	}

	createHeader() {
	   this.createHeaderPlane();
	   this.createHeaderLogo();
	   this.createHeaderTitle();
	}

	createHeaderPlane() {
	}

	createHeaderLogo() {
	}

	createHeaderTitle() {
	}

	createBody() {
	   this.createBodyPlane();
	}

	createBodyPlane() {
	}

	createFooter() {
	   this.createFooterPlane();
	}

	createFooterPlane() {
	}

	addText(str, textSizeModel) {
	}
}
