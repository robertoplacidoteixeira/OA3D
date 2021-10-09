// This set of controls performs orbiting,dollying (zooming),and panning.
// Unlike TrackballControls,it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse,or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse,or left mouse + ctrl/meta/shiftKey,or arrow keys / touch: two-finger move

class ControleOrbital {

	constructor	(object,domElement) {
		super(object,domElement);
		// current position in spherical coordinates
		this.spherical = new THREE.Spherical();
		this.sphericalDelta = new THREE.Spherical();

		// How far you can orbit vertically,upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally,upper and lower limits.
		// If set,the interval [min,max] must be a sub-interval of [- 2 PI,2 PI],with (max - min < 2 PI)
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians
	}

	//
	// public methods
	//

	getPolarAngle() {
		return this.spherical.phi;
	}

	getAzimuthalAngle() {
		return this.spherical.theta;
	}

	updateAction(offset) {
		
		super.updateAction(offset);
		
		// angle from z-axis around y-axis
		this.spherical.setFromVector3(offset);

		// restrict theta to be between desired limits

		if (this.enableDamping) {
			this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
			this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
		} else {
			this.spherical.theta += this.sphericalDelta.theta;
			this.spherical.phi += this.sphericalDelta.phi;
		}

		var min = this.minAzimuthAngle;
		var max = this.maxAzimuthAngle;

		if (isFinite(min) && isFinite(max)) {
			if (min < - Math.PI) min += twoPI; else if (min > Math.PI) min -= twoPI;
			if (max < - Math.PI) max += twoPI; else if (max > Math.PI) max -= twoPI;
			if (min <= max) {
				this.spherical.theta = Math.max(min,Math.min(max,this.spherical.theta));
			} else {
				this.spherical.theta = (this.spherical.theta > (min + max) / 2) ?
					Math.max(min,this.spherical.theta) :
					Math.min(max,this.spherical.theta);
			}
		}

		// restrict phi to be between desired limits
		this.spherical.phi = Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this.spherical.phi));

		this.spherical.makeSafe();
/*
		this.spherical.radius *= this.scale;

		// restrict radius to be between desired limits
		this.spherical.radius = Math.max(this.minDistance,Math.min(this.maxDistance,this.spherical.radius));
*/
		// move target to panned location

		offset.setFromSpherical(this.spherical);
	}

	testEnableDumping() {
		super.testEnableDumping();
		if (this.enableDamping === true) {
			this.sphericalDelta.theta *= (1 - this.dampingFactor);
			this.sphericalDelta.phi *= (1 - this.dampingFactor);
		} else {
			this.sphericalDelta.set(0,0,0);
		}
	}

	rotateLeft(angle) {
		this.sphericalDelta.theta -= angle;
	}

	rotateUp(angle) {
		this.sphericalDelta.phi -= angle;
	}
}

// This set of controls performs orbiting,dollying (zooming),and panning.
// Unlike TrackballControls,it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls,another set of touch behavior
//
//    Orbit - right mouse,or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse,or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse,or arrow keys / touch: one-finger move

class MapaControleOrbital extends ControleOrbital {
	constructor(object,domElement) {
		super(object,domElement);
		this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up
		this.mouseButtons.LEFT = THREE.MOUSE.PAN;
		this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
		this.touches.ONE = THREE.TOUCH.PAN;
		this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
	}
}
