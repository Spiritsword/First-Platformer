var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";
var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();

	//Create an array to hold all the bullets.
var bullets = [];

function runSplash(deltaTime)
{
    context.drawImage(splashImage, 0, 0);
    context.fillStyle = "#000";
    context.font = "96px Impact";
    splashMessage = "BLADE GUNNER";
    splashMeasure = context.measureText(splashMessage);
    context.fillText(splashMessage, SCREEN_WIDTH * 1 / 2 - (splashMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 20);
    splashTimer -= deltaTime;
    if (splashTimer <= 0) {
        gameState = STATE_GAME;
        return;
    }
}

function runGameover(deltaTime)
{
    context.drawImage(gameoverImage, 0, 0);

    context.font = "96px Impact";
    gameoverMessage = "GAME OVER";
    gameoverMeasure = context.measureText(gameoverMessage);

//  context.font = "48px Impact";
//  scoreMessage = "YOUR SCORE = " + score;
//  var scoreMeasure = context.measureText(scoreMessage);

    context.fillStyle = "#900";
    context.font = "96px Impact";
    context.fillText(gameoverMessage, SCREEN_WIDTH * 1 / 2 - (gameoverMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 10);

//  context.font = "48px Impact";
//  context.fillText(scoreMessage, SCREEN_WIDTH * 1 / 2 - (scoreMeasure.width / 2), SCREEN_HEIGHT * 3 / 4 - 20);
}



function runGame(deltaTime)
{
/*
	//Update shootTimer.
	if(shootTimer > 0)
	shootTimer -= deltaTime;
	
	//Create new bullet if appropriate.
	if(player.shooting)
	{
//		console.log("player shooting");
	}
	else
	{
//		console.log("player not shooting");
	}
	
	//console.log("bullets.length = " + bullets.length);
		
	if (player.shooting && shootTimer <=0 && player.alive)
	{
		shootTimer += 0.3;
		player.shoot();
	}

	//Check if any bullet has gone out of the screen boundaries
	//and if so kill it.
	for(var i=bullets.length-1; i>=0; i--)
	{
		if(bullets[i].x < 0
			|| bullets[i].x > SCREEN_WIDTH
			|| bullets[i].y < 0
			|| bullets[i].y > SCREEN_HEIGHT)
		{
			bullets.splice(i, 1);
		}
	}

	
	//	console.log("player updating");
	player.update(deltaTime);
	
	if (bullets.length >= 0)
	{
		for(var i=bullets.length-1; i>=0; i--)
		{
			bullets[i].update(deltaTime);
		};
	}
	
	//Check if any bullet has hit enemy.  If so, kill them both.
	if (bullets.length >= 0 && enemy.alive)
	{
		for(var i=bullets.length-1; i>=0; i--)
		{
			if (collideswith(bullets[i],enemy))
			{
				bullets.splice(i,1);
				enemy.alive = false;
				console.log("enemy hit");
			}
		};
	};
*/
    console.log("updating player");
    drawMap();
    player.update(deltaTime);
    player.draw();
    if (player.position.y > SCREEN_HEIGHT)
    {
        gameState = STATE_GAMEOVER;
    }

    /*
	if (enemy.alive)                 
	{
		enemy.draw();
	};	

	if (bullets.length >= 0)
	{
		for(var i=bullets.length-1; i>=0; i--)
		{
			bullets[i].draw(deltaTime);
		};
	};
    */
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}


function run() {
    context.fillStyle = "#ccc";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var deltaTime = getDeltaTime();
    switch (gameState) {
        case STATE_SPLASH:
            runSplash(deltaTime);
            break;
        case STATE_GAME:
            runGame(deltaTime);
            break;
        case STATE_GAMEOVER:
            runGameover(deltaTime);
            break;
    }
}


initialize();
gameState = STATE_SPLASH;
splashTimer = 3;

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
