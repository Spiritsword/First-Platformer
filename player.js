var Player = function()
{
	this.image = document.createElement("img");
	this.x = canvas.width*2/3;
	this.y = canvas.height*2/3;
	this.width = 159;
	this.height = 163;
	this.image.src = "hero.png";
	this.shooting = false;
	this.rotation = 0;
	this.alive = true;
};

Player.prototype.update = function(deltaTime)
{
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.rotation -= deltaTime;
	}
	else
	{
		this.rotation +=deltaTime;
	};
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.shooting = true;
	}
	else
	{
		this.shooting = false;
	}
}

Player.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}

Player.prototype.shoot = function()
 {
	console.log("shoot called");
	var bullet = new Bullet();
	 
	 	//Start off with a velocity that shoots the bullet to the left.
	var velX = 1;
	var velY = 0;

	//Now rotate this vector according to the ship's current rotation.
	var s = Math.sin(player.rotation+0.75);
	var c = Math.cos(player.rotation+0.75);
	var xVel = (velX*c) - (velY*s);
	var yVel = (velX*s) + (velY*c);
	
	//Don't bother storing a direction and calculating the
	//velocity every frame, because it won't change.
	//Just store the pre-calculated velocity.
	bullet.x = player.x + xVel*player.width/3;
	bullet.y = player.y + yVel*player.width/3;
	bullet.velocityX = xVel*bullet.speed;
	bullet.velocityY = yVel*bullet.speed;
	
	//Add bullet to list.
	bullets.push(bullet);
 }
	 
	
