var Player = function()
{
    this.image = document.createElement("img");
    this.position = new Vector2();
    this.position.set(9 * TILE, 0 * TILE);
    this.width = 159;
    this.height = 163;
    this.offset = new Vector2();
    this.offset.set(-55, -87);
    this.velocity = new Vector2();
    this.falling = true;
    this.jumping = false;
	this.image.src = "hero.png";
//	this.shooting = false;
//	this.rotation = 0;
//	this.alive = true;
};

Player.prototype.update = function(deltaTime)
{
    var left = false;
    var right = false;
    var jump = false;

    //Check keypress events.
    if (keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
    {
        left = true;
    }
    if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
    {
        right = true;
    }
    if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
    {
        jump = true;
    }

    var wasleft = this.velocity.x < 0;
    var wasright = this.velocity.x > 0;
    var falling = this.falling;
    var ddx = 0;    //Acceleration
    var ddy = GRAVITY;

    if(left)
    {
        ddx = ddx - ACCEL;  //Player wants to go left.
    }
    else
    {
        if(wasleft)
        {
            ddx = ddx + FRICTION;   //Player was going left but not any more.
        }
    }

    if (right)
    {
        ddx = ddx + ACCEL;  //Player wants to go left.
    }
    else
    {
        if (wasright) {
            ddx = ddx - FRICTION;   //Player was going right but not any more.
        }
    }

    //Calculate the new position and velocity.
    this.postion.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.postion.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
    this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
    this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);

    //18/04/2016 COMPLETED TUTORIAL TO END OF PAGE 7

    /*Collision detection
    
    Our collision detection logic is greatly simplified by the fact that the player
    is a rectangle and is exactly the same size as a single tile.
    So we know that the player can only ever occupy 1, 2 or 4 cells.

    This means that we can short-circuit and avoid building a general purpose collisioiin detection engine
    by simply looking at the 1 to 4 cells that the player occupies.
    */

    var tx = pixelToTile(this.position.x);
    var ty = pixelToTile(this.position.y);
    var nx = (this.position.x) % TILE; // True if player overlaps right
    var ny = (this.position.y) % TILE; //True if player overlaps below
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
    var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

    

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
	 
	
