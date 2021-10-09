class S3dData extends RptCommonAncestor {
	
	richChainData(owner_, scene_, textArray_) {
		return {
			owner: owner_, 
			scene: scene_, 
			textArray: textArray_
		}
	}	

	actData(app_, sceneMaker_, actKit_) {
		return {
			app: app_,
			owner: app_,
			sceneMaker: sceneMaker_,
			scene: sceneMaker_.scene,
			actions: app_.actions,
			materialFarm: actKit_.materialFarm,
			fontFarm: actKit_.fontFarm,
			textSizeModelFarm: actKit_.textSizeModelFarm,
			actions: sceneMaker_.actions
		}
	}

	richCharData(
		str_, owner_, scene_, pos_, rot_, textSizeModel_, material_, cursorParam_, onCreate_) {
		return {
			str: str_,
			owner: owner_,
			scene: scene_,
			pos: pos_,
			rot: rot_,
			textSizeModel: textSizeModel_,
			material: material_,
			cursorParam: cursorParam_,
			onCreate: onCreate_
		}
	}

	textData(owner_, str_, size_, height_, pos_, material_, hover_, mirror_) {
		return {
			owner    : owner_,
			str      : str_,
			size     : size_,
			height   : height_,
			pos      : pos_,
			material : material_,
			hover    : hover_,
			mirror   : mirror_
		}
	}

	fontData(code_,family_,name_,font_) {
		return{	
			code     : code_,
			family   : family_,
			name     : name_,
			font     : font_
		}
	}

	fontStyleModelData(
		s3dFont_,curveSegments_,bevelThickness_,bevelSize_,bevelSegments_,bevelEnabled_) {
		return {
			s3dFont        : s3dFont_,
			family         : s3dFont_.name,
			curveSegments  : curveSegments_,
			bevelThickness : bevelThickness_,
			bevelSize      : bevelSize_,
			bevelSegments  : bevelSegments_,
			bevelEnabled   : bevelEnabled_
		}
	}

	textSizeModelData(
		fontStyleModel_, size_, height_, weight_, style_, hsep_, vsep_, material_, extrudeMaterial_) {
		return {
			fontStyleModel  : fontStyleModel_,
			size			: size_,
			height 			: height_,
			weight			: weight_, // normal bold
			style			: style_, // normal italic,
			hsep            : hsep_,
			vsep            : vsep_,
			material		: material_,
			extrudeMaterial : extrudeMaterial_
		}
	}

	richTextData(
		str_, owner_, scene_, pos_, rot_, textSizeModel_, material_, cursorParam_,onCreate_) {
		return {
			str: str_,
			owner: owner_,
			scene: scene_,
			pos: pos_,
			rot: rot_,
			textSizeModel: textSizeModel_,
			material: material_,
			cursorParam: cursorParam_,
			onCreate: onCreate_
		}
	}

	memoData(owner_,scene_,addLine_,textSizeModel_,material_) {
		return {
			owner: owner_,
			scene: scene_,
			addLine: addLine_,
			textSizeModel: textSizeModel_,
			material: material_
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
}
