var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var shootTimer= 0;

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