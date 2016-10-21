// game.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.game = {
	// CONSTANT properties
	WIDTH : 640,
	HEIGHT: 480,
	ROWS: 4,
	COLS: 4,
	STATE_MENU: 0,
	STATE_GAME: 1,
	STATE_END: 2,
	STATE_INSTRUCTIONS: 3,
	T_WIDTH: 98, // tile width
	
	// screen elements
	canvas : undefined,
	ctx :  undefined,
	coffeeSprites: undefined,
	coffeeSpritesT: undefined,
	menuImage: undefined,
	menuSprite: undefined,
	tiles: [],
	selectedTile1: undefined,
	selectedTile2: undefined,
	startButton: undefined,
	instructionsButton: undefined,
	instructionsText: [],
	endButton: undefined,
	menuButton: undefined,
	pauseButton: undefined,
	
	// game properties
	gameState: undefined,
	dt: 1/60.0, // "delta time"
	score: 0,
	lifeCount: 3,
	
	// difficulty properties
	difficultyTimer: 0, // when to update difficulty
	nextDifficultyUpdate: 10,
	difficultyStep: 5,
	
	maxSpawn: 1500, // spawns
	minSpawn: 400,
	spawnStep: 50,
	coffeeSpawn: 0,
	
	maxTimer: 60,
	minTimer: 15,
	coffeeTimerStep: 5,
	coffeeTimer: 0,
	
	
	// Initialization functions ---------------------------------------------------
	init : function() {	
		// get the canvas and context
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		// Set the game state and timers
		this.gameState = this.STATE_MENU;
		this.coffeeSpawn = this.maxSpawn;
		this.coffeeTimer = this.maxTimer;
		
		// Init assets and game board
		this.initAssets();
		this.generateTiles();
        this.shuffleBoard();
		
		// begin the game loop
		this.update();
    },
	
	// Initialize assets such as images, buttons, and sounds
	initAssets: function()
	{
		// Images
		var image = new Image();
		image.src = app.IMAGES['coffeeSprites'];
		this.coffeeSprites = image;
		
		var image2 = new Image();
		image2.src = app.IMAGES['coffeeSpritesT'];
		this.coffeeSpritesT = image2;
		
		var image3 = new Image();
		image3.src = app.IMAGES['menuImage'];
		this.menuImage = image3;
		this.menuSprite = new app.Sprite(image3, 180, 280, 153, 226);
		
		this.instructionsText[0] = "It's a busy day at the coffee shop!";
		this.instructionsText[1] = "Serve orders to customers by finding the two";
		this.instructionsText[2] = "matching tiles on the board. Serve the order before its";
		this.instructionsText[3] = "timer runs out or your customers will be displeased!";
		this.instructionsText[4] = "The board reshuffles when it is half-empty.";
	
		// Buttons
		this.startButton = new app.Button(412, 250, 250, 75, "#6B381F", "Start", 45);
		this.instructionsButton = new app.Button(412, 340, 250, 75, "#6B381F", "Instructions", 35);
		this.endButton = new app.Button(590, 25, 60, 25, "#6B381F", "End", 15);
		this.menuButton = new app.Button(this.WIDTH/2, 380, 150, 65, "#6B381F", "Menu", 35);
		this.pauseButton = new app.Button(520, 25, 60, 25, "#6B381F", "Pause", 15);
	},
	
	// Creates tile objects for the screen
    generateTiles: function(){
        // 4x4 board of tiles
        for(var i=0; i<this.ROWS; i++)
        {
            for(var j=0; j<this.COLS; j++)
            {
                var spacing = 100;  // space between one card and the next (not counting card dimensions)
                var offX = 260;     // offset from the canvas edge
                var offY = 100;
                var posX = spacing * i + offX; // position on the canvas
                var posY = spacing * j + offY;
            
                // Create the tile and add it to the array
                var tile = new app.Tile(this.coffeeSprites, posX, posY, this.T_WIDTH);
                this.tiles.push(tile);
            }
        }
    },
	
	// Helper functions ---------------------------------------------------------------------
		
	// Puts an order on the order table
	newRandomOrder: function()
	{
		// Find a random tile
		var i = app.utilities.getRandomInt(0, this.tiles.length-1);
		var t = this.tiles[i];
		
		// Create a copy of the sprite and send it over to the order station
		var tempSprite = new app.Sprite(this.coffeeSpritesT, 0, 0, this.T_WIDTH, this.T_WIDTH);
		tempSprite.resampleSpriteSheet(t.revealX, t.revealY); // set the image crop
		app.orderStation.addOrder(tempSprite, Math.floor(this.coffeeTimer) ); // populate the table
	},
    
    // Rearranges the order of the tiles on the board
    shuffleBoard: function(){
        // The data that will appear on the board
        var tileData = [
            [1, 0], [2, 0], [3, 0], [4, 0],
            [1, 1], [2, 1], [3, 1], [4, 1],
            [1, 0], [2, 0], [3, 0], [4, 0],
            [1, 1], [2, 1], [3, 1], [4, 1]
        ];
        
        // The order of the data before shuffling
        var tileOrder = [];
        for(var i=0; i < (this.ROWS * this.COLS); i++)
        {
            tileOrder[i] = i;
        }
        // Get a shuffled order to put data in
        tileOrder = app.utilities.shuffle(tileOrder);
        
        // Rearrange the data according to the new order
        var newTileData = [];
        for(var i=0; i<tileData.length; i++)
        {
            newTileData[i] = tileData[tileOrder[i]];
        }
        tileData = newTileData;
        
        // Set the "reveal" of the tiles using the new order
        // (this involves resampling the sprite sheet for the new data)
        for(var i=0; i<this.tiles.length; i++)
        {
            this.tiles[i].setReveal(tileData[i][0], tileData[i][1]);
        }
    },
	
	// Clears everything for a new game
	resetGame: function(){
		// Clear everything
		this.resetTiles();
		app.orderStation.clearOrders();
		
		// Start a new game
		this.coffeeSpawn = this.maxSpawn;
		this.coffeeTimer = this.maxTimer;
		this.shuffleBoard();
	},
    
	// Resets the board to all face-down tiles
    resetTiles: function(){
    	for(var i=0; i<this.tiles.length; i++)
        {
            this.tiles[i].setFaceDown();
        }
    },
    	
	// Update functions --------------------------------------------------------
    update: function(){
    	// clear screen and draw background
		app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		app.draw.backgroundSolid(this.ctx,this.WIDTH,this.HEIGHT);
		
		if(this.gameState == this.STATE_MENU)
		{
			this.ctx.globalAlpha = 1.0;
			this.drawMenu();
		} else if(this.gameState == this.STATE_END) {
			this.ctx.globalAlpha = 1.0;
			this.drawEndScreen();
		} else if(this.gameState == this.STATE_INSTRUCTIONS) {
			this.ctx.globalAlpha = 1.0;
			this.drawInstructions();
		} else if(this.gameState == this.STATE_GAME) {
		
			// PAUSED?
			if (app.paused){
				// Draw game at low opacity
				this.ctx.globalAlpha = 0.25;
				this.drawSprites();
				this.drawHUD();
				
				// Draw pause screen at full opacity
				this.ctx.globalAlpha = 1.0;
				this.drawPauseScreen(this.ctx);
				return;
			}
			
			// Update timers
			this.updateDifficultyCurve();
			if(app.orderStation.updateTimers(this.dt)){
				// If the function returned true, subtract a life
				this.lifeCount--;
				
				// play a sound
				createjs.Sound.play("badSound", {loop:0, volume:0.5});
				
				// Game over if lives are all gone
				if(this.lifeCount <= 0){
					this.gameState = this.STATE_END;
				}
			}
			
			// spawn a new order?
			if(app.orderStation.orders.length == 0 || app.utilities.getRandomInt(0, 1200) == 1){
				this.newRandomOrder();
			}
		
			// re-shuffle the board? (board must be half-empty)
			if(this.numberTilesGone() >= this.ROWS * this.COLS * 0.5){
				this.resetTiles();
				this.shuffleBoard();
			}
			
			// draw sprites
			this.ctx.globalAlpha = 1.0;
			this.drawSprites();
			
			// draw HUD
			this.ctx.globalAlpha = 1.0;
			this.drawHUD();
		}	
		
		// LOOP - this calls the update() function 60 FPS
		app.animationID = requestAnimationFrame(this.update.bind(this));
	},
	
	updateDifficultyCurve: function()
	{
		this.difficultyTimer += this.dt;
		
		// Check if difficulty updates need to be run
		if(this.difficultyTimer > this.nextDifficultyUpdate)
		{
			// Set the next time to run the updates
			this.difficultyTimer = 0;
			this.nextDifficultyUpdate += this.difficultyStep;
			
			// Update random spawns
			if(this.coffeeSpawn > this.minSpawn)
			{
				this.coffeeSpawn -= this.spawnStep;
			}
			
			// Update coffee timer
			if(this.coffeeTimer > this.minTimer)
			{
				this.coffeeTimer -= this.coffeeTimerStep;
			}
		}
	},
	
	// Get mouse click from utility function and check it against screen elements
	processClicks: function(mouse)
	{
		if(this.gameState == this.STATE_MENU)
		{
			// Did the player click a button?
			if(app.utilities.pointInsideRect(mouse.x, mouse.y, this.startButton))
			{	
				// Start the game
				this.gameState = this.STATE_GAME;
				// trick to get sound working on mobile
				createjs.Sound.play("goodSound", {loop:0, volume:0.0});
				
			} else if (app.utilities.pointInsideRect(mouse.x, mouse.y, this.instructionsButton)) {	
				this.gameState = this.STATE_INSTRUCTIONS;
			}
		} else if(this.gameState == this.STATE_END || this.gameState == this.STATE_INSTRUCTIONS) {
			// Did the player click a button?
			if(app.utilities.pointInsideRect(mouse.x, mouse.y, this.menuButton))
			{	
				// Back to menu
				this.gameState = this.STATE_MENU;
				// Reset the game
				this.resetGame();
			}
		} else if(this.gameState == this.STATE_GAME) {
			
			// If game is paused, click to unpause
			if(app.paused)
			{
				app.paused = false;
				cancelAnimationFrame(app.animationID)
				app.game.startSoundtrack(); // start the sound back up
				app.game.update(); // start the animation back up
				return;
			}
			
			// Did the player click a button?
			if(app.utilities.pointInsideRect(mouse.x, mouse.y, this.endButton))
			{	
				// Exit the game early
				this.gameState = this.STATE_END;
				
			} else if(app.utilities.pointInsideRect(mouse.x, mouse.y, this.pauseButton)) {	
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				createjs.Sound.stop(); // stop the sound
				app.game.update(); // call update() so that our paused screen gets drawn
			}
			
			// Did the player click on a tile?
		    for(var i=0; i<this.tiles.length; i++)
		    {
		        var tile = this.tiles[i];
		        if(app.utilities.pointInsideRect(mouse.x, mouse.y, tile) && !tile.isFaceUp)
		        {
		            if(this.selectedTile1)
		            {
		                if(this.selectedTile2)
		                {   
		                    // Exit if two tiles are already selected
		                    return;
		                } else {
		                    // Mark tile as tile2
		                    this.selectedTile2 = tile;
		                    tile.flipTile();
		                    
		                    // Perform game logic on the two tiles after delay
		                    setTimeout(this.checkMatch.bind(this),480);
		                    break; // just click one tile
		                }
		            } else {
		                // Mark tile as tile1
		                this.selectedTile1 = tile;
		                tile.flipTile();
		                break; // just click one tile
		            }
		        } // end if pointInsideRect
		    } // end for-loop		
		} // end GAME_STATE
	
	},
	
	// Compares the two selected tiles for a match
	checkMatch: function()
	{
	    if( this.selectedTile1.compareTile(this.selectedTile2) )
	    {
			// Remove the tiles from the board
	        this.selectedTile1.setInvisible();
	        this.selectedTile2.setInvisible();
			
			// Pass along the match info to the order station
			// Add the time bonus to the score
			this.score += app.orderStation.completeOrder(this.selectedTile1);
			// Give the player a few points for completing a match at all
			this.score += 5;
			
			// play a sound
			createjs.Sound.play("goodSound", {loop:0, volume:0.5});
	    }
	    else
	    {
			// Set the cards face-down again
	        this.selectedTile1.setFaceDown();
	        this.selectedTile2.setFaceDown();
	    }
		
		// Make other tiles clickable again
	    this.selectedTile1 = undefined;
	    this.selectedTile2 = undefined;
	},
	
	// Returns the number of invisible tiles
	numberTilesGone: function()
	{
		var num = 0;
		for(var i=0; i<this.tiles.length; i++){
			if(this.tiles[i].isInvisible()){
				num++;
			}
		}
		return num;
	},
	
	// Draw functions ---------------------------------------------------------------------
	drawPauseScreen: function(ctx){
		ctx.save();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, 60, "white");
		ctx.restore();
	},
	
	drawEndScreen: function(ctx){
		// Text
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Game Over!", this.WIDTH/2, 100, 65, "white");
		app.draw.text(this.ctx, "Score: " + this.score, this.WIDTH/2, 220, 45, "white");
		app.draw.text(this.ctx, "Coffee Match (c) Jennifer Stanton", this.WIDTH/2, 450, 15, "white");
		
		if(this.score == 0)
		{
			app.draw.text(this.ctx, "Better luck next time.", this.WIDTH/2, 290, 25, "white");
		} else {
			app.draw.text(this.ctx, "Fantastic!", this.WIDTH/2, 290, 25, "white");
		}
		
		// Menu Button
		this.menuButton.draw(this.ctx);
	},
	
	drawInstructions: function(ctx){
		// Text
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "How to Play", this.WIDTH/2, 100, 60, "white");
		
		for(var i=0; i<this.instructionsText.length; i++)
		{
			app.draw.text(this.ctx, this.instructionsText[i], this.WIDTH/2, 170 + (i*35), 20, "white");
		}
		
		// Menu Button
		this.menuButton.draw(this.ctx);
	},
	
	drawMenu: function()
	{
		// Title
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Coffee Match", this.WIDTH/2, 135, 65, "white");
		
		// Buttons
		this.startButton.draw(this.ctx);
		this.instructionsButton.draw(this.ctx);
		
		// Image
		this.menuSprite.draw(this.ctx);
	},
	
	drawHUD: function()
	{
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "middle";
		
		// Score, Lives, Title
		app.draw.text(this.ctx, "Score: " + this.score, 360, 25, 20, "white");
		app.draw.text(this.ctx, "Lives: " + Math.floor(this.lifeCount), 240, 25, 20, "white");
		app.draw.text(this.ctx, "Coffee Match", 20, 25, 20, "white");
		
		// Buttons
		this.endButton.draw(this.ctx);
		this.pauseButton.draw(this.ctx);
	},
	
	drawSprites : function ()
	{
	    // draw tiles
	    for(var i=0; i<this.tiles.length; i++)
	    {
	        this.tiles[i].draw(this.ctx);
	    }
		
		// draw order station
		app.orderStation.draw(this.ctx);
	},
	
	
	// Audio functions -----------------------------------------------------------------    
	startSoundtrack: function()
	{
		createjs.Sound.stop();
		createjs.Sound.play("soundtrack", {loop:-1, volume:0.5});
	}
};
