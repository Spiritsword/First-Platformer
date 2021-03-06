

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_IDLE_RIGHT = 4;
var ANIM_JUMP_RIGHT = 5;
var ANIM_WALK_RIGHT = 6;
var ANIM_SHOOT_RIGHT = 7;
var ANIM_CLIMB = 8;
var ANIM_MAX = 9;

var Player = function ()
{
    this.sprite = new Sprite("ChuckNorris.png");
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [0, 1, 2, 3, 4, 5, 6, 7]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [8, 9, 10, 11, 12]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [52, 53, 54, 55, 56, 57, 58, 59]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [60, 61, 62, 63, 64]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);
    this.sprite.buildAnimation(12, 8, 165, 126, 0.05, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]);

    for (var i = 0; i < ANIM_MAX; i++)
    {
        this.sprite.setAnimationOffset(i, -55, -87);
    }

    this.position = new Vector2();
    this.position.set(9 * TILE, 0 * TILE);
    this.width = 35;
    this.height = 35;
    this.velocity = new Vector2();
    this.movtMode = AIR;
    this.shooting = false;
    this.state = RUN_JUMP;
    this.direction = LEFT;
    this.cooldownTimer = 1;
    this.ddx = 0;
    this.ddy = GRAVITY;
    this.respawnTimer = 1;
};


Player.prototype.update = function (deltaTime)
{
    //This section calls the relevant update function according to state.
    if (this.state == RUN_JUMP)
    {
        this.updateRunJump(deltaTime);
    }
    else
    {
        this.updateClimb(deltaTime);
    }

    //This section actions change of state if needed.

    var tx = pixelToTile(this.position.x);
    var ty = pixelToTile(this.position.y);
    var cellLadder = cellAtTileCoord(LAYER_LADDERS, tx, ty);
    var cellrightLadder = cellAtTileCoord(LAYER_LADDERS, tx + 1, ty);
    var celldownLadder = cellAtTileCoord(LAYER_LADDERS, tx, ty + 1);
    var celldiagLadder = cellAtTileCoord(LAYER_LADDERS, tx + 1, ty + 1);

    //Cancelling "ghost" ladders just offscreen.
    if (tx < 0)
    {
        cellLadder = 0;
        celldownLadder = 0;
    }
    if (tx > MAP.tw - 2)
    {
        cellrightLadder = 0;
        celldiagLadder = 0;
    }
    if (ty < 0)
    {
        cellLadder = 0;
        cellrightLadder = 0;
    }
    if (ty > MAP.th - 2)
    {
        celldownLadder = 0;
        celldiagLadder = 0;
    }



    if (this.state == RUN_JUMP && (cellLadder || cellrightLadder) && (keyboard.isKeyDown(keyboard.KEY_UP) == true))
    {
        //Clamp the x co-ordinate to the ladder.
        if (cellLadder && cellrightLadder)
        {
            this.position.x = tileToPixel(tx) + TILE/2;
        }
        else if (cellLadder && !cellrightLadder)
        {
            this.position.x = tileToPixel(tx - 1) + TILE / 2;
        }
        else
        {
            this.position.x = tileToPixel(tx + 1) + TILE/2;
        }
        this.velocity.x = 0;
        this.sprite.setAnimation(ANIM_CLIMB);
        this.state = CLIMB;
        return;
    }

    if (this.state == RUN_JUMP && (celldownLadder || celldiagLadder) && (keyboard.isKeyDown(keyboard.KEY_DOWN) == true))
    {
        //Clamp the x co-ordinate to the ladder, depending on exactly where the ladder is.
        if (celldownLadder && celldiagLadder)
        {
            this.position.x = tileToPixel(tx) + TILE/2;
        }
        else if (celldownLadder && !celldiagLadder)
        {
            this.position.x = tileToPixel(tx - 1) + TILE / 2;
        }
        else
        {
            this.position.x = tileToPixel(tx + 1) + TILE/2;
        }
        this.velocity.x = 0;
        this.sprite.setAnimation(ANIM_CLIMB);
        this.state = CLIMB;
        return;
    }

    if (this.state == CLIMB && !celldownLadder && !cellLadder)  //Player has reached the top of the ladder (and slightly overshot).
    {
        this.position.y = tileToPixel(ty + 1);  //Clamp y position
        this.velocity.y = 0;                    //Clamp y velocity
        this.sprite.setAnimation(ANIM_IDLE_LEFT);
        this.state = RUN_JUMP;
        return;
    }

    if (this.state == CLIMB && !celldownLadder && cellLadder && !keyboard.isKeyDown(keyboard.KEY_UP))  //Player has reached the bottom of the ladder (or is just starting up) - but is not just starting up, because up not pressed.
    {
        this.position.y = tileToPixel(ty);  //Clamp y position
        this.velocity.y = 0;                //Clamp y velocity
        this.sprite.setAnimation(ANIM_IDLE_LEFT);
        this.state = RUN_JUMP;
    }
}


