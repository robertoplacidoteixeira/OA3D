class OA3dApp extends AtomApp {
	
	afterCreate() {
		super.afterCreate();
		$("#id-div-ajuda").load("src/app/atom/html/293-help.html");
	}

	createScenery() {
		//this.scenery = new AtomCloudPointsSceneryLayout({app: this});
		this.scenery = new AtomPointsSceneryLayout({app: this});
		//this.scenery = new AtomPointsSceneryLayout({app: this, pointSize: 0.1});
	}

}
