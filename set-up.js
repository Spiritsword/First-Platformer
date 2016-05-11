var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var shootTimer = 0;
var MAP = {tw: 60, th:20};
var TILE = 35;
var TILESET_TILE = TILE*2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var	TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var tileset = document.createElement("img");
tileset.src = "tileset.png";
var cells = [];
var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
console.log("maxtiles =" + maxTiles);
//Arbitrary choice for 1m
var METER = TILE;
//Very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
//Max horizonatal speed (10 tiles per second)
var MAXDX = METER * 10;
//Max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
//Horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
//Horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
//(a large) instntaneous jump impulse
var JUMP = METER * 1500;
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
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

function collideswith(obj1,obj2)
{
	return intersects(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height);
}

function cellAtPixelCoord(layer, x, y)
{
    if(x<0 || x>SCREEN_WIDTH || y<0)
    {
        return 1;
    }
    //Let the player drop off the bottom of the screen (This means death.)
    else 
        if(y>SCREEN_HEIGHT)
        {
            return 0;
        }
        else
        {
            return cellAtTileCoord(layer, pixelToTile(x), pixelToTile(y));
        }
}

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>MAP.tw || ty<0)
    {
        return 1;
        //Let the player drop off the bottom of the screen. (This means death.)
    }
    else
    {
        if(ty>=MAP.th)
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

