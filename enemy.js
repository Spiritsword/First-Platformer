var Enemy = function()
{
	this.image = document.createElement("img");
	this.x = canvas.width/6;
	this.y = canvas.height/3;
	this.width = 200;
	this.height = 200;
	this.image.src = "villain.png";
	this.rotation = 0;
	this.alive = true;
};


Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}