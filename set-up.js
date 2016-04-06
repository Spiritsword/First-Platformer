var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var shootTimer= 0;
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

	//Draw the level map.
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