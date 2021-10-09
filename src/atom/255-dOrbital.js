class OrbitalD extends LobeOrbital {

	firstLevel() {
		return 3;
	}

	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   rot.set(0,0,0);
	   switch(this.axis) {
		  case yz:
			 rot.x = pi + (quarterPI * this.direction);
			 break;
		  case xz:
			 rot.x = -halfPI;
			 rot.z = quarterPI * this.direction;
			 break;
		  case xy:
			 rot.z = -quarterPI * this.direction;
			 break;
		  case x2y2:
			 if (this.direction === 1) rot.z = halfPI;
			 break;
		  case z2:
			 rot.x = halfPI * this.direction;
	   }
	}

	createCloud() {
	   super.createCloud();   
	   if (this.axis === z2) 
		  this.createLobes([0],true);
	   else 
		  this.createLobes([0,-pi],false);
	}

	createAxesAndDirections() {
	   this.axesAndDirections = [[xy,1],[xz,1],[z2,1],[yz,1],[x2y2,1],[xy,-1],[xz,-1],[z2,-1],[yz,-1],[x2y2,-1]];
	}
}
