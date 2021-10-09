class OrbitalF extends LobeOrbital {	

	firstLevel() {
		return 4;
	}
	
	rotacionar() {
	   super.rotacionar();
	   var rot = this.orbital3d.rotation;
	   switch(this.axis) {
		  case xx2y2:
			rot.z = quarterPI * this.direction;
			break;
		  case xyz:
			rot.z = quarterPI * this.direction;
			rot.y = -quarterPI * this.direction;
			break;
		  case xz2:
			rot.z = halfPI * this.direction;
			rot.x = halfPI * this.direction;
			break;
		  case z3:
			rot.x = halfPI;
			break;
		  case yz2:
			rot.y = halfPI * this.direction;
			break;
		  case zx2y2:
			rot.z = quarterPI * this.direction;
			break;
		  case yx2y2:
			// rot.x = halfPI * this.direction;
	   }
	}

	createCloud() { 
	   super.createCloud();
	   if (this.axis === z3)
		  this.createLobes([0],true);
	   else
		  if ((this.axis === xyz) || (this.axis === zx2y2))
			 this.createLobes([0 , -pi / 2 , -pi , -3 * pi / 2] , false);  /* composição lobular de 4 lóbulos */
		  else
			 this.createLobes([0 , -2 * pi / 3 , -4 * pi / 3] , false);    /* composição lobular de 3 lóbulos */
	}

	createAxesAndDirections() {
	   this.axesAndDirections = [[xx2y2,1],[xyz,1],[xz2,1],[z3,1],[yz2,1],[zx2y2,1],[yx2y2,1],[xx2y2,-1],[xyz,-1],[xz2,-1],[z3,-1],[yz2,-1],[zx2y2,-1],[yx2y2,-1]];
	}
}
