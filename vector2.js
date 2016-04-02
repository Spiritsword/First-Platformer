var Vector2 = function(){
	this.x = 0;
	this.y = 0;	
};

Vector2.prototype.set = function(newX,newY){
	this.x = newX;
	this.y = newY;
};

Vector2.prototype.normalize = function(){
	if
	{
		this.x = 0 && this.y == 0 then return;
	}
	else
	{
		var magnitude = math.sqrt((this.x*this.x)+(this.y*this.y));
		this.x /= magnitude;
		this.y /= magnitude;
	}
};

Vector2.prototype.add = function(v2){
	this.x += v2.x;
	this.y += v2.y;
};

Vector2.prototype.subtract = function(v2){
	this.x -= v2.x;
	this.y -= v2.y;
};

Vector2.prototype.multiplyScalar = function(num){
	this.x *= num;
	this.y *= num;
};

