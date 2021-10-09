class OrbitalP extends LobeOrbital {
	
	get firstLevel() {
		return 2;
	}
	
	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   switch (this.axis) {
		  case x:
			rot.z = -halfPI * this.direction;
			break;
		  case y:
			if (this.direction === -1) rot.z = -pi;
			break;
		  case z:
			rot.x = halfPI * this.direction;
	   }
	}

	createCloud() {
	   super.createCloud();
	   this.createLobes([0],false);
	}

	createAxesAndDirections() {
	   this.axesAndDirections = [[x,1],[y,1],[z,1],[x,-1],[y,-1],[z,-1]];
	}
}
