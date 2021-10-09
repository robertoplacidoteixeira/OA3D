class S3dActKit extends RptCommonAncestor {
	constructor() {
		super({
			materialFarm: {},
			fontFarm: {},
            fontStyleModelFarm: {},
			textSizeModelFarm: {}
		});
	}

	duringCreate() {
		super.duringCreate();
		this.setMaterial();
		this.setFont();
		/*
		var newSystem = false;
		if (newSystem) {
			var mlist = {}
			var paramMaterialPhong = {
				type: S3d.mphong
			}
			var materialPhong = new S3dMaterial(paramMaterialPhong);
			mlist.fpred = createMeshFaceMaterialNew(materialPhong, 0xff0000, 0.3);
			mlist.fpgreen = createMeshFaceMaterialNew(materialPhong, 0x00ff00, 0.3);
			mlist.fpblue = createMeshFaceMaterialNew(materialPhong, 0x0000ff, 0.3);
		}
		*/
	}

	createMeshFaceMaterialNew(sourceMaterial, color, opacity, transparent) {
		var flat = sourceMaterial.clone({color: color, opacity: opacity, transparent: transparent, flatShading: THREE.FlatShading});
		var smooth = sourceMaterial.clone({color: color, opacity: opacity, transparent: transparent, flatShading: THREE.SmoothShading});
		var mpred = new S3dMaterial(flat, smooth);
		return mpred;
	}

	createMeshFaceMaterial(color, opacity, transparent) {
		var m1 = new THREE.MeshPhongMaterial({color: color, opacity: opacity || 1, transparent: transparent || true, flatShading: THREE.FlatShading});
		var m2 = new THREE.MeshPhongMaterial({color: color, opacity: opacity || 1, transparent: transparent || true, flatShading: THREE.SmoothShading});
		//var m = new THREE.MeshFaceMaterial(m1, m2);
		return [m1,m2];
	}

	setMaterial() {
		var ml = this.materialFarm;
		/*
		ml.dictOp30 = new THREE.MeshFaceMaterial([
			new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture("site/img/dictionary/dictionary-01b.jpg"),
				// color: 0x0000ff, 
				opacity: 0.3,
				transparent: true,
				flatShading: THREE.FlatShading
			}), // front
			new THREE.MeshPhongMaterial({
				map: THREE.ImageUtils.loadTexture("site/img/letter/letter-01b.jpg"),
				// color: 0x00ff00, 
				opacity: 0.3,
				transparent: true,
				flatShading: THREE.SmoothShading
			}) // side
		]);
		*/
		ml.gray3    = this.createMeshFaceMaterial(0x333333);
		/*
		ml.blueOp30 = this.createMeshFaceMaterial(0x0000ff, 0.3, true);
		ml.red      = this.createMeshFaceMaterial(0xff0000);
		ml.green    = this.createMeshFaceMaterial(0x00ff00);
		ml.blue     = this.createMeshFaceMaterial(0x0000ff);
		ml.black    = this.createMeshFaceMaterial(0x000000);
		ml.white    = this.createMeshFaceMaterial(0xffffff);
		ml.gray1    = this.createMeshFaceMaterial(0x111111);
		ml.gray2    = this.createMeshFaceMaterial(0x222222);
		ml.gray4    = this.createMeshFaceMaterial(0x444444);
		ml.gray5    = this.createMeshFaceMaterial(0x555555);
		ml.gray6    = this.createMeshFaceMaterial(0x666666);
		ml.gray7    = this.createMeshFaceMaterial(0x777777);
		ml.gray8    = this.createMeshFaceMaterial(0x888888);
		ml.gray9    = this.createMeshFaceMaterial(0x999999);
		ml.grayA    = this.createMeshFaceMaterial(0xAAAAAA);
		ml.grayB    = this.createMeshFaceMaterial(0xBBBBBB);
		ml.grayC    = this.createMeshFaceMaterial(0xCCCCCC);
		ml.grayD    = this.createMeshFaceMaterial(0xDDDDDD);
		ml.grayE    = this.createMeshFaceMaterial(0xEEEEEE);
		ml.grayF    = this.createMeshFaceMaterial(0xFFFFFF);
		*/
	}

	setFont(fs) {
		var fpl = this.fontFarm;
		var tpl = this.textSizeModelFarm;
		//f.ds = new S3dFontParam("ds","droid sans");
		//fs.ds = new S3dFontStyleParam("dsbn",f.ds,"droid sans","bold","normal",4,2,1.5,3,true,null);
		//f = fpl.getFont("ds", "droid sans");

		fpl.dsbn = $g.factory.data.s3d.fontStyleModelData($g.fonts.getFont("dsar"),12,2,1.5,3,true);

		var tsm = $g.factory.data.s3d.textSizeModelData;

		tpl.dsbn8x2    = tsm(fpl.dsbn,   8,  2, "normal", "normal",  2,  2, 0, 1);
		tpl.dsbn9x2    = tsm(fpl.dsbn,   9,  2, "normal", "normal",  2,  2, 0, 1);
		tpl.dsbn10x3   = tsm(fpl.dsbn,  10,  3, "normal", "normal",  2,  2, 0, 1);
		tpl.dsbn11x3   = tsm(fpl.dsbn,  11,  3, "normal", "normal",  2,  2, 0, 1);
		tpl.dsbn12x3   = tsm(fpl.dsbn,  12,  3, "normal", "normal",  3,  3, 0, 1);
		tpl.dsbn14x4   = tsm(fpl.dsbn,  14,  4, "normal", "normal",  3,  3, 0, 1);
		tpl.dsbn18x4   = tsm(fpl.dsbn,  18,  4, "normal", "normal",  4,  4, 0, 1);
		tpl.dsbn24x5   = tsm(fpl.dsbn,  24,  5, "normal", "normal",  6,  6, 0, 1);
		tpl.dsbn36x6   = tsm(fpl.dsbn,  36,  6, "normal", "normal",  9,  9, 0, 1);
		tpl.dsbn48x7   = tsm(fpl.dsbn,  48,  7, "normal", "normal", 12, 12, 0, 1);
		tpl.dsbn72x8   = tsm(fpl.dsbn,  72,  8, "normal", "normal", 18, 18, 0, 1);
		tpl.dsbn144x16 = tsm(fpl.dsbn, 144, 16, "normal", "normal", 36, 36, 0, 1);
		tpl.dsbn288x32 = tsm(fpl.dsbn, 288, 32, "normal", "normal", 72, 72, 0, 1);
		tpl.dsbn320x32 = tsm(fpl.dsbn, 320, 32, "normal", "normal", 80, 80, 0, 1);
		tpl.bigDsbn    = tsm(fpl.dsbn,  70, 70, "normal", "normal", 17, 17, 0, 1);
		tpl.mediumDsbn = tsm(fpl.dsbn,  50, 10, "normal", "normal", 12, 12, 0, 1);
		tpl.smallDsbn  = tsm(fpl.dsbn,  12,  3, "normal", "normal",  3,  3, 0, 1);
	}
}
