var Bullet = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.width = 5;
	this.height = 5;
	this.velocity = new Vector2();
	this.image.src = "bullet.png";
};

Bullet.prototype.update = function(deltaTime)
{
	this.position.x += this.velocity.x*deltaTime;
	this.position.y += this.velocity.y*deltaTime;
}

Bullet.prototype.draw = function()
{
	context.save();
		context.translate(this.position.x - worldOffsetX, this.position.y - worldOffsetY);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}


