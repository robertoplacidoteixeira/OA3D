// This set of controls performs orbiting,dollying (zooming),and panning.
// Unlike TrackballControls,it maintains the "up" direction camera.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse,or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse,or left mouse + ctrl/meta/shiftKey,or arrow keys / touch: two-finger move

class ControleOrbital {

	constructor	(camera,object,domElement) {

		if (domElement === undefined) console.warn('ControleOrbital: o segundo parâmetro é obrigatório.');
		if (domElement === document) console.error('ControleOrbital: "document" não deve ser algo de "domElement". Por favor use "renderer.domElement" ao invés.');

		this.this_ = this;
		domElement.this_ = this;
		domElement.ownerDocument.this_ = this;
		
		this.camera = camera;
		this.object = object;
		this.domElement = domElement;
		
		this.lookAt = false;
		
		this.ed = new THREE.EventDispatcher();

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus,where the camera orbits around
		this.target = new THREE.Vector3();

		// How far you can dolly in and out (PerspectiveCamera only)
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out (OrthographicCamera only)
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// Set to true to enable damping (inertia)
		// If damping is enabled,you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false,pan orthogonal to world-space direction camera.up
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled,you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = {LEFT: 37,UP: 38,RIGHT: 39,BOTTOM: 40}

		// Mouse buttons
		this.mouseButtons = {LEFT: THREE.MOUSE.ROTATE,MIDDLE: THREE.MOUSE.DOLLY,RIGHT: THREE.MOUSE.PAN}

		// Touch fingers
		this.touches = {ONE: THREE.TOUCH.ROTATE,TWO: THREE.TOUCH.DOLLY_PAN}

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.camera.position.clone();
		this.zoom0 = this.camera.zoom;

		//
		// internals
		//

		this.changeEvent = {type: 'change'}
		this.startEvent = {type: 'start'}
		this.endEvent = {type: 'end'}

		this.STATE = {
			NONE: - 1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		}

		this.state = this.STATE.NONE;

		this.EPS = 0.000001;

		this.scale = 1;
		this.panOffset = new THREE.Vector3();
		this.zoomChanged = false;

		this.rotateStart = new THREE.Vector2();
		this.rotateEnd = new THREE.Vector2();
		this.rotateDelta = new THREE.Vector2();

		this.panStart = new THREE.Vector2();
		this.panEnd = new THREE.Vector2();
		this.panDelta = new THREE.Vector2();

		this.dollyStart = new THREE.Vector2();
		this.dollyEnd = new THREE.Vector2();
		this.dollyDelta = new THREE.Vector2();

		this.domElement.addEventListener('contextmenu',this.onContextMenu,false);

		this.domElement.addEventListener('pointerdown',this.onPointerDown,false);
		this.domElement.addEventListener('wheel',this.onMouseWheel,false);

		this.domElement.addEventListener('touchstart',this.onTouchStart,false);
		this.domElement.addEventListener('touchend',this.onTouchEnd,false);
		this.domElement.addEventListener('touchmove',this.onTouchMove,false);

		this.domElement.addEventListener('keydown',this.onKeyDown,false);

		// force an update at start

		this.update();
	}

	//
	// public methods
	//

	saveState() {
		this.target0.copy(this.target);
		this.position0.copy(this.camera.position);
		this.zoom0 = this.camera.zoom;
	}

	reset() {
		this.target.copy(this.target0);
		this.camera.position.copy(this.position0);
		this.camera.zoom = this.zoom0;

		this.camera.updateProjectionMatrix();
		this.ed.dispatchEvent(this.changeEvent);

		this.update();

		this.state = this.STATE.NONE;
	}

	update() {
		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up,new THREE.Vector3(0,1,0));
		var quatInverse = quat.clone().invert();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		var twoPI = 2 * Math.PI;

		var position = this.camera.position;

		offset.copy(position).sub(this.target);

		// rotate offset to "y-axis-is-up" space
		offset.applyQuaternion(quat);
		
		if (this.autoRotate && this.state === this.STATE.NONE) {
			this.rotateLeft(this.getAutoRotationAngle());
		}
		
		this.updateAction(offset)

