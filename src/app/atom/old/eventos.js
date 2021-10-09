function onDocumentMouseDown(event) {
   event.preventDefault();

   document.addEventListener('mousemove', onDocumentMouseMove, false);
   document.addEventListener('mouseup', onDocumentMouseUp, false);
   document.addEventListener('mouseout', onDocumentMouseOut, false);

   app.sceneMaker.onDocumentMouseDown(event);
}

function onWindowResize() {
   app.sceneMaker.onWindowResize(event);
}

function onDocumentDblClick(event) {
	app.sceneMaker.onDocumentDblClick(event);
	// globalMoveY = !globalMoveY;
	if (tp3dGlobal.tp3dGlobal.useTextPool) {
	} else if (tp3dGlobal.useSiteSystems) {
		TestAlfanumericMenu(event);
		TestGeometryMenu(event);
		TestDocumentMenu(event);
		TestEducacionalMenu(event);
		TestFinancialServicesMenu(event);
	} else {
		/*
		TestRedMenu(event);
		TestGreenMenu(event);
		TestBlueMenu(event);
		*/
	}
}

function onDocumentMouseWheel(event) {
   app.sceneMaker.onDocumentMouseWheel(event);
}

function onDocumentMouseMove(event) {
   app.sceneMaker.onDocumentMouseMove(event);
}

function onDocumentMouseUp(event) {
   document.removeEventListener('mousemove', onDocumentMouseMove, false);
   document.removeEventListener('mouseup', onDocumentMouseUp, false);
   document.removeEventListener('mouseout', onDocumentMouseOut, false);
   app.sceneMaker.onDocumentMouseUp(event);
}

function onDocumentMouseOut(event) {
   document.removeEventListener('mousemove', onDocumentMouseMove, false);
   document.removeEventListener('mouseup', onDocumentMouseUp, false);
   document.removeEventListener('mouseout', onDocumentMouseOut, false);
   app.sceneMaker.onDocumentMouseOut(event);
}

function onDocumentTouchStart(event) {
   app.sceneMaker.onDocumentTouchStart(event);
}

function onDocumentTouchMove(event) {
   app.sceneMaker.onDocumentTouchMove(event);
}

function onDocumentKeyDown(event) {
   app.sceneMaker.onDocumentKeyDown(event);
   if (tp3dGlobal.editText) {
      tp3dGlobal.obj3dEditor.processKey(event);
   }
}

function onDocumentKeyPress(event) {
   app.sceneMaker.onDocumentKeyPress(event);
   if (tp3dGlobal.editText) {
      tp3dGlobal.obj3dEditor.processChar(event);
   }
}
