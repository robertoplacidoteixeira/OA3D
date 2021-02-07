class GeometriaNucleo extends Geometria {

	criarGeometria() {
		var geometria = new THREE.SphereGeometry/*BufferGeometry*/(this.dados.raio,50,50,0,doisPi,0,doisPi);
	}
}	
