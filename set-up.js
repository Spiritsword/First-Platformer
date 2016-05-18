var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var MAP = { tw: 60, th: 20 };
var TILE = 35;
var MAP_WIDTH = MAP.tw * TILE;
var MAP_HEIGHT = MAP.th * TILE;
var TILESET_TILE = TILE*2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var	TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var tileset = document.createElement("img");
tileset.src = "tileset.png";
var cells = [];
var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 2;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 0;
var maxTilesX = Math.floor(SCREEN_WIDTH / TILE) + 2;
var maxTilesY = Math.floor(SCREEN_HEIGHT / TILE) + 2;
//Arbitrary choice for 1m
var METER = TILE;
//Very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
//Max horizonatal speed (10 tiles per second)
var MAXDX = METER * 15;
//Max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
//Horizontal acceleration
var ACCEL = MAXDX * 2;
//Horizontal friction
var FRICTION = MAXDX * 6;
//(a large) instntaneous jump impulse
var JUMP = METER * 8000;
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER_LOST = 2;
var STATE_GAMEOVER_WON = 3;
var STATE_RESPAWN = 4;
var splashImage = document.createElement("img");
splashImage.src = "grass_background.jpg";
var gameoverImage = document.createElement("img");
gameoverImage.src = "grass_background.jpg";
var score = 0;
var lives = 3;
var lifeImage = document.createElement("img");
lifeImage.src = "lifesprites.png";
var LIFETILE_WIDTH = 36;
var LIFETILE_HEIGHT = 32;
var musicBackground;
var sfxFire;
var sfxExplosion;
var newState = true;
var RUN_JUMP = 0;
var CLIMB= 1;
var AIR = 0;
var LAND = 1;
var LEFT = 0;
var RIGHT = 1;
var STILL = 2;
var UP = 0
var DOWN = 1;
var ASCEND_SPEED = 200;
var DESCEND_SPEED = 300;
var bombSpawnTimer = 3;
var bombsCreated = 0;
var bombsOrdained = 10;


function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(y2 + h2/2 < y1 - h1/2 ||
		x2 + w2/2 < x1 - w1/2 ||
		x2 - w2/2 > x1 + w1/2 ||
		y2 - h2/2 > y1 + h1/2)
	{
		return false;
	}
	return true;
}

function collidesWith(obj1, obj1Xoffset, obj1Yoffset, obj2, obj2Xoffset, obj2Yoffset)
//Offsets are used to adjust position to the centre of the object.
{
    return intersects(obj1.position.x + obj1Xoffset, obj1.position.y + obj1Yoffset, obj1.width, obj1.height, obj2.position.x + obj2Xoffset, obj2.position.y + obj2Yoffset, obj2.width, obj2.height);
}

function cellAtPixelCoord(layer, x, y)
{
            return cellAtTileCoord(layer, pixelToTile(x), pixelToTile(y));
}

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>MAP.tw - 1 || ty<0)
    {
        return 1;
        //Let the player drop off the bottom of the screen. (This means death.)
    }
    else
    {
        if(ty>MAP.th - 1)
        {
            return 0;
        }
        else
        {
            return cells[layer][ty][tx];
        }

    }
}

function tileToPixel(tile)
{
    return tile*TILE;
}

function pixelToTile(pixel)
{
    return Math.floor(pixel/TILE);
}

function bound(value, min, max)
{
    if(value<min)
    {
        return min;
    }
    else
    {
        if(value>max)
        {
            return max;
        }
        else
        {
            return value;
        }
    }
}

