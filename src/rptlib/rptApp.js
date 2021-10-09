class RptApp extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.scenery = undefined;
		this.act = undefined
		this.autoRotacionar = false;
	}

	afterPrepare() {
		super.afterPrepare();
		this.createScenery();
		this.createSceneMaker();
		/*this.prepareEvents();*/
	}

	afterCreate() {
		super.afterCreate();
		if (window.janela) window.janela.criarBotaoFechar("fechar.32x32.01a.png",32,32);
	}
	
	createSceneMaker() {
		this.sceneMaker = new RptSceneMaker({
			app: this,
			controlType: $g.controlTypes.rotational,
			idContainer: this.idContainer
		});
	}

	createScenery() {
	}

	animate() {
		if (this.act) this.act.actions.exec();
		this.sceneMaker.animate(this.getRenderCallback());
		return true;
	}
	
	getRenderCallback() {
		return null;
	}
}
