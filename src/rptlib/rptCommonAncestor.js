class RptCommonAncestor {
	constructor(data_) {
		this.data = (data_) ? data_ :  {}
		this.prepare();
		this.create();
	}

	generateId() {
		function getObjectId(data) {
			var id = "";
			var aux;
			if (data)
				Object.keys(data).forEach(function(name_) {
					var nameData = data[name_];
					if ((typeof nameData) === "object") 
						if (nameData instanceof RptCommonAncestor) 
							aux = nameData.id;
						else
							if (nameData instanceof Array) 
								aux = ""
							else
								aux = getObjectId(nameData);
					else
						aux = nameData 
					id += name_ + aux;
				});
			return id;
		}
		return getObjectId(this.data);
	}

	prepare() {
		this.beforePrepare();
		this.duringPrepare();
		this.afterPrepare();
	}

	beforePrepare() {
	}

	duringPrepare() {
		var t = this;
		var d = t.data;
		Object.keys(d).forEach(
			function(_nomeObj) {
				t[_nomeObj] = d[_nomeObj];
			}
		);
	}

	afterPrepare() {
		this.id = this.generateId();;
	}

	create() {
		this.beforeCreate();
		this.duringCreate();
		this.afterCreate();
	}

	beforeCreate() {
	}

	duringCreate() {
	}
	
	afterCreate() {
	}
	
	destroy() {
		this.beforeDestroy();
		this.duringDestroy();
		this.afterDestroy();
	}

	beforeDestroy() {
	}

	duringDestroy() {
	}
	
	afterDestroy() {
	}
	
	add(parent,object) {
		parent.add(object);
		return object;
	}

	remove(parent,child) {
		if (child.geometry) {
			child.geometry.dispose();
			//child.material.dispose();
		}
		parent.remove(child);
		child = undefined;
		return undefined;
	}
}
