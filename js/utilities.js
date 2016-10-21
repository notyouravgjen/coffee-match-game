// utilities.js
// dependencies: none
"use strict";
var app = app || {};

app.utilities = function(){

	/*
	Function Name: clamp(val, min, max)
	Return Value: returns a value that is constrained between min and max (inclusive) 
	*/
	function clamp(val, min, max){
		return Math.max(min, Math.min(max, val));
	}
	
	
	/*
		Function Name: getRandom(min, max)
		Return Value: a floating point random number between min and max
	*/
	function getRandom(min, max) {
	  return Math.random() * (max - min) + min;
	}
	
	
	/*
		Function Name: getRandomInt(min, max)
		Return Value: a random integer between min and max
	*/
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// Function Name: getMouse(e)
	// returns mouse position in local coordinate system of element
	function getMouse(e){
	    // Tweaks to this code came from here:
	    // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/
		var mouse = {};
        var rect = app.game.canvas.getBoundingClientRect();
        
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
		
		return mouse;
	}
	
	// Calculates whether a given point is inside a rectangle or not
	function pointInsideRect(x, y, I)
    {
        if(x > I.x + I.width/2 || x < I.x - I.width/2 || y > I.y + I.height/2 || y < I.y - I.height/2)
        {
            return false;
        }
        
        return true;
    }
    
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [rev. #1]
    function shuffle(v)
    {
        for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
        return v;
    }
	
	return{
		clamp : clamp,
		getRandom : getRandom,
		getRandomInt : getRandomInt,
		getMouse : getMouse,
		pointInsideRect : pointInsideRect,
		shuffle: shuffle
	};
}();
