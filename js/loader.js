/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the bubbles game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS
app.KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

app.IMAGES = {
    coffeeSprites: "images/coffeeSpriteSheet.png",
	coffeeSpritesT: "images/coffeeSpriteSheetT.png",
	menuImage: "images/menu_image.png"
 };

// properties of app that will be accessed by the game.js module
app.animationID = undefined;
app.paused = false;

// app.keydown array to keep track of which keys are down
// this is called a "key daemon"
// blastem.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
app.keydown = [];

// the Modernizr object is from the modernizr.custom.js file
Modernizr.load(
	{ 
		// load all of these files
		load : [
			'js/polyfills.js',
			'js/utilities.js',
			'js/game.js',
			'js/draw.js',
			'js/sprite.js',
			'js/tile.js',
			'js/button.js',
			'js/orderstation.js',
			app.IMAGES['coffeeSprites'],	// sprites with background
			app.IMAGES['coffeeSpritesT'],	// sprites transparent
			app.IMAGES['menuImage']
		],
		
		// when the loading is complete, this function will be called
		complete: function(){
			
			// set up event handlers
			window.onblur = function(){
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				app.keydown = []; // clear key daemon
				createjs.Sound.stop();
				// call update() so that our paused screen gets drawn
				app.game.update();
			};
			
			window.onfocus = function(){
				app.paused = false;
				cancelAnimationFrame(app.animationID);
				app.game.startSoundtrack();
				// start the animation back up
				app.game.update();
			};
			
			// event listeners
			window.addEventListener("keydown",function(e){
				//console.log("keydown=" + e.keyCode);
				app.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				//console.log("keyup=" + e.keyCode);
				app.keydown[e.keyCode] = false;
			});
			
			window.addEventListener("click",function(e){
			    var mouse = app.utilities.getMouse(e);
			    app.game.processClicks(mouse);
			});
			
			window.addEventListener("touchstart",function(e){
				e.preventDefault();
				var touchobj = e.changedTouches[0];
			    
				var mouseSim = {};
				var rect = app.game.canvas.getBoundingClientRect();
				
				mouseSim.x = parseInt(touchobj.clientX) - rect.left;//e.clientX - rect.left;
				mouseSim.y = parseInt(touchobj.clientY) - rect.top;//e.clientY - rect.top;
						
				app.game.processClicks(mouseSim);
			}, false);
			
			// soundtrack: http://www.pacdv.com/sounds/free-music-10.html
			createjs.Sound.registerSound({id:"soundtrack", src:"sounds/bgmusic.mp3"});
			
			// http://www.soundjay.com/ 
			createjs.Sound.registerSound({id:"badSound", src:"sounds/bad.mp3"}); // Button Sound 10
			createjs.Sound.registerSound({id:"goodSound", src:"sounds/good.mp3"}); // Button Sound 37			
			
			createjs.Sound.addEventListener("fileload", handleFileLoad);
			
			function handleFileLoad(e)
			{
				console.log("Preloaded Sound", e.id, e.src);
				if(e.id == "soundtrack") app.game.startSoundtrack();
			}
			
			// start game
			app.game.init();
		} // end complete
		
	} // end object
); // end Modernizr.load
