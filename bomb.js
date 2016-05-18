var Bomb = function ()
{
    this.sprite = new Sprite("explosion.png");
    this.sprite.buildAnimation(13, 1, 196, 196, 0.2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    this.image = document.createElement("img");
    this.image.src = "bomb.png";
    this.width = 64;
    this.height = 64;
    this.sprite.setAnimationOffset(0, -98, -98);
    this.position = new Vector2();
    this.velocity = new Vector2();
    this.velocity.set(0, 0);
    this.movtMode = AIR;
    this.ddx = 0;
    this.ddy = GRAVITY;
    this.exploded = false;
    this.explosionFrame = 0;
    this.justExploded = false;
    this.spriteFrame = 0;
    this.lifetime = 0;
    this.age = 0;
    this.shot = false;
};

Bomb.prototype.update =
    function (deltaTime)
    {//Explode the bomb and set justExploded as and if appropriate.
        if (((this.age >= this.lifetime) || this.shot) && (this.exploded == true))
        {
            this.justExploded = false;
        }

        else if (((this.age >= this.lifetime) || this.shot) && this.exploded == false)
        {
            this.width = 120;
            this.height = 120;
            this.exploded = true;
            this.justExploded = true;
        }

        if (this.exploded)
        {
            this.updateExploded(deltaTime);
        }
        else
        {
            this.updateUnexploded(deltaTime);
        }
    }


Bomb.prototype.updateExploded =
    function (deltaTime)
    {
        if (this.justExploded)
        {
            this.sprite.setAnimation(0);
            sfxExplosion.play();
            this.justExploded = false;
        }
        else
        {
            this.sprite.update(deltaTime);
        }

        this.sprite.update(deltaTime);
        {  //Velocity of explosion debris centre of gravity is taken from original bomb velocity.
            this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
            this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
        }
    }

Bomb.prototype.updateUnexploded =
    function (deltaTime)
    {
        //Age the bomb.
        this.age += deltaTime;
        
        //Calculating the new position and velocity.
        this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
        this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
        this.velocity.x = bound(this.velocity.x + (deltaTime * this.ddx), -MAXDX, MAXDX);
        this.velocity.y = bound(this.velocity.y + (deltaTime * this.ddy), -MAXDY, MAXDY);

        //Collision detection

        var tx = pixelToTile(this.position.x);
        var ty = pixelToTile(this.position.y);
        var nx = (this.position.x) % TILE; // True if player overlaps right
        var ny = (this.position.y) % TILE; //True if player overlaps below
        var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
        var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
        var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
        var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

        //Check for bomb collisions with platforms as for player.

        if (this.velocity.y > 0)
        {
            if ((celldown && !cell) || (celldiag && !cellright && nx))
            {
                //clamp the y position to avoid falling into platform below
                this.position.y = tileToPixel(ty);
                this.velocity.y = 0;                //Stop downward velocity.
                ny = 0;                             //Player no longer overlaps the cells below.
            }
        }
        else
        {
            if (this.velocity.y < 0)
            {
                if ((cell && !celldown) || (cellright && !celldiag && nx))
                {
                    //Clamp the y position to avoid jumping into platform above.
                    this.position.y = tileToPixel(ty + 1);
                    this.velocity.y = 0 //Stop upward velocity.
                    //Player is no longer really in that cell, we clamped them to the cell below.
                    cell = celldown;
                    cellright = celldiag;   //(ditto)
                    ny = 0;                 //Player no longer overlaps the cells below.
                }
            }
        }
        if (this.velocity.x > 0)
        {
            if ((cellright && !cell) || (celldiag && !celldown && ny))
            {
                //Clamp the x postion to avoid moving into the platform we just hit.
                this.position.x = tileToPixel(tx);
                this.velocity.x = 0;    //Stop horizontal velocity.
            }
        }
        else if (this.velocity.x < 0)
        {
            if ((cell && !cellright) || (celldown && !celldiag && ny))
            {
                //Clamp the x position to avoid moving into the platform we just hit.
                this.position.x = tileToPixel(tx + 1);
                this.velocity.x = 0;    //Stop horizontal velocity.
            }
        }

    }


Bomb.prototype.drawExploded = function (worldOffsetX, worldOffsetY)
//Exploded bomb is sprite.
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y - worldOffsetY);
}

Bomb.prototype.drawUnexploded = function (worldOffsetX, worldOffsetY)
//Unexploded bomb is image.
{
    context.save();
    context.translate (this.position.x - worldOffsetX, this.position.y - worldOffsetY)
    context.drawImage(this.image, -15, -29);
    context.restore()
}

function spawnBomb()
{
    bomb = new Bomb();
    var bombTileX = Math.floor(MAP.tw * (Math.random()));
    bomb.position.set(tileToPixel(bombTileX), 0);
    bomb.lifetime = 20 * Math.random();
    bombs.push(bomb);
}



