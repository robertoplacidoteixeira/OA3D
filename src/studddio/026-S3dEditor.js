var BACKSPACE = 8;
var TAB = 9;
var ENTER = 13;
var ESC = 27;
var END = 35;
var HOME = 36;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var INS = 45;
var RIGHT_ARROW = 39;
var DEL = 46;
var ESC = 27;

class S3dEditor extends S3dRichCtrl {


	afterPrepare() {
		super.afterPrepare();
		//this.setParam(this.data);
		this.flagIns = true;
		this.str = null;
		if (!this.data) { 
			this.data = {}
			this.data.geometry = new THREE.PlaneBufferGeometry(70, 30);
			this.data.material = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				opacity: 0.9,
				transparent: true
			});
		}

		if (this.addMemo) {
			var data = $g.factory.data.s3d.memoData(this, this.obj3d, editorParam.addLine, this.textSizeModel, this.material);
			this.richMemo = new S3dRichMemo(data);
		}
	}

	recalcCharsPos() {
		 this.richMemo.recalcCharsPos();
	}

	calcCursorPos() {
			return this.richMemo.calcCursorPos();
	}

	processKey(event) {
		var preventDefault = true;
		switch (event.geoStockId) {
			case END :
				this.end();
				break;
			case HOME :
				this.home();
				break;
			case BACKSPACE :
				this.backspace();
				break;
			case ENTER :
				this.enter();
				break;
			case UP_ARROW:
				this.upArrow();
				break;
			case LEFT_ARROW:
				this.leftArrow();
				break;
			case DOWN_ARROW:
				this.DownArrow();
				break;
			case RIGHT_ARROW:
				this.rightArrow();
				break;
			case DEL:
				this.del();
				break;
			case INS:
			this.ins();
			break;
			default:
				preventDefault = false;
		}
		if (preventDefault) {
			this.recalcCharsPos();
			this.calcCursorPos();
			event.preventDefault();
		}
	}

	processChar(event) {
		this.editChar(event.charCode);
	}

	end() {
		this.richMemo.cursorIndex = this.richMemo.richTextNode.object.linkedNodeCount;
	}

	home() {
		this.richMemo.cursorIndex = 0;
	}

	backspace() {
		this.richMemo.backspace();
	}

	enter() {
		if (this.flagIns) {
			this.richMemo.addRichText(this.richMemo.richTextIndex + 1, true);
		}
	}

	upArrow() {
		this.richMemo.moveUp();
	}

	leftArrow() {
		 this.richMemo.moveLeft();
	}

	DownArrow() {
		 this.richMemo.moveDown();
	}

	rightArrow() {
		 this.richMemo.moveRight();
	}

	del() {
		 this.richMemo.del();
	}

	ins() {
		 this.flagIns = !this.flagIns;
	}

	editChar(geoStockId) {
		 var data = {
			geoStockId: geoStockId,
			flagIns: this.flagIns,
			textSizeModel: this.textSizeModel,
			material: this.material,
			geoStock: this.geoStock,
			data: this.data
		 }
		 this.richMemo.editChar(data);
		 this.recalcCharsPos();
		 this.moveCursorPos(1);
	}

	moveCursorPos(num) {
		 this.richMemo.moveCursorPos(num);
	}
}
