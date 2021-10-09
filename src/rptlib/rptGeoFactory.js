class RptGeoFactory extends RptCommonAncestor  {
	
	box(width_, height_, depth_, widthSegments_, heightSegments_, depthSegments_) {
		return new THREE.BoxGeometry(width_, height_, depth_, widthSegments_, heightSegments_, depthSegments_);
	}

	dataBox(data_) {
		return this.box(data_.width, data_.height, data_.depth, data_.widthSegments, data_.heightSegments, data_.depthSegments);
	}

	plane(width_, height_, widthSegments_, heightSegments_) {
		return new THREE.PlaneGeometry(width_, height_, widthSegments_, heightSegments_);
	}

	dataPlane(data_) {
		return this.plane(data_.width, data_.height, data_.widthSegments, data_.heightSegments);
	}

	circle(radius_, segments_, thetaStart_, thetaLength_) {
	   return new THREE.CircleGeometry(radius_, widthSegments_, heightSegments_, phiStart_, phiLength_, thetaStart_, thetaLength_);
	}

	dataCircle(data_) {
		return this.circle(data_.radius, data_.segments, data_.thetaStart, data_.thetaLength);
	}

	sphere(radius_, widthSegments_, heightSegments_, phiStart_, phiLength_, thetaStart_, thetaLength_) {
	   return new THREE.SphereGeometry(radius_, widthSegments_, heightSegments_, phiStart_, phiLength_, thetaStart_, thetaLength_);
	}$

	dataSphere(data_) {
		return this.sphere(data_.radius, data_.widthSegments, data_.heightSegments, data_.phiStart, data_.phiLength, data_.thetaStart, data_.thetaLength);
	}

	cylinder(radiusTop_,radiusBottom_,height_,radialSegments_,heightSegments_,openEnded_,thetaStart_,thetaLength_) {
		return new THREE.CylinderGeometry(radiusTop_,radiusBottom_,height_,radialSegments_,heightSegments_,openEnded_,thetaStart_,thetaLength_);
	}
	
	dataCylinder(data_) {
		return this.cylinder(data_.radiusTop,datadata.radiusBottom,data_.height,data_.radiusSegments_);
	}

	torus(radius_, tube_, radialSegments_, tubularSegments_, arc_) {
	   return new THREE.TorusGeometry(radius_, tube_, radialSegments_, tubularSegments_, arc_);	
	}
	
	dataTorus(data_) {
		return this.torus(data_.radius, data_.tube, data_.radialSegments, data_.tubularSegments, data_.arc);
	}

	textGeometry(str_,textSizeModel_) {
		return new THREE.TextGeometry(str_,$g.factory.data.geo.textGeometryData(textSizeModel_));
	}

	dataTextGeometry(data_) {
		return this.dataTextGeometry(data_.str,data_.textSizeModel);
	}
}
