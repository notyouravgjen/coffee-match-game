// draw.js
// dependencies: none
"use strict";
var app = app || {};

app.draw = {
   clear : function(ctx, x, y, w, h) {
			ctx.clearRect(x, y, w, h);
	},
	
	rect : function(ctx, x, y, w, h, col) {
			ctx.fillStyle = col;
			ctx.fillRect(x, y, w, h);
	},
	
	circle : function(ctx, x, y, r, col) {
			ctx.fillStyle = col;
			ctx.beginPath();
			ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
	},
	
	text : function(ctx, string, x, y, size, col) {
			ctx.font = 'bold '+size+'px Georgia';
			ctx.fillStyle = col;
			ctx.fillText(string, x, y);
	},
	
	backgroundSolid: function(ctx, width, height){
	    ctx.fillStyle="#94682F";
		ctx.fillRect(0,0,width,height);
	}			
};
