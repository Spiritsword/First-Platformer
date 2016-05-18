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


// Some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
// var fps = 0;
// var fpsCount = 0;
// var fpsTime = 0;

// Create player and keyboard.
var player = new Player();
var keyboard = new Keyboard();

//Create an array to hold all the bullets and another to hold the bombs.
var bullets = [];
var bombs = [];

function runSplash(deltaTime)
{
    if (newState == true)
    {
        musicSplash.play();
        newState = false;
    }

    if (splashTimer <= 0 || keyboard.isKeyDown(keyboard.KEY_SPACE)) {
        newState = true;
        musicSplash.stop();
        gameState = STATE_GAME;
        return;
    }

    context.drawImage(splashImage, 0, 0);

    context.fillStyle = "#000";
    context.font = "96px Impact";
    splashMessage = "BLADE GUNNER";
    splashMeasure = context.measureText(splashMessage);

    context.font = "48px Impact";
    startMessage = "PRESS SPACE TO START";
    startMessageMeasure = context.measureText(startMessage);

    context.font = "96px Impact";
    context.fillText(splashMessage, SCREEN_WIDTH * 1 / 2 - (splashMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 20);
    
    context.font = "48px Impact";
    context.fillText(startMessage, SCREEN_WIDTH * 1 / 2 - (startMessageMeasure.width / 2), SCREEN_HEIGHT * 3 / 4 - 20);

    splashTimer -= deltaTime;
}

function runRespawn(deltaTime)
{
    if (newState)
    {
        musicSplash.play();
        newState = false;
    }
    if (player.respawnTimer <= 0)
    {
        player.respawn();
        newState = true;
        musicSplash.stop();
        gameState = STATE_GAME;
    }
    else
    {
        context.font = "96px Impact";
        gameoverMessage = "ARRGH!";
        gameoverMeasure = context.measureText(gameoverMessage);

        context.fillStyle = "#900";
        context.font = "96px Impact";
        context.fillText(gameoverMessage, SCREEN_WIDTH * 1 / 2 - (gameoverMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 10);
    }
    player.respawnTimer -= deltaTime;
}


function runGameoverLost(deltaTime)
{
    if (newState == true)
    {
        musicLost.play();
        newState = false;
    }

    if(keyboard.isKeyDown(keyboard.KEY_SPACE))
    {
        lives = 3;
        score = 0;
        bombs = [];
        bullets = [];
        bombSpawnTimer = 3;
        bombsCreated = 0;
        player = new Player();
        newState = true;
        gameState = STATE_GAME; 
        musicLost.stop();
    }

    context.drawImage(gameoverImage, 0, 0);

    context.font = "96px Impact";
    gameoverMessage = "YOU LOST!";
    gameoverMeasure = context.measureText(gameoverMessage);

    context.font = "48px Impact";
    restartMessage = "PRESS SPACE TO RESTART";
    restartMessageMeasure = context.measureText(restartMessage);

    context.fillStyle = "#900";
    context.font = "96px Impact";
    context.fillText(gameoverMessage, SCREEN_WIDTH * 1 / 2 - (gameoverMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 10);

    context.font = "48px Impact";
    context.fillText(restartMessage, SCREEN_WIDTH * 1 / 2 - (restartMessageMeasure.width / 2), SCREEN_HEIGHT * 3 / 4 - 20);

}

function runGameoverWon(deltaTime)
{
    if (newState == true) 
    {
        musicWon.play();
        newState = false;
    }

    if(keyboard.isKeyDown(keyboard.KEY_SPACE))
    {
        lives = 3;
        score = 0;
        bombs = [];
        bullets = [];
        bombSpawnTimer = 3;
        bombsCreated = 0;
        player = new Player();
        newState = true;
        gameState = STATE_GAME;
        musicWon.stop();
    }

    context.drawImage(gameoverImage, 0, 0);

    context.font = "96px Impact";
    gameoverMessage = "YOU WON!";
    gameoverMeasure = context.measureText(gameoverMessage);

    context.font = "48px Impact";
    scoreMessage = "YOUR SCORE = " + score;
    scoreMeasure = context.measureText(scoreMessage);

    context.font = "36px Impact";
    restartMessage = "PRESS SPACE TO RESTART";
    restartMessageMeasure = context.measureText(restartMessage);

    context.fillStyle = "#FF0";
    context.font = "96px Impact";
    context.fillText(gameoverMessage, SCREEN_WIDTH * 1 / 2 - (gameoverMeasure.width / 2), SCREEN_HEIGHT * 1 / 2 + 10);

    context.font = "48px Impact";
    context.fillText(scoreMessage, SCREEN_WIDTH * 1 / 2 - (scoreMeasure.width / 2), SCREEN_HEIGHT * 3 / 4 - 20);

    context.font = "36px Impact";
    context.fillText(restartMessage, SCREEN_WIDTH * 1 / 2 - (restartMessageMeasure.width / 2), SCREEN_HEIGHT * 7 / 8);
}


function runGame(deltaTime)
{
    // Music, maestro! - for game state
    if (newState == true)
    {
            musicGame.play();
            newState = false;
    }


    //Create bomb, if appropriate.
    bombSpawnTimer -= deltaTime;
    if (bombSpawnTimer <= 0 && (bombsCreated < bombsOrdained))
    {
        bombSpawnTimer = 1;
        spawnBomb();
        bombsCreated++;
    }

    //Update everything and check for collisions.

    player.update(deltaTime);

    if (player.position.y > MAP_HEIGHT)
    {
        lives -= 1;
        if (lives > 0)
        {
            newState = true;
            player.respawnTimer = 1;
            musicGame.stop();
            gameState = STATE_RESPAWN;
            return;
        }
        else
        {
            newState = true;
            musicGame.stop();
            gameState = STATE_GAMEOVER_LOST;
            return;
        }
    }

    for (var i = bombs.length - 1; i >= 0; i--)
    {
        bombs[i].update(deltaTime);

        //If exploded bomb hits player at Frame 4 then gameover lost.
        if ((bombs[i].exploded == true) && (bombs[i].sprite.currentFrame == 4) && collidesWith(bombs[i], 17, 3, player, 17, 17))
        {
            lives -= 1;
            if (lives > 0) {
                newState = true;
                player.respawnTimer = 1;
                musicGame.stop();
                gameState = STATE_RESPAWN;
                return;
            }
            else {
                newState = true;
                musicGame.stop();
                gameState = STATE_GAMEOVER_LOST;
                return;
            }
        }

        //Check if the bomb has gone out of the screen boundaries or has finished exploding
        //and if so kill it.
        if (bombs[i].x < 0
            || bombs[i].x > MAP_WIDTH
            || bombs[i].y < 0
            || bombs[i].y > MAP_HEIGHT
            || bombs[i].sprite.currentFrame >= 12)
        {
            bombs.splice(i, 1);
        }
    }

    //Check for collisions between bullets and unexploded bombs.
    for (var i = bombs.length - 1; i >= 0; i--)
    {
        for (var j = bullets.length - 1; j >= 0; j--)
        {
            if (collidesWith(bombs[i], 17, 3, bullets[j], 0, 0) && !bombs[i].exploded)
            {
                bombs[i].shot = true;
                bullets.splice(j, 1);
                score += 100;
            }
        }

    }



    if ((bombs.length == 0) && (bombsCreated == bombsOrdained))
    {
        newState = true;
        musicGame.stop();
        gameState = STATE_GAMEOVER_WON;
        return;
    }

    for (var i = bullets.length - 1; i >= 0; i--)
    {
        bullets[i].update(deltaTime);

        //Check if the bullet has gone out of the screen boundaries
        //and if so kill it.
        if (bullets[i].x < 0
            || bullets[i].x > MAP_WIDTH
            || bullets[i].y < 0
            || bullets[i].y > MAP_HEIGHT) {
            bullets.splice(i, 1);
        }
    }

    if (player.position.y > MAP_HEIGHT)
    {
        musicGame.stop();
        newState = true;
        gameState = STATE_GAMEOVER_LOST;
    }


    //Draw everything.

    tileX = pixelToTile(player.position.x);
    startX = tileX - Math.floor(maxTilesX / 2);
    offsetX = (TILE + player.position.x - tileToPixel(tileX));
    if (startX < -1)
    {
        startX = 0;
        offsetX = 0;
    }
    if (startX > MAP.tw - maxTilesX)
    {
        startX = MAP.tw - maxTilesX + 1;
        offsetX = TILE;
    }
    worldOffsetX = startX * TILE + offsetX;

    tileY = pixelToTile(player.position.y);
    startY = tileY - Math.floor(maxTilesY / 2);
    offsetY = (TILE + player.position.y - tileToPixel(tileY));
    if (startY < -1) {
        startY = 0;
        offsetY = 0;
    }
    if (startY > MAP.th - maxTilesY) {
        startY = MAP.th - maxTilesY + 1;
        offsetY = TILE;
    }
    worldOffsetY = startY * TILE + offsetY;

    //Drawing map
    drawMap(startX, offsetX, startY, offsetY);

    //Drawing bullets
    for (var i = bullets.length - 1; i >= 0; i--)
    {
        bullets[i].draw();
    }

    //Drawing player
    player.draw(worldOffsetX, worldOffsetY);

    //Drawing bombs
    for (var i = bombs.length - 1; i >= 0; i--)
    {
        if (bombs[i].exploded == true)
        {
            bombs[i].drawExploded(worldOffsetX, worldOffsetY);
        }
        else
        {
            bombs[i].drawUnexploded(worldOffsetX, worldOffsetY);
        }
    }
    
    //Drawing score
    context.fillStyle = "#D50020";
    context.font = "24px Arial";
    var scoreText = "SCORE: " + score;
    context.fillText(scoreText, SCREEN_WIDTH - 198, 453);

    //Drawing lives
    for(var i=0; i<lives; i++)
    {
        context.drawImage(lifeImage, 0, 0, LIFETILE_WIDTH, LIFETILE_HEIGHT, 20 + ((LIFETILE_WIDTH + 2) * i), 427, LIFETILE_WIDTH, LIFETILE_HEIGHT);
    }
}


function run()
{
    context.fillStyle = "#ccc";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var deltaTime = getDeltaTime();
    switch (gameState)
    {
        case STATE_SPLASH:
            runSplash(deltaTime);
            break;
        case STATE_GAME:
            runGame(deltaTime);
            break;
        case STATE_RESPAWN:
            runRespawn(deltaTime);
            break;
        case STATE_GAMEOVER_LOST:
            runGameoverLost(deltaTime);
            break;
        case STATE_GAMEOVER_WON:
            runGameoverWon(deltaTime);
            break;
    }
}


mapInitialize();
soundInitialize();
gameState = STATE_SPLASH;
splashTimer = 8;

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function ()
{
  var onEachFrame;
  if (window.requestAnimationFrame)
  {
    onEachFrame = function (cb)
    {
        var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
        _cb();
    };
  }
  else if (window.mozRequestAnimationFrame)
  {
    onEachFrame = function(cb) {
        var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
        _cb();
    };
  }
  else
  {
    onEachFrame = function (cb)
    {
        setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
