<!DOCTYPE html>
<html lang="en">
   <head>
      <title>STUDDDIO - The Studio With 3D</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
      <link rel="stylesheet" type="text/css" href="/site/v2015.r6/css/studddio-01.css" />
   </head>
   <body>      
      <div id="info">
         <a href="http://threejs.org" target="_blank">three.js</a> - procedural 3D text by <a href="http://www.lab4games.net/zz85/blog" target="_blank">zz85</a> &amp; alteredq
         (fonts from <a href="http://typeface.neocracy.org/">typeface.js</a> and <a href="http://en.wikipedia.org/wiki/Droid_%28font%29">Droid</a>)
         <br/>type to enter new text, drag to spin the text
         <br/><span class="button" id="color">change color</span>,
         <span class="button" id="font">change font</span>,
         <span class="button" id="weight">change weight</span>,
         <span class="button" id="bevel">change bevel</span>,
         <span class="button" id="postprocessing">change postprocessing</span>,
         <a id="permalink" href="#">permalink</a>
      </div>

      <div id="menu-ajuda">
         Ajuda
      </div>

      <div id="moldura-ajuda">
         <div id="ajuda">
            <div class="div-ajuda">Pressione o botão esquerdo do mouse e o movimente para esquerda e para direita para mover o cenário no eixo X.</div>
            <div class="div-ajuda">Pressione o botão esquerdo do mouse e o movimente para cima e para baixo para mover o cenário - alternadamente - nos eixos Y e Z.</div>
            <div class="div-ajuda">Clique duas vezes o botão esquerdo do mouse para alternar, com movimentação para cima e para baixo, entre os eixos Y e Z.</div>
         </div>
      </div>

      <!--div id="moldura-ajuda">
         <div id="ajuda">
            <div class="div-ajuda">Pressione o botão esquerdo do mouse e o movimente para esquerda e para direita para mover o cenário no eixo X.</div>
            <div class="div-ajuda">Pressione o botão esquerdo do mouse e o movimente para cima e para baixo para mover o cenário - alternadamente - nos eixos Y e Z.</div>
            <div class="div-ajuda">Clique duas vezes o botão esquerdo do mouse - na área branca - para alternar, entre os eixos Y e Z, a movimentação para cima e para baixo.</div>
            <div class="div-ajuda">Clique duas vezes sobre os itens do menu para abrir o submenu correspondente.</div>
            <div class="div-ajuda">Os itens de menu <b><i>Agroindústria</i></b>, 
               <b><i>Construção e Projetos</i></b> e <b><i>Distribuição e Logística</i></b> 
               apresentam cubos com imagens relacionadas com os itens do menu.</div>
            <div class="div-ajuda">Sobreponha estes submenus para girar os cubos uns dentro dos outros.</div>
            <div class="div-ajuda">Aproxime os cubos para conferir de perto a alta resolução 
               das imagens usadas na textura dos lados do cubo.</div>
         </div>
      </div-->

      <script src="/oslib/threejs/r71/build/three.min.js"></script>
      <script src="/oslib/threejs/r72/examples/js/utils/GeometryUtils.js"></script>

      <script src="/oslib/threejs/r72/examples/js/shaders/ConvolutionShader.js"></script>
      <script src="/oslib/threejs/r72/examples/js/shaders/CopyShader.js"></script>
      <script src="/oslib/threejs/r72/examples/js/shaders/FilmShader.js"></script>
      <script src="/oslib/threejs/r72/examples/js/shaders/FXAAShader.js"></script>

      <script src="/oslib/threejs/r72/examples/js/postprocessing/EffectComposer.js"></script>
      <script src="/oslib/threejs/r72/examples/js/postprocessing/RenderPass.js"></script>
      <script src="/oslib/threejs/r72/examples/js/postprocessing/ShaderPass.js"></script>
      <script src="/oslib/threejs/r72/examples/js/postprocessing/MaskPass.js"></script>
      <script src="/oslib/threejs/r72/examples/js/postprocessing/BloomPass.js"></script>
      <script src="/oslib/threejs/r72/examples/js/postprocessing/FilmPass.js"></script>

      <script src="/oslib/threejs/r72/examples/js/Detector.js"></script>
      <script src="/oslib/threejs/r72/examples/js/controls/TrackballControls.js"></script>
      <script src="/oslib/threejs/r72/examples/js/libs/stats.min.js"></script>

      <!-- load the font files -->

      <script src="/oslib/threejs/r72/examples/fonts/gentilis_bold.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/gentilis_regular.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/optimer_bold.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/optimer_regular.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/helvetiker_bold.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/helvetiker_regular.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/droid/droid_sans_regular.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/droid/droid_sans_bold.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/droid/droid_serif_regular.typeface.js"></script>
      <script src="/oslib/threejs/r72/examples/fonts/droid/droid_serif_bold.typeface.js"></script>

      <!--script src="tquery-bundle.js"></script>
      <script src="CSS3DRenderer.js"></script-->
      
      <script src="/r6/src/common/S3dObject3D.js"></script>
      <script src="/r6/src/common/S3dMesh.js"></script>
      <script src="/r6/src/common/S3dPos.js"></script>
      <script src="/r6/src/util/S3dLinkedList.js"></script>
      <script src="/r6/src/util/S3dGeometryStyle.js"></script>
      <script src="/r6/src/util/S3dGeometryStyleChar.js"></script>
      
      <script src="/r6/src/geometry/S3dBox.js"></script>
      
      <script src="/r6/src/geometry/S3dPlane.js"></script>
      <script src="/r6/src/geometry/S3dPlaneParam.js"></script>
      <script src="/r6/src/geometry/S3dPlaneChain.js"></script>
      
      <script src="/r6/src/text/S3dText.js"></script>
      <script src="/r6/src/text/S3dTextParam.js"></script>
      <script src="/r6/src/text/S3dTextChain.js"></script>
      
      <script src="/r6/src/presentation/S3dPresentation.js"></script>
      <script src="/r6/src/presentation/S3dPresentationFrame.js"></script>
      
      <script src="/r6/src/richText/S3dRichCtrl.js"></script>
      <script src="/r6/src/richText/S3dRichChain.js"></script>
      <script src="/r6/src/richText/S3dRichChar.js"></script>
      <script src="/r6/src/richText/S3dRichText.js"></script>
      <script src="/r6/src/richText/S3dRichMemo.js"></script>
      
      <script src="/r6/src/util/S3dEditor.js"></script>
      
      <script src="/r6/src/sceneMaker/S3dSceneMaker.js"></script>
      
      <script src="/site/v2015.r6/global.js"></script>
      <script src="/site/v2015.r6/eventos.js"></script>
      <script src="/site/v2015.r6/inicio.js"></script>
      <script src="/site/v2015.r6/animacao.js"></script>
      <script src="/site/v2015.r6/principal.js"></script>
      
      <script src="/site/v2015.r6/presentation/studddioPresentation.js"></script>
      <script src="/site/v2015.r6/presentation/studddioPresentationFrame.js"></script>
      <script src="/site/v2015.r6/presentation/studddioPresentationParam.js"></script>
      <script src="/site/v2015.r6/presentation/startPresentation.js"></script>
      
      <script src="/r6/src/action/S3dAction.js"></script>
      <script src="/r6/src/action/S3dActionMove.js"></script>
      <script src="/r6/src/action/S3dActionMoveOn.js"></script>
      <script src="/r6/src/action/S3dActionMoveTo.js"></script>
      <script src="/r6/src/action/S3dActionRotate.js"></script>
      <script src="/r6/src/action/S3dActionRotateOn.js"></script>
      <script src="/r6/src/action/S3dActionRotateTo.js"></script>
      <script src="/r6/src/action/S3dActionChain.js"></script>

      <script>
         document.body.onload = function() {
            globalStudddioPresentation = true;
            globalApresentacaoLink3D = false;
            globalLinkComunicacao = false;
            globalEditText = false;
            globalShowDocPlanes = false;
            globalUseGlobalTextPool = false;
            globalUseSiteSystems = false;
            NewInit();
            Animate();
         };
      </script>
   </body>
</html>