Player.prototype.updateClimb =
    function (deltaTime)
    {   //Resetting/updating the sprites and y velocity as appropriate
        if (keyboard.isKeyDown(keyboard.KEY_UP) == true)
        {
            this.velocity.y = -ASCEND_SPEED;
            if (this.sprite.currentAnimation != ANIM_CLIMB)
            {
                this.sprite.setAnimation(ANIM_CLIMB)
            }
            else
            {
                this.sprite.update(deltaTime);
            }

        }
        else if (keyboard.isKeyDown(keyboard.KEY_DOWN) == true)
        {
            this.velocity.y = DESCEND_SPEED;
            if (this.sprite.currentAnimation != ANIM_CLIMB) {
                this.sprite.setAnimation(ANIM_CLIMB)
            }
            else
            {
                this.sprite.update(deltaTime);
            }
        }
        else
        {
            this.velocity.y = 0;
        }
        //If neither up or down pressed then sprite is frozen.

        //Calculating the new position and velocity (no acceleration and x is clamped)
        this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));

    }


Player.prototype.updateRunJump =
    function (deltaTime)
    {
        console.log(this.movtMode);
        //Setting up the local variables
        shooting = keyboard.isKeyDown(keyboard.KEY_SPACE);
        jump = keyboard.isKeyDown(keyboard.KEY_UP);
        var striving = STILL;   //default value        
        if (keyboard.isKeyDown(keyboard.KEY_LEFT))
        {
            striving = LEFT;
            this.direction = LEFT;
        }
        else
        {
            if (keyboard.isKeyDown(keyboard.KEY_RIGHT))
            {
                striving = RIGHT;
                this.direction = RIGHT;
            }
        }

        //Setting the sprites
        this.sprite.update(deltaTime);
        if (shooting)
        {
            switch (this.direction)
            {            
                case LEFT:
                    if (this.sprite.currentAnimation != ANIM_SHOOT_LEFT)
                    {
                        this.sprite.setAnimation(ANIM_SHOOT_LEFT);
                    }
                    break;
                case RIGHT:
                    if (this.sprite.currentAnimation != ANIM_SHOOT_RIGHT)
                    {
                        this.sprite.setAnimation(ANIM_SHOOT_RIGHT);
                    }
                    break;
            }
        }
        else switch (this.movtMode)
        {
            case AIR:
                switch (this.direction)
                {
                    case LEFT:
                        if (this.sprite.currentAnimation != ANIM_JUMP_LEFT)
                        {
                            this.sprite.setAnimation(ANIM_JUMP_LEFT);
                        }
                        break;
                    case RIGHT:
                        if (this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
                        {
                            this.sprite.setAnimation(ANIM_JUMP_RIGHT);
                        }
                        break;
                }
                break;
            case LAND:
                switch (striving)
                {            
                    case LEFT:
                        if (this.sprite.currentAnimation != ANIM_WALK_LEFT)
                        {
                            this.sprite.setAnimation(ANIM_WALK_LEFT);
                        }
                        break;
                    case RIGHT:
                        if (this.sprite.currentAnimation != ANIM_WALK_RIGHT)
                        {
                            this.sprite.setAnimation(ANIM_WALK_RIGHT);
                        }
                        break;
                    case STILL:
                        switch (this.direction)
                        {
                            case LEFT:
                                if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
                                {
                                    this.sprite.setAnimation(ANIM_IDLE_LEFT);
                                }
                                break;
                            case RIGHT:
                                if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
                                {
                                    this.sprite.setAnimation(ANIM_IDLE_RIGHT);
                                }
                                break;
                        }
                }
        }
        
        //Setting acceleration

        this.ddy = GRAVITY;
        this.ddx = 0;

        if (this.movtMode == LAND)
        {
            switch (striving)
            {
                case LEFT:
                    if (this.velocity.x > 0) {
                        this.ddx = -FRICTION; //Player skids.
                    }
                    else {
                        this.ddx = this.ddx - ACCEL;  //Player runs to the left.
                    }
                    break;

                case RIGHT:
                    if (this.velocity.x < 0) {
                        this.ddx = FRICTION; //Player skids.
                    }
                    else {
                        this.ddx = this.ddx + ACCEL;  //Player runs to the right.
                    }
                    break;

                case STILL: //Player skids if moving.
                    if (this.velocity.x > 0) {
                        this.ddx = -FRICTION;
                    }
                    else if (this.velocity.x < 0) {
                        this.ddx = FRICTION;
                    }
                    else {
                        this.ddx = 0;
                    }
                    break;
            }
        }

        //Jumping if appropriate
        if (jump && (this.movtMode == LAND))
        {
            this.ddy = this.ddy - JUMP;           //Apply an instantaneous (large) vertical impulse.
            this.movtMode = AIR;
        }

        var wasleft = (this.velocity.x < 0);
        var wasright = (this.velocity.x > 0);

        //Calculating the new position and velocity.
        this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
        this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
        this.velocity.x = bound(this.velocity.x + (deltaTime * this.ddx), -MAXDX, MAXDX);
        this.velocity.y = bound(this.velocity.y + (deltaTime * this.ddy), -MAXDY, MAXDY);

        //Clamping velocity to prevent jiggle.
        if ((wasleft && (this.velocity.x > 0)) || wasright && (this.velocity.x < 0))
        {
            this.velocity.x = 0;
        }

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
        var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
        var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

        //If the player has vertical velocity, then check to see if they have hit a platform
        //below or above, in which case, stop their vertical velocity, and clamp their
        //y position:

        if (this.velocity.y > 0)
        {
            if ((celldown && !cell) || (celldiag && !cellright && nx))
            {
                //clamp the y position to avoid falling into platform below
                this.position.y = tileToPixel(ty);
                this.velocity.y = 0;                //Stop downward velocity.
                this.movtMode = LAND;               //Player is now on land.
                ny = 0;                             //Player no longer overlaps the cells below.
            }
            else this.movtMode = AIR;               //If not on land then airborne (jumping/falling).
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

        
        //Creating a bullet if appropriate

        if (this.cooldownTimer > 0)
        {
            this.cooldownTimer -= deltaTime;
        }

        if (shooting && this.cooldownTimer <= 0)
        {
            sfxFire.play();
            this.shoot();     //Shoot a bullet  
            this.cooldownTimer = 0.3;
        }
    }


Player.prototype.shoot = function()
{
    bullet = new Bullet();
    bullet.position.x = this.position.x;
    bullet.position.y = this.position.y;
    if (this.direction == LEFT)
    {
        bullet.velocity.x = -600;
    }
    else
    {
        bullet.velocity.x = 600;
    }
    bullet.velocity.y = 0;   
    bullets.push(bullet);
}

Player.prototype.respawn = function ()
{
    this.position.set(9 * TILE, 0 * TILE);
    this.velocity.set(0, 0);
    this.state = RUN_JUMP;
    this.movtMode = AIR;
}


Player.prototype.draw = function(worldOffsetX, worldOffsetY)
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y - worldOffsetY);
}

