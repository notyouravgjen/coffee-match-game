"use strict";

var app = app || {};

// Graphical Buttons on menu and hud
// (Consists of rectangle and text)
app.Button= function()
{
	function Button(posX, posY, width, height, color, text, textSize)
	{
		this.x = posX;
		this.y = posY;
		this.width = width;
		this.height = height;
		this.color = color;
		this.text = text;
		this.textSize = textSize
	};

	var p = Button.prototype;
	
	// Draw the button (background and text)
	p.draw = function(ctx)
	{
		var halfW = this.width/2;
		var halfH = this.height/2;
		
		// Background
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
		
		// Text
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(ctx, this.text, this.x, this.y, this.textSize, "white");
	};
	
	return Button;

}();
