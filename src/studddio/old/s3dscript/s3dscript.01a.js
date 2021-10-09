var v = 'a';
;

function getParamArray(pStr) {

}

function prepareParam(pParams, pParamName) {

}

function prepareVectorParam(params, paramName) {
   if (paramName === "rot") {

   }
}

function sphere(params) {
   var param = {
      geoid: pGeoid,
      pos: params['rot'],
      rot: pRot,
      sca: pSca,
      tra: pTra,
      geo: geometry
   };
   var sphere = new S3D.Sphere();
   return sphere();
}

function box() {

}

var s1 = sphere(pos = {x: 10, y: 20, z: 30}); // []]'pos 10 0 1 rot 8 0 0 mat phong color #ffffff'

var s1 = sphere(['pos x:10', 'rot y:3']); // []]'pos 10 0 1 rot 8 0 0 mat phong color #ffffff'

function material() {

}

function mat() {

}
