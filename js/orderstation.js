"use strict";

var app = app || {};

// "Order," object which consists of an i.d. and a tile
// (this is meant to be treated like a small class or struct.
// its major purpose is to hold variables)
app.Order = function(){
    // New Order made with sprite and i.d.
	function Order(sprite, timer){
        this.sprite = sprite;	// for drawing
		this.timer = timer;
	};
	var p = Order.prototype;
	
	// Draw the sprite and timer text
	p.draw = function(ctx){
		// Draw sprite
		this.sprite.draw(ctx);
		// Draw text
		app.draw.text(ctx, Math.floor(this.timer), this.sprite.x+25, this.sprite.y+35, 15, "yellow");
	};
	
	// Compare to a given tile to see if identical
	p.compareToTile = function(tile){
		return(tile.revealX * tile.width == this.sprite.sourceX && tile.revealY * tile.height == this.sprite.sourceY);
	}
	return Order;
}();

// The table that displays coffee orders
app.orderStation = {
  
	// Draw variables
	x : 120,
	y : 240,
	width: 100,
	height : 300,
	radius: 20,
	color : "#C499BF",
	maxOrders : 3,
	yOffset : 90,
	spacing : 90,
	
	// Data variables
	orders : [], // treat as a queue
	
	// Adds a new order to the queue of customers
	addOrder : function(orderSprite, timer)
	{
		if(this.orders.length < this.maxOrders)
		{
			// make the order
			var order = new app.Order(orderSprite, timer);
		
			// Set the drawing data...	
			var posY = (this.y - this.yOffset) + this.orders.length * this.spacing;
			
			// And add the sprite to the draw list
			order.sprite.x = this.x;
			order.sprite.y = posY;
			this.orders.push(order);
		}
	},
	
	// Remove all orders (for game over)
	clearOrders: function()
	{
		this.orders = [];
	},
	
	// Check a cleared tile for a match with any of the orders
	completeOrder : function(tile)
	{
		// Check the match against all visible orders
		for(var i=0; i<this.orders.length; i++)
		{
			// Compare to see if the tiles match the order
			if(this.orders[i].compareToTile(tile))
			{
				// Remove from the table
				var score = this.orders[i].timer;
				this.removeAndShift(i);
				
				return Math.floor(score);
			}
		}
		
		return 0;
	},
	
	updateTimers : function(dt)
	{
		// Update timers
		for(var i=0; i<this.orders.length; i++)
		{
			this.orders[i].timer -= dt;
			
			if(this.orders[i].timer < 0)
			{
				this.removeAndShift(i);	
				return true;
			}
		}
		return false;
	},
	
	removeAndShift : function(i)
	{
		// At position i, remove 1
		this.orders.splice(i, 1);
		
		// Shift order y-position
		for(var j=i; j<this.orders.length; j++)
		{
			this.orders[j].sprite.y -= this.yOffset;
		}
	},
  
	draw : function(ctx)
	{
		var halfW = this.width/2;
		var halfH = this.height/2;
		var x = this.x - halfW;
		var y = this.y - halfH;
		
		// - Background -
		// Rounded corners source:
		// http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
		ctx.beginPath();
		ctx.moveTo(x+this.radius, y);
		ctx.arcTo(x + this.width, y, x + this.width, y + this.height, this.radius);
		ctx.arcTo(x + this.width, y + this.height, x, y + this.height, this.radius);
		ctx.arcTo(x, y + this.height, x, y, this.radius);
		ctx.arcTo(x, y, x + this.width, y, this.radius);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();
		
		// Draw the three (or less) visible orders
		for(var i=0; i<this.orders.length; i++)
		{
			this.orders[i].draw(ctx);
		}
	}
	
};
