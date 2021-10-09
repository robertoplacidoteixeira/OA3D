class RptFonts extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.fonts = [];
	}

	afterPrepare() {
		super.afterPrepare();
		this.loader = new THREE.FontLoader();
	}
	
	load(callback) {
		var t = this;
		var font, fn;
		var len = t.fontArray.length;
		function loadFile(i) {
			if (i === len) callback();
			else {
				font = t.fontArray[i];
				fn = t.dir + font[3];
				t.loader.load(fn,function(font_) {
					t.fonts.push(new RptFont($g.factory.data.s3d.fontData(font[0],font[1],font[2],font_)));
					loadFile(i+1);
				});
			}
		}
		loadFile(0);
	}
	
	getFont(code_) {
		return this.fonts.find(font => font.code === code_);
	}
};