		this.testEnableDumping();

		// rotate offset back to "camera-up-vector-is-up" space
		offset.applyQuaternion(quatInverse);

		position.copy(this.target).add(offset);
		
		if (this.lookAt) this.camera.lookAt(this.target);

		this.scale = 1;

		// update condition is:
		// min(camera displacement,camera rotation in radians)^2 > this.EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if (this.zoomChanged ||
				lastPosition.distanceToSquared(this.camera.position) > this.EPS ||
				8 * (1 - lastQuaternion.dot(this.camera.quaternion)) > this.EPS) {
			this.ed.dispatchEvent(this.changeEvent);
			lastPosition.copy(this.camera.position);
			lastQuaternion.copy(this.camera.quaternion);
			this.zoomChanged = false;
			return true;
		}
		
		return false;
	}
	
	updateAction(offset) {
	}
		
	testEnableDumping() {
		if (this.enableDamping === true) {
			this.target.addScaledVector(this.panOffset,this.dampingFactor);
			this.panOffset.multiplyScalar(1 - this.dampingFactor);
		} else {
			this.target.add(this.panOffset);
			this.panOffset.set(0,0,0);
		}
	}

	dispose() {
		this.domElement.removeEventListener('contextmenu',this.onContextMenu,false);
		this.domElement.removeEventListener('pointerdown',this.onPointerDown,false);
		this.domElement.removeEventListener('wheel',this.onMouseWheel,false);
		this.domElement.removeEventListener('touchstart',this.onTouchStart,false);
		this.domElement.removeEventListener('touchend',this.onTouchEnd,false);
		this.domElement.removeEventListener('touchmove',this.onTouchMove,false);
		this.domElement.ownerDocument.removeEventListener('pointermove',this.onPointerMove,false);
		this.domElement.ownerDocument.removeEventListener('pointerup',this.onPointerUp,false);
		this.domElement.removeEventListener('keydown',this.onKeyDown,false);
		//this.ed.dispatchEvent({type: 'dispose'}); // should this be added here?
	}

	getAutoRotationAngle() {
		return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
	}

	getZoomScale() {
		return Math.pow(0.95,this.zoomSpeed);
	}

	rotateLeft(angle) {
		var obj = (this.object) ? this.object : this.camera;
		obj.rotation.y -= angle;
	}

	rotateUp(angle) {
		var obj = (this.object) ? this.object : this.camera;
		obj.rotation.x -= angle;
	}

	panLeft(distance,objectMatrix) {
		var v = new THREE.Vector3();
		v.setFromMatrixColumn(objectMatrix,0); // get X column of objectMatrix
		v.multiplyScalar(-distance);
		this.panOffset.add(v);
	}

	panUp(distance,objectMatrix) {
		var v = new THREE.Vector3();
		if (this.screenSpacePanning === true) {
			v.setFromMatrixColumn(objectMatrix,1);
		} else {
			v.setFromMatrixColumn(objectMatrix,0);
			v.crossVectors(this.camera.up,v);
		}
		v.multiplyScalar(distance);
		this.panOffset.add(v);
	}
	
	// deltaX and deltaY are in pixels; right and down are positive
	pan(deltaX,deltaY) {
		var offset = new THREE.Vector3();
		var element = this.domElement;
		if (this.camera.isPerspectiveCamera) {
			// perspective
			var position = this.camera.position;
			offset.copy(position).sub(this.target);
			var targetDistance = offset.length();
			// half of the fov is center to top of screen
			targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0);
			// we use only clientHeight here so aspect ratio does not distort speed
			this.panLeft(2 * deltaX * targetDistance / element.clientHeight,this.camera.matrix);
			this.panUp(2 * deltaY * targetDistance / element.clientHeight,this.camera.matrix);
		} else if (this.camera.isOrthographicCamera) {
			// orthographic
			this.panLeft(deltaX * (this.camera.right - this.camera.left) / this.camera.zoom / element.clientWidth,this.camera.matrix);
			this.panUp(deltaY * (this.camera.top - this.camera.bottom) / this.camera.zoom / element.clientHeight,this.camera.matrix);
		} else {
			// camera neither orthographic nor perspective
			console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
			this.enablePan = false;
		}
	}

	dollyOut(dollyScale) {
		if (this.camera.isPerspectiveCamera) {
			this.scale /= dollyScale;
		} else if (this.camera.isOrthographicCamera) {
			this.camera.zoom = Math.max(this.minZoom,Math.min(this.maxZoom,this.camera.zoom * dollyScale));
			this.camera.updateProjectionMatrix();
			this.zoomChanged = true;
		} else {
			console.warn('ATENÇÃO: ControleOrbital encontrou um tipo desconhecido de câmera - dolly/zoom desabilitado.');
			this.enableZoom = false;
		}
	}

	dollyIn(dollyScale) {
		if (this.camera.isPerspectiveCamera) {
			this.scale *= dollyScale;
		} else if (this.camera.isOrthographicCamera) {
			this.camera.zoom = Math.max(this.minZoom,Math.min(this.maxZoom,this.camera.zoom / dollyScale));
			this.camera.updateProjectionMatrix();
			this.zoomChanged = true;
		} else {
			console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
			this.enableZoom = false;
		}
	}

	//
	// event callbacks - update the camera state
	//

	handleMouseDownRotate(event) {
		this.this_.rotateStart.set(event.clientX,event.clientY);
	}

	handleMouseDownDolly(event) {
		this.this_.dollyStart.set(event.clientX,event.clientY);
	}

	handleMouseDownPan(event) {
		this.this_.panStart.set(event.clientX,event.clientY);
	}

	handleMouseMoveRotate(event) {
		this.this_.rotateEnd.set(event.clientX,event.clientY);
		this.this_.rotateDelta.subVectors(this.this_.rotateEnd,this.this_.rotateStart).multiplyScalar(this.this_.rotateSpeed);
		this.this_.rotateLeft(2 * Math.PI * this.this_.rotateDelta.x / this.this_.domElement.clientHeight); // yes,height
		this.this_.rotateUp(2 * Math.PI * this.this_.rotateDelta.y / this.this_.domElement.clientHeight);
		this.this_.rotateStart.copy(this.this_.rotateEnd);
		this.this_.update();
	}

	handleMouseMoveDolly(event) {
		this.this_.dollyEnd.set(event.clientX,event.clientY);
		this.this_.dollyDelta.subVectors(this.this_.dollyEnd,this.this_.dollyStart);
		if (this.this_.dollyDelta.y > 0) {
			this.this_.dollyOut(this.this_.getZoomScale());
		} else if (this.this_.dollyDelta.y < 0) {
			this.this_.dollyIn(this.this_.getZoomScale());
		}
		this.this_.dollyStart.copy(this.this_.dollyEnd);
		this.this_.update();
	}

	handleMouseMovePan(event) {
		this.this_.panEnd.set(event.clientX,event.clientY);
		this.this_.panDelta.subVectors(this.this_.panEnd,this.this_.panStart).multiplyScalar(this.this_.panSpeed);
		this.this_.pan(this.this_.panDelta.x,this.this_.panDelta.y);
		this.this_.panStart.copy(this.this_.panEnd);
		this.this_.update();
	}

	handleMouseUp(/*event*/) {
		// no-op
	}

	handleMouseWheel(event) {
		if (event.deltaY < 0) {
			this.this_.dollyIn(this.this_.getZoomScale());
		} else if (event.deltaY > 0) {
			this.this_.dollyOut(this.this_.getZoomScale());
		}
		this.this_.update();
	}

	handleKeyDown(event) {
		var needsUpdate = false;
		switch (event.keyCode) {
			case this.this_.keys.UP:
				this.this_.pan(0,this.this_.keyPanSpeed);
				needsUpdate = true;
				break;
			case this.this_.keys.BOTTOM:
				this.this_.pan(0,-this.this_.keyPanSpeed);
				needsUpdate = true;
				break;
			case this.this_.keys.LEFT:
				this.this_.pan(this.this_.keyPanSpeed,0);
				needsUpdate = true;
				break;
			case this.this_.keys.RIGHT:
				this.this_.pan(-this.this_.keyPanSpeed,0);
				needsUpdate = true;
				break;
		}
		if (needsUpdate) {
			// prevent the browser from scrolling on cursor keys
			event.preventDefault();
			this.this_.update();
		}
	}

	handleTouchStartRotate(event) {
		if (event.touches.length == 1) {
			this.this_.rotateStart.set(event.touches[0].pageX,event.touches[0].pageY);
		} else {
			var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
			var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
			this.this_.rotateStart.set(x,y);
		}
	}

	handleTouchStartPan(event) {
		if (event.touches.length == 1) {
			this.this_.panStart.set(event.touches[0].pageX,event.touches[0].pageY);
		} else {
			var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
			var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
			this.this_.panStart.set(x,y);
		}
	}

	handleTouchStartDolly(event) {
		var dx = event.touches[0].pageX - event.touches[1].pageX;
		var dy = event.touches[0].pageY - event.touches[1].pageY;
		var distance = Math.sqrt(dx * dx + dy * dy);
		this.this_.dollyStart.set(0,distance);
	}

	handleTouchStartDollyPan(event) {
		if (this.this_.enableZoom) this.this_.handleTouchStartDolly(event);
		if (this.this_.enablePan) this.this_.handleTouchStartPan(event);
	}

	handleTouchStartDollyRotate(event) {
		if (this.this_.enableZoom) this.this_.handleTouchStartDolly(event);
		if (this.this_.enableRotate) this.this_.handleTouchStartRotate(event);
	}

	handleTouchMoveRotate(event) {
		if (event.touches.length == 1) {
			this.this_.rotateEnd.set(event.touches[0].pageX,event.touches[0].pageY);
		} else {
			var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
			var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
			this.this_.rotateEnd.set(x,y);
		}
		this.this_.rotateDelta.subVectors(this.this_.rotateEnd,this.this_.rotateStart).multiplyScalar(this.this_.rotateSpeed);
		this.this_.rotateLeft(2 * Math.PI * this.this_.rotateDelta.x / this.this_.domElement.clientHeight); // yes,height
		this.this_.rotateUp(2 * Math.PI * this.this_.rotateDelta.y / this.this_.domElement.clientHeight);
		this.this_.rotateStart.copy(this.this_.rotateEnd);
	}

	handleTouchMovePan(event) {
		if (event.touches.length == 1) {
			this.this_.panEnd.set(event.touches[0].pageX,event.touches[0].pageY);
		} else {
			var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
			var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);
			this.this_.panEnd.set(x,y);
		}
		this.this_.panDelta.subVectors(this.this_.panEnd,this.this_.panStart).multiplyScalar(this.this_.panSpeed);
		this.this_.pan(this.this_.panDelta.x,this.this_.panDelta.y);
		this.this_.panStart.copy(this.this_.panEnd);
	}

	handleTouchMoveDolly(event) {
		var dx = event.touches[0].pageX - event.touches[1].pageX;
		var dy = event.touches[0].pageY - event.touches[1].pageY;
		var distance = Math.sqrt(dx * dx + dy * dy);
		this.this_.dollyEnd.set(0,distance);
		this.this_.dollyDelta.set(0,Math.pow(this.this_.dollyEnd.y / this.this_.dollyStart.y,this.this_.zoomSpeed));
		this.this_.dollyOut(this.this_.dollyDelta.y);
		this.this_.dollyStart.copy(this.this_.dollyEnd);
	}

	handleTouchMoveDollyPan(event) {
		if (this.this_.enableZoom) this.this_.handleTouchMoveDolly(event);
		if (this.this_.enablePan) this.this_.handleTouchMovePan(event);
	}

	handleTouchMoveDollyRotate(event) {
		if (this.this_.enableZoom) this.this_.handleTouchMoveDolly(event);
		if (this.this_.enableRotate) this.this_.handleTouchMoveRotate(event);
	}

	handleTouchEnd(/*event*/) {
		// no-op
	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	onPointerDown(event) {
		if (this.this_.enabled === false) return;
		switch (event.pointerType) {
			case 'mouse':
			case 'pen':
				this.this_.onMouseDown(event);
				break;
			// TODO touch
		}
	}

	 onPointerMove(event) {
		if (this.this_.enabled === false) return;
		switch (event.pointerType) {
			case 'mouse':
			case 'pen':
				this.this_.onMouseMove(event);
				break;
			// TODO touch
		}
	}

	onPointerUp(event) {
		switch (event.pointerType) {
			case 'mouse':
			case 'pen':
				this.this_.onMouseUp(event);
				break;
			// TODO touch
		}
	}
	
	mouseAction(event) {
		var mouseAction;
		switch (event.button) {
			case 0:
				mouseAction = this.this_.mouseButtons.LEFT;
				break;
			case 1:
				mouseAction = this.this_.mouseButtons.MIDDLE;
				break;
			case 2:
				mouseAction = this.this_.mouseButtons.RIGHT;
				break;
			default:
				mouseAction = - 1;
		}
		return mouseAction;
	}

	onMouseDown(event) {
		// Prevent the browser from scrolling.
		event.preventDefault();
		// Manually set the focus since calling preventDefault above
		// prevents the browser from setting it automatically.
		this.this_.domElement.focus ? this.this_.domElement.focus() : window.focus();
		var mouseAction = this.this_.mouseAction(event);
		switch (mouseAction) {
			case THREE.MOUSE.DOLLY:
				if (this.this_.enableZoom === false) return;
				this.this_.handleMouseDownDolly(event);
				this.this_.state = this.this_.STATE.DOLLY;
				break;
			case THREE.MOUSE.ROTATE:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.this_.enablePan === false) return;
					this.this_.handleMouseDownPan(event);
					this.this_.state = this.this_.STATE.PAN;
				} else {
					if (this.this_.enableRotate === false) return;
					this.this_.handleMouseDownRotate(event);
					this.this_.state = this.this_.STATE.ROTATE;
				}
				break;
			case THREE.MOUSE.PAN:
				if (event.ctrlKey || event.metaKey || event.shiftKey) {
					if (this.this_.enableRotate === false) return;
					this.this_.handleMouseDownRotate(event);
					this.this_.state = this.this_.STATE.ROTATE;
				} else {
					if (this.this_.enablePan === false) return;
					this.this_.handleMouseDownPan(event);
					this.this_.state = this.this_.STATE.PAN;
				}
				break;
			default:
				this.this_.state = this.this_.STATE.NONE;
		}
		if (this.this_.state !== this.this_.STATE.NONE) {
			this.this_.domElement.ownerDocument.addEventListener('pointermove',this.this_.onPointerMove,false);
			this.this_.domElement.ownerDocument.addEventListener('pointerup',this.this_.onPointerUp,false);
			this.this_.ed.dispatchEvent(this.this_.startEvent);
		}
	}

	onMouseMove(event) {
		if (this.this_.enabled === false) return;
		event.preventDefault();
		switch (this.this_.state) {
			case this.this_.STATE.ROTATE:
				if (this.this_.enableRotate === false) return;
				this.this_.handleMouseMoveRotate(event);
				break;
			case this.this_.STATE.DOLLY:
				if (this.this_.enableZoom === false) return;
				this.this_.handleMouseMoveDolly(event);
				break;
			case this.this_.STATE.PAN:
				if (this.this_.enablePan === false) return;
				this.this_.handleMouseMovePan(event);
				break;
		}
	}

	onMouseUp(event) {
		this.this_.domElement.ownerDocument.removeEventListener('pointermove',this.this_.onPointerMove,false);
		this.this_.domElement.ownerDocument.removeEventListener('pointerup',this.this_.onPointerUp,false);
		if (this.this_.enabled === false) return;
		this.this_.handleMouseUp(event);
		this.this_.ed.dispatchEvent(this.this_.endEvent);
		this.this_.state = this.this_.STATE.NONE;
	}

	onMouseWheel(event) {
		if (this.this_.enabled === false || this.this_.enableZoom === false || (this.this_.state !== this.this_.STATE.NONE && this.this_.state !== this.this_.STATE.ROTATE)) return;
		event.preventDefault();
		event.stopPropagation();
		this.this_.ed.dispatchEvent(this.this_.startEvent);
		this.this_.handleMouseWheel(event);
		this.this_.ed.dispatchEvent(this.this_.endEvent);
	}

	onKeyDown(event) {
		if (this.this_.enabled === false || this.this_.enableKeys === false || this.this_.enablePan === false) return;
		this.this_.handleKeyDown(event);
	}

	onTouchStart(event) {
		if (this.this_.enabled === false) return;
		event.preventDefault(); // prevent scrolling
		switch (event.touches.length) {
			case 1:
				switch (this.this_.touches.ONE) {
					case THREE.TOUCH.ROTATE:
						if (this.this_.enableRotate === false) return;
						this.this_.handleTouchStartRotate(event);
						this.this_.state = this.this_.STATE.TOUCH_ROTATE;
						break;
					case THREE.TOUCH.PAN:
						if (this.this_.enablePan === false) return;
						this.this_.handleTouchStartPan(event);
						this.this_.state = this.this_.STATE.TOUCH_PAN;
						break;
					default:
						this.this_.state = this.this_.STATE.NONE;
				}
				break;
			case 2:
				switch (this.this_.touches.TWO) {
					case THREE.TOUCH.DOLLY_PAN:
						if (this.this_.enableZoom === false && this.this_.enablePan === false) return;
						this.this_.handleTouchStartDollyPan(event);
						this.this_.state = this.this_.STATE.TOUCH_DOLLY_PAN;
						break;
					case THREE.TOUCH.DOLLY_ROTATE:
						if (this.this_.enableZoom === false && this.this_.enableRotate === false) return;
						this.this_.handleTouchStartDollyRotate(event);
						this.this_.state = this.this_.STATE.TOUCH_DOLLY_ROTATE;
						break;
					default:
						this.this_.state = this.this_.STATE.NONE;
				}
				break;
			default:
				this.this_.state = this.this_.STATE.NONE;
		}
		if (this.this_.state !== this.this_.STATE.NONE) {
			this.this_.ed.dispatchEvent(this.this_.startEvent);
		}
	}

	onTouchMove(event) {
		if (this.this_.enabled === false) return;
		event.preventDefault(); // prevent scrolling
		event.stopPropagation();
		switch (this.this_.state) {
			case this.this_.STATE.TOUCH_ROTATE:
				if (this.this_.enableRotate === false) return;
				this.this_.handleTouchMoveRotate(event);
				this.this_.update();
				break;
			case this.this_.STATE.TOUCH_PAN:
				if (this.this_.enablePan === false) return;
				this.this_.handleTouchMovePan(event);
				this.this_.update();
				break;
			case this.this_.STATE.TOUCH_DOLLY_PAN:
				if (this.this_.enableZoom === false && this.this_.enablePan === false) return;
				this.this_.handleTouchMoveDollyPan(event);
				this.this_.update();
				break;
			case this.this_.STATE.TOUCH_DOLLY_ROTATE:
				if (this.this_.enableZoom === false && this.this_.enableRotate === false) return;
				this.this_.handleTouchMoveDollyRotate(event);
				this.this_.update();
				break;
			default:
				this.this_.state = this.this_.STATE.NONE;
		}
	}

	onTouchEnd(event) {
		if (this.this_.enabled === false) return;
		this.this_.handleTouchEnd(event);
		this.this_.ed.dispatchEvent(this.this_.endEvent);
		this.this_.state = this.this_.STATE.NONE;
	}

	onContextMenu(event) {
		if (this.this_.enabled === false) return;
		event.preventDefault();
	}
}

// This set of controls performs orbiting,dollying (zooming),and panning.
// Unlike TrackballControls,it maintains the "up" direction camera.up (+Y by default).
// This is very similar to OrbitControls,another set of touch behavior
//
//    Orbit - right mouse,or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse,or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse,or arrow keys / touch: one-finger move

class MapaControleOrbital extends ControleOrbital {
	constructor(camera,object,domElement) {
		super(camera,object,domElement);
		this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
		this.mouseButtons.LEFT = THREE.MOUSE.PAN;
		this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
		this.touches.ONE = THREE.TOUCH.PAN;
		this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
	}
}
