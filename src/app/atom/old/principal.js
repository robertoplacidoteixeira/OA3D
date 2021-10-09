/*
if (!Detector.webgl)
   Detector.addGetWebGLMessage();
*/

var permalink, hex, color;

var firstLetter = true;

var 
	/*textLabel = "Roberto Plácido Teixeira",*/
	height = 20,
	size = 70,
	hover = 30,
	curveSegments = 4,
	bevelThickness = 2,
	bevelSize = 1.5,
	bevelSegments = 3,
	bevelEnabled = true,
	font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
	weight = "bold", // normal bold
	style = "normal"; // normal italic

var fontMap = {
   "helvetiker": 0,
   "optimer": 1,
   "gentilis": 2,
   "droid sans": 3,
   "droid serif": 4
}

var weightMap = {
   "normal": 0,
   "bold": 1
}

var reverseFontMap = {}

for (var i in fontMap)
   reverseFontMap[fontMap[i]] = i;

var reverseWeightMap = {}

for (var i in weightMap)
   reverseWeightMap[weightMap[i]] = i;

var glow = 0.9;

function capitalize(txt) {
   return txt.substring(0, 1).toUpperCase() + txt.substring(1);
}

function decimalToHex(d) {
   var hex = Number(d).toString(16);
   hex = "000000".substr(0, 6 - hex.length) + hex;
   return hex.toUpperCase();
}

function boolToNum(b) {
   return b ? 1 : 0;
}
