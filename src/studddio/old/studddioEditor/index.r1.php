<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> 
<html>
   <head>
      <meta http-equiv="Content-Language" content="en" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Studddio Editor</title>
      <script type="text/javascript" src="/oslib/js/jquery/jquery-1.3.js"></script>
      <script type="text/javascript" src="/oslib/js/splitter/splitter.js"></script>

      <!-- General page styles (not critical to the demos) -->
      <link rel="stylesheet" type="text/css" href="/oslib/js/splitter/splitter.css" />

      <style type="text/css" media="all">
         html, body {
            margin: 0;			/* Remove body margin/padding */
            padding: 0;
            overflow: hidden;	/* Remove scroll bars on browser window */
         }
         #header { padding: 1em; }

         #MySplitter {
            border: 3px solid #669;
            min-width: 500px;	/* Splitter can't be too thin ... */
            min-height: 300px;	/* ... or too flat */
            height: 100%;
         }
         #MySplitter .Pane {
            overflow: auto;
            background: #def;
         }

         /* Splitbar styles; these are the default class names */

         .vsplitbar {
            width: 6px;
            background: #669 url(img/vgrabber.gif) no-repeat center;
         }
         .vsplitbar:hover, .vsplitbar.active {
            background: #c66 url(img/vgrabber.gif) no-repeat center;
            opacity: 0.7;
            filter: alpha(opacity=70); /* IE */
         }
         .hsplitbar {
            height: 6px;
            background: #669 url(img/hgrabber.gif) no-repeat center;
         }
         .hsplitbar.active, .hsplitbar:hover {
            background: #c66 url(img/hgrabber.gif) no-repeat center;
            opacity: 0.7;
            filter: alpha(opacity=70); /* IE */
         }
      </style>
      <script type="text/javascript">
         $().ready(function() {
            // Vertical splitter. Set min/max/starting sizes for the left pane.
            $("#MySplitter").splitter({
               splitVertical: true,
               outline: true,
               sizeLeft: 150, minLeft: 100, maxLeft: 200,
               anchorToWindow: true,
               accessKey: "L"
            });
            // First horizontal splitters, nested in the right pane of the vertical splitter.
            $("#TopSplitter").splitter({
               splitHorizontal: true,
               outline: true,
               sizeTop: 100, minTop: 50, maxTop: 200,
               accessKey: "V"
            });
            // Second horizontal splitter, nested in bottom pane of first horizontal splitter
            $("#BottomSplitter").splitter({
               splitHorizontal: true,
               outline: true,
               sizeBottom: 120, minTop: 50,
               accessKey: "J"
            });
         });
      </script>
   </head>
   <body>

      <div id="header">
         <h1>4-Pane Splitter Layout</h1>
         <p>Here is a 4-pane layout with the splitter occupying all the area below this header.
            The page scroll bars have been removed since all the content is inside the splitter, and the
            splitter is anchored to the bottom of the window using the .</p>
         <p>
            <a href="index.html">See the splitter documentation</a>
         </p>
      </div>

      <div id="MySplitter">

         <div class="Left Pane">
            <p>This is the left pane of the 4-pane splitter. It has been limited to a range of 100 to 300 pixels wide with the <code>minLeft</code> and <code>maxLeft</code> properties of the plugin. It starts at 150 pixels wide because of <code>sizeLeft</code> property.</p>
            <p>All of the other panes are created by nesting two horizontal splitters in the right pane of this vertical splitter.</p>
            <p>To move the vertical splitbar using the keyboard, use the "L" accelerator key (Alt-Shift-L in IE and Firefox).</p>
         </div> 

         <div id="TopSplitter"> 

            <div class="Top Pane">
               <p>This is the top-right horizontal pane. It tries to stay at its current size if you resize the bottom horizontal splitbar.</p>
               <p>The splitbars are keyboard-accessible. Use <kbd>Alt-Shift-V</kbd> to select the vertical splitbar, or <kbd>Alt-Shift-H</kbd>  for the horizontal one. Then use the arrow keys to move the bar. The plugin lets you specify any key for the access key, but be sure to test on all browsers in case they reserve those keystrokes.</p>
               <p>To move the horizontal splitbar below this pane using the keyboard, use the "V" accelerator key (Alt-Shift-V in IE and Firefox).</p>
            </div>

            <div id="BottomSplitter">
               <div class="Middle Pane">
                  <p>This is the middle-right pane, which starts at a height that varies depending on the height of the browser window. Since the top pane has <code>sizeTop: 100</code> and the bottom pane has <code>sizeBottom: 120</code>, this pane gets whatever is left over. The overall size of the splitter has been set to <code>min-height: 300px</code> in the style sheet, so it will be at least 80 pixels high.</p>
               </div>
               <div class="Bottom Pane">
                  <p>This is the bottom-right pane of the splitter. It tries to stay at its current size if you resize the top horizontal splitbar.</p>
                  <p>To move the horizontal splitbar above this pane using the keyboard, use the "J" accelerator key (Alt-Shift-J in IE and Firefox).</p>
               </div>
            </div>

         </div> 

      </div> <!-- #MySplitter -->

   </body>
</html>