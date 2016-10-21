"use strict";

var app = app || {};

// Constants
var BLANK_X = 0;
var BLANK_Y = 1;

// Tile used for the game board
app.Tile = function()
{
    // New Tile made with image, canvas coords, spritesheet coords, and size
	function Tile(image, posX, posY, tileSize)
	{   
        this.x = posX;
        this.y = posY;
        this.width = tileSize;
        this.height = tileSize;
        
        this.sprite = new app.Sprite(image, posX, posY, tileSize, tileSize);
        
        this.revealX = 0;
        this.revealY = 0;
        this.isFaceUp = false;
	};

	var p = Tile.prototype;
	
	// Draw the tile's current sprite to the screen
	p.draw = function(ctx)
	{
	    this.sprite.draw(ctx);
	};
	
	// Sets the portion of the spritesheet to "reveal" when flipped
	p.setReveal = function(tx, ty)
	{
	    this.revealX = tx;
	    this.revealY = ty;
	};
	
	// Clears the sprite
	p.setInvisible = function()
	{
	    this.sprite.resampleSpriteSheet(BLANK_X, BLANK_Y);
	};
	
	p.isInvisible = function()
	{
		return(this.sprite.sourceX == BLANK_X * this.width && this.sprite.sourceY == BLANK_Y * this.height);
	};
	
	// Flips the tile face-up
	p.flipTile = function()
	{
	    if(!this.isFaceUp)
	    {
	        this.sprite.resampleSpriteSheet(this.revealX, this.revealY);
	        this.isFaceUp = true;
	    }
	};
	
	// Puts the tile face-down
	p.setFaceDown = function()
	{
	    this.sprite.resampleSpriteSheet(0, 0);
	    this.isFaceUp = false;
	};
	
	// Returns true if identical to the other tile
	p.compareTile = function(other)
	{
	    return (this.revealX == other.revealX && this.revealY == other.revealY);
	};
	
	return Tile;

}();