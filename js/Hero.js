var hurtAnimation = 0;

var hero;
var lastMovement = 0;
var currentWalkImage = 0;
var lastDirectionRight = true; //which dir facing when not moving
var player = function () {
    this.x = 0.0;
    this.y = 0.0;

    this.left = false;
    this.right = false;

    this.playerSpeed = 350.0;

    this.fed = 1.0; //increases each drop

    //for player size.
    this.scale = 1;
    this.width = 30;
    this.height = 60;

    this.points = 0;

    this.lives = 3;

    this.dogeEnabled = false;
}

function draw_hero(ctx) {
    if(play) {
        //ctx.font = ("20px Arial");
        ctx.font = ("20px 'Press Start 2P'");
        ctx.fillStyle = "rgb(211, 84, 0)";
        ctx.fillText("Harvest: " + hero.points, 5*scale, gameHeight - 35*scale);

        ctx.fillStyle = "rgb(15, 15, 40)";
        if(!hero.dogeEnabled) {
            for(var i = 0; i < hero.lives; i++) {
                ctx.drawImage(heroLife, (200 + 32 * i) * scale, gameHeight - 32*scale, 32 * scale, 32 * scale);
            }
        }
        else {
            for(var i = 0; i < hero.lives; i++) {
                ctx.drawImage(dogeLife, (200 + 32 * i) * scale, gameHeight - 32*scale, 32 * scale, 32 * scale);
            }
        }
        ctx.drawImage(amishPower, 0, gameHeight - 29 * scale);
        //ctx.fillText("Amish Power: ", 5*scale, gameHeight - 3*scale);

        if(!hero.dogeEnabled) {
            if(hero.right == false && hero.left == false) {
                if(lastDirectionRight) {
                    ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                    
                }
                else {
                    ctx.drawImage(heroSpriteSheet, 104, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                }
            }
            else if(hero.right) {
                ctx.drawImage(heroSpriteSheet, 104*currentWalkImage, 0, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
            else if(hero.left) {
                ctx.drawImage(heroSpriteSheet, 104*currentWalkImage, 180, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
        }
        else {
            if(hero.right == false && hero.left == false) {
                if(lastDirectionRight) {
                    ctx.drawImage(dogeSpriteSheet, 0, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                    
                }
                else {
                    ctx.drawImage(dogeSpriteSheet, 104, 360, 104, 180, 
                        (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                        (hero.width*1.5)*scale, (hero.height*1.5)*scale);
                }
            }
            else if(hero.right) {
                ctx.drawImage(dogeSpriteSheet, 104*currentWalkImage, 0, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
            else if(hero.left) {
                ctx.drawImage(dogeSpriteSheet, 104*currentWalkImage, 180, 104, 180, 
                    (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                    (hero.width*1.5)*scale, (hero.height*1.5)*scale);
            }
        }
    }
    else {
        if(dogeUnlocked == false) {
            ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                (hero.x - hero.width)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);
        }
        else {
            ctx.drawImage(cursorImage,(hero.x - hero.width*2)*scale + (cursorX*hero.width*3)*scale - 12*scale + hero.width*scale, (hero.y - hero.height)*scale - 16*scale, 14*scale,12*scale);
            ctx.drawImage(heroSpriteSheet, 0, 360, 104, 180, 
                (hero.x + hero.width)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);

            ctx.drawImage(dogeSpriteSheet, 0, 360, 104, 180, 
                (hero.x - hero.width*2)*scale, (hero.y - hero.height)*scale,
                (hero.width*1.5)*scale, (hero.height*1.5)*scale);
        }
    }
}

var updateHero = function(delta) {
    //update hero movement
    if(hero.left) {
        lastMovement += delta;
        if(lastMovement > .15) {
            lastMovement = 0;
            currentWalkImage++
        }
        if(currentWalkImage > 5)
            currentWalkImage = 0;
        if(hero.x > hero.width)
            hero.x -= hero.playerSpeed * delta;
    }
    if(hero.right) {
        lastMovement += delta;
        if(lastMovement > .15) {
            lastMovement = 0;
            currentWalkImage++
        }
        if(currentWalkImage > 5)
            currentWalkImage = 0;
        if(hero.x < gameWidth - (hero.width*5.5))
            hero.x += hero.playerSpeed * delta;
    }
}