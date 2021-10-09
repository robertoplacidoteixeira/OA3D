class RptModelLoaderFactory extends RptCommonAncestor  {
	
	/*
	clone(container_,scene_) {
		for (var sc = 0; sc < posns.length; sc++) {
			var scale = posns[sc].scale;
			var rotation = posns[sc].rotation;
			var posn = posns[sc].position;
			var model3d = new THREE.Object3D();
			//clone main obj
			model3d = container_.clone();
			//clone obnj meshes
			model3d.traverse(function (object) {
				if (object.isMesh) {
					object.material = object.material.clone();
				}
			});

			model3d.scale.x = parseFloat(scale.x);
			model3d.scale.y = parseFloat(scale.y);
			model3d.scale.z = parseFloat(scale.z);

			//container_.position = new THREE.Vector3(posn.x, posn.y, posn.z);
			model3d.position.x = posn.x;
			model3d.position.y = posn.y;
			model3d.position.z = posn.z;

			model3d.rotation.x = rotation._x;
			model3d.rotation.y = rotation._y;
			model3d.rotation.z = rotation._z;

			var color = '999933';//default grey
			if (!posns[sc].color) {
				var rnd = (Math.random() * 100);
				if (rnd >90) {
					console.log('blue');
					posns[sc].color = '456F87';
				} else if (rnd > 50) {
					console.log('red');
					posns[sc].color = 'C04B0C';//
				}else if (rnd > 20) {
					console.log('yellow');
					posns[sc].color = 'F3CD8B';
				}else {
					console.log('grey');
					posns[sc].color = color;

				}

			}
			model3d.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					//var c = hexToRgb(color);
					var c = hexToRgb(posns[sc].color);
					child.material.color = new THREE.Color("rgb(" + c.r + ", " + c.g + ", " + c.b + ")");
					//child.material.emissive.setHex(0xdaa514);
					//child.material.opacity = 1 + Math.sin(new Date().getTime() * .0025);
					child.castShadow = true; //default is false
					child.receiveShadow = false; //default
				}
			});
			if (!model3d.userData.color) {
				model3d.userData.color = posns[sc].color;
			};

			model3d.name = posns[sc].name;

			group = new THREE.Group();
			scene.add(group);

			var textMaterial = new THREE.MeshBasicMaterial({
				color: new THREE.Color(1, 1, 1),
				side: THREE.DoubleSide,
				wireframe: false
			});

			var textShapes = font.generateShapes(model3d.name, .4);

			var geometry = new THREE.ShapeBufferGeometry(textShapes);
			geometry.computeBoundingBox();

			var text = new THREE.Mesh(geometry, textMaterial);

			text.position.x = posn.x - ((geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2);
			text.position.y = posn.y + 5;
			text.position.z = posn.z + 0;

			group.add(text);
			group.add(model3d);


			containers.push(model3d);

			scene.add(model3d);
		}
	}
	*/
	
	obj(scene_, mats_, objCallback_) {
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(mats_);
		objLoader.setPath(objDir_);
		objLoader.load(ObjFile, function (container_) {
			if (objCallback) objCallback_(container_); 
			else scene_.add(container_);
		}, onProgress, onError);
	}
	
	mtl(scene_, mtlDir_, mtlFile_ , objDir_ , objFile_, tranparency_, opacity_, objCallback) {
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath(mtlDir_);
		mtlLoader.load(mtlFile, function (mats_) {
			mats_.preload();
			//var material = new THREE.MeshFaceMaterial(mats_);
			mats_.transparent = transparency_ < 1;
			mats_.transparency = transparency_;
			mats_.opacity = opacity_;
			//material.depthWrite = false;
			//
			this.obj(scene_, mats_, objCallback)
		});
	}
	
	/*
	tdsCallback(object_) {
		object_.traverse(function(child_) {
			if (child_.isMesh) {
				child_.material.specular.setScalar( 0.1 );
				child_.material.normalMap = normal;
			}
		} );
		scene_.add(object_);
	}
    */
	tds(scene_, dir_ , file_, tdsCallback_) {
		const loader = new TDSLoader();
		loader.setResourcePath(dir_);
		loader.load(file, function (object_) {
			if (tdsCallback_) tdsCallback_(object_,scene_);
			else scene_.add(object_);
		});
	}

	glft(scene_, dir_, file_, glftCallback_) {
		const loader = new GLTFLoader();
		loader.load(dir + file, function (object_) {
			if (glftCallback_) glftCallback_(object_) ;
			else scene_.add(object_.scene);
		}, undefined, function ( error ) {
			console.error( error );
		} );	
	}
	
	/*
	tmfCallback(object_,scene_) {
		object.quaternion.setFromEuler( new THREE.Euler( - Math.PI / 2, 0, 0 ) ); 	// z-up conversion
		object.traverse( function ( child ) {
			child.castShadow = true;
		} );
		scene.add( object );
	}
	*/
	
	tmf(scene, dir_, file_, tmfCallback_) { /* .3mf */
		const loader = new ThreeMFLoader( manager );
		loader.load(file + dir, function (object_) {
			if (tmfCallback_) tmfCallback_(object_,scene_) ;
		} );
	}
	
	/*
	callbackCollada(collada_,scene_) {
		const avatar = collada.scene_;
		const animations = avatar.animations;
		avatar.traverse(function(node_) {
			if (node.isSkinnedMesh) node.frustumCulled = false;
		});
		var mixer = new THREE.AnimationMixer(avatar);
		mixer.clipAction(animations[0]).play();
	}
	*/
	
	collada(scene_, dir_, file_, callback_) { /* .dae */
		const loader = new ColladaLoader();
		loader.load( file + dir, function(collada_) {
			if (callback_) callback_(object_,scene_); 
			else scene_.add(object);
		});
	}
}
