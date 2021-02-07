
class Geometria extends AncestralComum {	

	criarGeometriaEsfera(raio,segLarg,segAlt,IniPhi,FimPhi,IniTheta,FimTheta) {
	   return new THREE.SphereGeometry/*BufferGeometry*/(raio,segLarg,segAlt,IniPhi,FimPhi,IniTheta,FimTheta);
	}

	criarGeometriaCone(raioAcima,raioAbaixo,altura,segLarg,segAlt,Fechar,IniTheta,FimTheta) {
	   return new THREE.CylinderGeometry/*BufferGeometry*/(raioAcima,raioAbaixo,altura,segLarg,segAlt,Fechar,IniTheta,FimTheta);
	}

	criarGeometriaTorus(raio,tubo,segRad,segTub,arco) {
	   return new THREE.TorusGeometry(raio,tubo,segRad,segTub,arco);	
	}

}
