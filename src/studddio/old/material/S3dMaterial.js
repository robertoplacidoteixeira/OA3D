/* 
 @author: Betobyte / www.studddio.com
 */

S3D.S3dMaterial = function() {
   this.__defineGetter__("color", this.getColor);
   this.__defineSetter__("color", this.setColor);
   this.__defineGetter__("opacity", this.getOpacity);
   this.__defineSetter__("opacity", this.setOpacity);
   this.__defineGetter__("transparent", this.getTranaparent);
   this.__defineSetter__("transparent", this.setTranaparent);
};

S3D.S3dMaterial.prototype.clone = function(matParam) {
   if (S3dGlobal.engine === engineTHREEJS) {
      var clone = s3dClone = new S3D.S3dMaterial({clone: this.material});
      if (matParam.color) {
         clone.setColor(matParam.color);
      }
      if (matParam.opacity) {
         clone.setOpacity(matParam.opacity);
      }
      if (matParam.transparent) {
         clone.setTransparent(matParam.transparent);
      }
      return clone;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
   return null;
};

S3D.S3dMaterial.prototype.getColor = function() {
   if (S3dGlobal.engine === engineTHREEJS) {
      return this.material.color;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};

S3D.S3dMaterial.prototype.setColor = function(pColor) {
   if (S3dGlobal.engine === engineTHREEJS) {
      this.material.setColor = pColor;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};

S3D.S3dMaterial.prototype.getOpacity = function() {
   if (S3dGlobal.engine === engineTHREEJS) {
      return this.material.opacity;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};

S3D.S3dMaterial.prototype.setOpacity = function(pOpacity) {
   if (S3dGlobal.engine === engineTHREEJS) {
      this.material.opacity = pOpacity;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};

S3D.S3dMaterial.prototype.getTransparent = function() {
   if (S3dGlobal.engine === engineTHREEJS) {
      return this.material.transparent;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};

S3D.S3dMaterial.prototype.setTransparent = function(pTransparent) {
   if (S3dGlobal.engine === engineTHREEJS) {
      this.material.transparent = pTransparent;
   } else if (S3dGlobal.engine === engineBABYLON) {
   }
};
