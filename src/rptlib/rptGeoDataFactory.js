class RptGeoDataFactory extends RptCommonAncestor {

	boxData(width_, height_, depth_, widthSegments_, heightSegments_, depthSegments_) {
		return {
			width          : width_,
			height         : height_, 
			depth          : depth_,
			widthSegments  : widthSegments_,
			heightSegments : heightSegments_,
			depthSegments  : depthSegments_
		}
	}

	planeData(own_,sce_,w_,h_,ws_,hs_,img_,mc_,pos_,rot_,tex_,hov_,mir_) {
		return {
			owner: own_,
			scene: sce_,
			width: w_,
			height: h_,
			widthSegments: ws_,
			heightSegments: hs_,
			img: img_,
			materialParam: mc_,
			pos: pos_,
			rot: rot_,
			texture: tex_,
			hover: hov_,
			mirror: mir_
		}
	}

	sphereData(radius_,widthSegments_,heightSegments_,phiStart_,phiLength_,thetaStart_,thetaLength_) {
		return {
			radius         : radius_,
			widthSegments  : widthSegments_,
			heightSegments : heightSegments_,
			phiStart       : phiStart_,
			phiLength      : phiLength_,	
			thetaStart     : thetaStart_,	
			thetaLength    : thetaLength_
		}
	}

	geoCylinderData(radiusTop_,radiusBottom_,height_,radiusSegments_,heightSegments_,openEnded_,thetaStart_,thetaLength) {
		return {
			radiusTop      : radiusTop_,    
			radiusBottom   : radiusBottom_,
			height         : height_,
			radiusSegments : radiusSegments_,
			heightSegments : heightSegments_,
			openEnded      : openEnded_,
			thetaStart     : thetaStart_,   
			thetaLength    : thetaLength_  
		}
	}

	textGeometryData(tsm) {
		var fsm = tsm.fontStyleModel;
		return {
			font            : fsm.s3dFont.font,
			size            : tsm.size,
			height          : tsm.height,
			weight    	    : tsm.weight, 
			style           : tsm.style, 
			curveSegments   : fsm.curveSegments,
			bevelThickness  : fsm.bevelThickness,
			bevelSize       : fsm.bevelSize,
			bevelSegments   : fsm.bevelSegments, 
			bevelEnabled    : fsm.bevelEnabled, 
			material        : fsm.material,
			extrudeMaterial : fsm.extrudeMaterial
		}
	}

}
