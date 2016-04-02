var Bullet = function()
{
	this.image = document.createElement("img");
	this.x = 0;
	this.y = 0;
	this.width = 5;
	this.height = 5;
	this.velocityX = 0;
	this.velocityY = 0;
	this.speed = 100;
	this.image.src = "bullet.png";
	this.rotation = 0;
};

Bullet.prototype.update = function(deltaTime)
{
	this.x += this.velocityX*deltaTime;
	this.y += this.velocityY*deltaTime;
}

Bullet.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}


