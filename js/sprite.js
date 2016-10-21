"use strict";

var app = app || {};

// Sprite used to draw from a spritesheet
app.Sprite = function()
{
    // Sprite made with image, position and width/height of cropped sprite
	function Sprite(image, posX, posY, tileWidth, tileHeight)
	{
		this.color = "#A2B";
		
		this.x = posX;
		this.y = posY;
		this.image = image;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		
	    this.sourceX = 0;
	    this.sourceY = 0;
	};

	var p = Sprite.prototype;
	
	// Reset the cropped area of the sprite
	p.resampleSpriteSheet = function(row, col)
	{
	    this.sourceX = row * this.tileWidth;
	    this.sourceY = col * this.tileHeight;
	};
	
	// Draw cropped area of spritesheet
	p.draw = function(ctx)
	{
		var halfW = this.tileWidth/2;
		var halfH = this.tileHeight/2;
		
		if(!this.image)
		{
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x - halfW, this.y - halfH, this.tileWidth, this.tileHeight);
		} else {
			// Draw cropped image
    	    var sourceWidth = this.tileWidth; //this.width;
    	    var sourceHeight = this.tileHeight; //this.height;
    	    var destWidth = sourceWidth;
            var destHeight = sourceHeight;
            var destX = this.x - destWidth/2;
            var destY = this.y - destHeight/2;
	        
	        //ctx.drawImage(this.image, this.x - halfW, this.y - halfH, this.width, this.height);
	        ctx.drawImage(this.image, this.sourceX, this.sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		}
	};
	
	return Sprite;

}();