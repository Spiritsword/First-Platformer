var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var shootTimer = 0;
var LAYER_COUNT = 2;
var MAP = {tw: 20, th:15};
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
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
//Arbitrary choice for 1m
var METER = TILE;
//Very exaggerated gravity (6x)
var GARVITY = METER * 9.8 * 6;
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
        return 1:
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

//This function draws the level map.
function drawMap()
{
	console.log("drawing map");
	for(var layerIdx=0;layerIdx<LAYER_COUNT;layerIdx++)
	{
		var idx = 0;
		for(var y = 0;y<level1.layers[layerIdx].height; y++)
		{
			for(var x=0; x<level1.layers[layerIdx].width; x++)
			{
				console.log("data ="+level1.layers[layerIdx].data[idx]);
				if(level1.layers[layerIdx].data[idx] != 0)
				{
					//the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
					//correct tile
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X)*(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + Math.floor(tileIndex/TILESET_COUNT_Y)*(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}	
	}
}

function initialize() 
{
    for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) 
    {
        cells[layerIdx] = [];
        var idx = 0;
        for (var y = 0; y < level1.layers[layerIdx].height; y++)
        {
            cells[layerIdx][y] = [];
            for (var x = 0; x < level1.layer[layerIdx].width; x++) 
            {
                if(level1.layers[layerIdx].data[idx]) !=0) 
                {     
                    // for each tile we find in the layer data, we need to create 4 collisions
                    // (because our collision squares are 35x35 but the tiles in the level are 70x70)
                    cells[layerIdx][y][x] = 1;
                    cells[layerIdx][y-1][x] = 1;
                    cells[layerIdx][y-1][x+1] = 1;
                    cells[layerIdx][y][x] = 0;
                }
            else if cells[layerIdx][y][x] != 1)
                {
                    // if we haven't set this cell's value, then set it to 0 now
                    cells[layerIdx][y][x] = 0:
                }
                idx++;
            }
        }
    }
}